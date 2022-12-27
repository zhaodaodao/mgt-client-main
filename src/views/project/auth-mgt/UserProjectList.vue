<template>
  <empty :des="`暂无数据`" v-if="data.length == 0" />
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
          <a-button type="primary" slot="record" @click="updateOne(record.id)">更改权限</a-button>
        </div>
      </div>
    </template>
    <template #checked="{ text: isDisable }">
      <CheckCircleTwoTone twoToneColor="#52c41a" v-if="isDisable == 0" />
      <MinusCircleTwoTone twoToneColor="#32457C" v-else />
    </template>
  </a-table>

</template>
<script>
import { message } from "ant-design-vue";
import { onMounted } from "vue";
import Empty from "@components/Empty.vue";
import { toRefs } from "vue";
import { inject, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Base64 from "@/assets/js/Base64";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons-vue";
import { listUserInfo, updateUserProjectInfo } from "../../../assets/js/api_v2";
const columns = [
  {
    title: "用户id",
    dataIndex: "id",
    width: 5,
    key: "id",
    fixed: "false",
  },
  {
    title: "用户账号",
    dataIndex: "username",
    width: 15,
    key: "username",
    fixed: "false",
  },
  {
    title: "用户权限",
    dataIndex: "role",
    width: 20,
    key: "role",
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
    title: "添加时间",
    width: 10,
    dataIndex: "gmtCreate",
    key: "gmtCreate",
  },
  {
    title: "修改时间",
    width: 10,
    dataIndex: "gmtModify",
    key: "gmtModify",
  },
  {
    title: "状态",
    align: "center",
    width: 5,
    dataIndex: "isDisable",
    key: "isDisable",
    fixed: "right",
    slots: {
      customRender: "checked",
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
export default {
  components: {
    Empty,
    CheckCircleTwoTone,
    MinusCircleTwoTone,
  },
  componet: {
    Base64,
  },
  setup(props) {
    const route = useRoute();
    const project = ref(Base64.decode(route.query.info));
    const formData = reactive([]);
    const reload = inject("reload");
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ["10", "20", "30"],
      showQuickJumper: true,
      showSizeChanger: true,
    });
    let data = ref([]);
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
      listUserInfo({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        query: {
          pid: project.value.id,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          for (let i = 0; i < res.data.data.list.length; i++) {
            res.data.data.list[i].gmtCreate = new Date(res.data.data.list[i].gmtCreate).toLocaleString();
            res.data.data.list[i].gmtModify = new Date(res.data.data.list[i].gmtModify).toLocaleString();
          }
          data.value = res.data.data.list;
          pagination.total = Number(res.data.data.total);
        } else {
          console.log("查询失败");
        }
      });
    };
    const updateOne = (id) => {
      updateUserProjectInfo(id)
        .then(() => {
          message.success("删除成功");
          reload();
        })
        .catch(() => {
          message.error("删除失败");
        });
    };
    onMounted(() => {
      getData();
    });
    return {
      data,
      columns,
      pagination,
      formData,
      project,
      onSelectChange,
      ...toRefs(state),
      handleTableChange,
      updateOne,
    };
  },
};
</script>

<style scoped>
.operation-button-box {
  display: block;
}
.edit {
  float: left;
  margin-left: 10%;
}
.delete {
  float: right;
  margin-right: 10%;
}
.add-buttom {
  display: block;
  left: 20px;
}
</style>
