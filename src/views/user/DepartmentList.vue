<template>
  <a-row>
    <a-col :span="1"><a-button type="primary" @click="showDepartmentAddModal">新增部门</a-button></a-col>
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
      <div class="operation-button-box">
        <div class="edit">
          <a-button type="primary" slot="record" @click="showDepartmentEditModal(record)">编辑</a-button>
        </div>


        <div class="delete">
          <a-popconfirm :title="`确定要从项目中移除 ${record.name} 吗？`" @confirm="deleteOne(record.id)" slot="record">
            <a-button type="primary" danger>删除</a-button>
          </a-popconfirm>
        </div>
      </div>

    </template>
  </a-table>

  <a-modal
    title="修改部门信息"
    style="top: 20px"
    width="600px"
    :destroyOnClose="true"
    v-model:visible="editModalVisible"
    footer=""
  >
    <department-edit :formData="departmentEditformData"></department-edit>
  </a-modal>

  <a-modal
    title="新增部门"
    style="top: 20px"
    width="600px"
    :destroyOnClose="true"
    v-model:visible="addModalVisible"
    footer=""
  >
    <department-add></department-add>
  </a-modal>
</template>

<script>
import { onBeforeMount } from "vue";

import { toRefs } from "vue";
import { inject, reactive, ref } from "vue";
import { deleteDepartment, listDepartment } from "../../assets/js/api_v2";
import Empty from "@components/Empty.vue";
import DepartmentEdit from "@views/user/DepartmentEdit";
import DepartmentAdd from "@views/user/DepartmentAdd";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";


export default {
  components: {
    Empty,
    CheckCircleTwoTone,
    MinusCircleTwoTone,
    DepartmentEdit,
    DepartmentAdd,
  },

  props: {
    formData:Object
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
        title: "部门名称",
        dataIndex: "name",
        width: 10,
        key: "name",
        fixed: "false",
      },
      {
        title: "部门经理",
        dataIndex: "manager",
        width: 10,
        key: "manager",
        fixed: "false",
      },
      {
        title: "部门地址",
        dataIndex: "address",
        width: 15,
        key: "address",
        fixed: "false",
      },
      {
        title: "用户数量",
        dataIndex: "userCount",
        width: 15,
        key: "userCount",
        fixed: "false",
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
    const departmentEditformData = reactive([]);
    const reload = inject("reload");

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
      listDepartment({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        query: {

        },
      }).then((res) => {
        if (res.data.code == 200) {
          data.value = res.data.data.list;
          pagination.total = Number(res.data.data.total);
          data.value.userCount = Number(data.value.userCount);
        } else {
          console.log("查询失败");
        }
      });
    };

    const deleteOne = (id) => {
      deleteDepartment(id)
        .then(() => {
          message.success("删除成功");
          reload();
        })
        .catch(() => {
          message.success("删除失败");
        });
    };

    // 展示修改按钮
    const editModalVisible = ref(false);

    const showDepartmentEditModal = (record) => {
      editModalVisible.value = true;
      departmentEditformData.value = record;
    };

    // 展示添加按钮
    const addModalVisible = ref(false);

    const showDepartmentAddModal = ()=>{
      addModalVisible.value = true;
    }

    onBeforeMount(() => {
      console.log(props);
      getData();
      console.log(columns);
    });

    return {
      data,
      columns,
      pagination,
      formData,
      editModalVisible,
      departmentEditformData,
      addModalVisible,

      onSelectChange,
      ...toRefs(state),
      handleTableChange,
      showDepartmentEditModal,
      showDepartmentAddModal,
      deleteOne,
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