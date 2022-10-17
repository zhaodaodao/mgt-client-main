<template>
  <a-row>
    <a-col :span="1"><a-button type="primary" @click="showUserAddModal">新增用户</a-button></a-col>
    <a-col :span="23"></a-col>
  </a-row>
  <a-table
    v-if="data.length != 0"
    rowKey="id"
    :columns="columns"
    :data-source="data"
    :scroll="{ x: 2000, y: 600 }"
    :pagination="pagination"
    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, columnWidth: 5 }"
    @change="handleTableChange"
  >
    <template #action="{ record }">
      <div class="operation-button-box" v-if="userRole < record.role">
        <div class="edit">
          <a-button type="primary" slot="record" @click="showUserEditModal(record)">编辑</a-button>
        </div>

        <div v-if="record.isDisable == 0" class="disable">
          <a-popconfirm
            :title="`确定要禁用用户 ${record.username} 吗？`"
            @confirm="updateDisable(record.id, true)"
            slot="record"
          >
            <a-button type="primary" danger>禁用</a-button>
          </a-popconfirm>
        </div>
        <div v-if="record.isDisable == 1" class="unDisable">
          <a-popconfirm
            :title="`确定要解禁用户 ${record.username} 吗？`"
            @confirm="updateDisable(record.id, false)"
            slot="record"
          >
            <a-button type="primary" ghost>解禁</a-button>
          </a-popconfirm>
        </div>
      </div>
    </template>

    <template #disableState="{ text: isDisable }">
      <CheckCircleTwoTone twoToneColor="#52c41a" v-if="isDisable == 0" />
      <MinusCircleTwoTone twoToneColor="#32457C" v-else />
    </template>
  </a-table>

  <a-modal
    title="修改用户信息"
    style="top: 20px"
    width="600px"
    :destroyOnClose="true"
    v-model:visible="editModalVisible"
    footer=""
  >
    <user-edit :formData="userEditformData" :userRole="userRole"></user-edit>
  </a-modal>

  <a-modal
    title="新增用户"
    style="top: 20px"
    width="600px"
    :destroyOnClose="true"
    v-model:visible="addModalVisible"
    footer=""
  >
    <user-add :userRole="userRole"></user-add>
  </a-modal>
</template>

<script>
import { onBeforeMount } from "vue";

import { toRefs } from "vue";
import { inject, reactive, ref } from "vue";
import { listUser, modifyDisable } from "../../assets/js/api_v2";
import Empty from "@components/Empty.vue";
import UserEdit from "./UserEdit.vue";
import UserAdd from "./UserAdd.vue";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

export default {
  components: {
    Empty,
    CheckCircleTwoTone,
    MinusCircleTwoTone,
    UserEdit,
    UserAdd,
  },

  props: {
    currentRole: Number,
    userRole: Number,
  },

  setup(props) {
    const columns = [
      {
        title: "编号",
        dataIndex: "id",
        width: 5,
        key: "id",
        fixed: "false",
      },
      {
        title: "用户名",
        dataIndex: "username",
        width: 10,
        key: "username",
        fixed: "false",
      },
      {
        title: "角色",
        dataIndex: "roleStr",
        width: 10,
        key: "roleStr",
        fixed: "false",
      },
      {
        title: "创建时间",
        dataIndex: "gmtCreate",
        width: 15,
        key: "gmtCreate",
        fixed: "false",
      },
      {
        title: "最近登录时间",
        dataIndex: "gmtLastLogin",
        width: 15,
        key: "gmtLastLogin",
        fixed: "false",
      },
      {
        title: "用户备注",
        dataIndex: "comment",
        width: 20,
        key: "comment",
        fixed: "false",
      },
      {
        title: "可用状态",
        dataIndex: "isDisable",
        width: 5,
        align: "center",
        key: "isDisable",
        fixed: "right",
        slots: {
          customRender: "disableState",
        },
      },
      {
        title: "操作",
        align: "center",
        key: "operation",
        width: 10,
        fixed: "right",
        slots: {
          customRender: "action",
        },
      },
    ];
    const formData = reactive([]);
    const userEditformData = reactive([]);

    const reload = inject("reload");
    const userRole = ref(Number);
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ["10", "20", "30"],
      showQuickJumper: true,
      showSizeChanger: true,
    });
    var data = ref([]);
    const state = reactive({
      selectedRowKeys: [],
    });

    const onSelectChange = (selectedRowKeys) => {
      state.selectedRowKeys = selectedRowKeys;
    };

    const handleTableChange = (newPagination) => {
      pagination.current = newPagination.current;
      pagination.pageSize = newPagination.pageSize;
      getData();
    };

    const getData = () => {
      listUser({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        query: {
          role: props.currentRole,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          for (let i = 0; i < res.data.data.list.length; i++) {
            let user = res.data.data.list[i];
            res.data.data.list[i].gmtCreate = new Date(user.gmtCreate).toLocaleString();
            res.data.data.list[i].gmtLastLogin =
              user.gmtLastLogin != null ? new Date(user.gmtLastLogin).toLocaleString() : "尚未登录激活账户";
            res.data.data.list[i].roleStr = user.role == -1 ? "超级管理员" : user.role == 0 ? "管理员" : "普通用户";
          }
          data.value = res.data.data.list;
          pagination.total = Number(res.data.data.total);
        } else {
          console.log("查询失败");
        }
      });
    };

    const editModalVisible = ref(false);

    const showUserEditModal = (record) => {
      editModalVisible.value = true;
      userEditformData.value = record;
    };

    const addModalVisible = ref(false);

    const showUserAddModal = ()=>{
      addModalVisible.value = true;
    }

    const updateDisable = (id, disable) => {
      modifyDisable({
        id: id,
        disable: disable ? 1 : 0,
      })
        .then((res) => {
          if (res.data.code == 200) {
            message.success(`${disable == 0 ? "解禁" : "禁用"}成功`);
            reload();
          } else {
            message.error(`${disable == 0 ? "解禁" : "禁用"}失败`);
          }
        })
        .catch(() => {
          message.error(`${disable == 0 ? "解禁" : "禁用"}失败`);
        });
    };

    onBeforeMount(() => {
      console.log(props);
      userRole.value = props.userRole;
      getData();
      if (props.currentRole <= props.userRole) {
        columns.pop();
      }
      console.log(columns);
    });

    return {
      data,
      columns,
      pagination,
      formData,
      userRole,
      editModalVisible,
      userEditformData,
      addModalVisible,

      onSelectChange,
      ...toRefs(state),
      handleTableChange,
      showUserEditModal,
      updateDisable,
      showUserAddModal,
    };
  },
};
</script>
  
<style>
.operation-button-box {
  display: block;
}
.edit {
  float: left;
  margin-left: 10%;
}
.disable {
  float: right;
  margin-right: 10%;
}
.unDisable {
  float: right;
  margin-right: 10%;
}
.add-buttom {
  display: block;
  left: 10px;
}
</style>