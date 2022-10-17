<template>
  <a-button class="add-buttom" type="primary" @click="showOsgbAddModal(true)">添加</a-button>
  <a-table
    v-if="data.length != 0"
    rowKey="id"
    :columns="columns"
    :data-source="data"
    :scroll="{ x: 2000, y: 600 }"
    :pagination="pagination"
    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, columnWidth: 5 }"
    :loading="isLoading"
    @change="handleTableChange"
  >
    <template #action="{ record }">
      <div class="operation-button-box">
        <div class="edit">
          <a-button type="primary" slot="record" @click="showOsgbEditModal(true, record)">编辑</a-button>
        </div>

        <div class="delete">
          <a-popconfirm :title="`确定要从项目中移除 ${record.name} 吗？`" @confirm="deleteOne(record)" slot="record">
            <a-button type="primary" danger>删除</a-button>
          </a-popconfirm>
        </div>
      </div>
    </template>
    <template #checked="{ text: isChecked }">
      <CheckCircleTwoTone twoToneColor="#52c41a" v-if="isChecked == 1" />
      <MinusCircleTwoTone twoToneColor="#32457C" v-else />
    </template>
  </a-table>
  <empty :des="`暂无数据`" v-if="data.length == 0" />
  <a-modal
    title="将倾斜模型添加至项目"
    :destroyOnClose="true"
    style="top: 20px"
    width="800px"
    v-model:visible="osgbAddModalVisible"
    :footer="null"
  >
    <osgb-add :project="project"></osgb-add>
  </a-modal>

  <a-modal
    title="编辑"
    style="top: 20px"
    width="800px"
    :destroyOnClose="true"
    v-model:visible="osgbEditModalVisible"
    footer=""
  >
    <osgb-edit :osgb="osgb" :project="project"></osgb-edit>
  </a-modal>
</template>
<script>
import { defineComponent, onMounted, ref, reactive, toRefs } from "vue";
import OsgbAdd from "./OsgbAdd.vue";
import OsgbEdit from "./OsgbEdit.vue";
import { deleteOsgbFromProject, listOsgbFromProject } from "../../../assets/js/api_v2";
import Base64 from "../../../assets/js/Base64";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import Empty from "@components/Empty.vue";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons-vue";
export default defineComponent({
  components: {
    OsgbAdd,
    OsgbEdit,
    Empty,
    CheckCircleTwoTone,
    MinusCircleTwoTone,
  },
  data() {
    const columns = [
      {
        title: "资源名称",
        dataIndex: "name",
        width: 5,
        key: "name",
        fixed: "false",
      },
      {
        title: "文件路径",
        dataIndex: "url",
        width: 15,
        key: "url",
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
        title: "资源描述",
        dataIndex: "description",
        width: 20,
        key: "description",
        fixed: "false",
      },
      {
        title: "默认加载",
        align: "center",
        width: 5,
        dataIndex: "isChecked",
        key: "isChecked",
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
    return {
      columns,
    };
  },

  setup() {
    const route = useRoute();
    /**
     * 列表数据对象
     */
    const data = ref([]);
    /**
     * 加载状态
     */
    const isLoading = ref(false);

    /**
     * 选中的osgb对象
     */
    const osgb = ref({});

    /**
     * 从路由中获取的project信息
     */
    const project = ref(Base64.decode(route.query.info));

    const state = reactive({
      selectedRowKeys: [],
    });
    /**
     * 选中改变
     * @param {*} selectedRowKeys
     */
    const onSelectChange = (selectedRowKeys) => {
      state.selectedRowKeys = selectedRowKeys;
    };

    /**
     * 添加对话框
     */
    const osgbAddModalVisible = ref(false);
    const showOsgbAddModal = (visible) => {
      osgbAddModalVisible.value = visible;
    };

    /**
     * 编辑对话框
     */
    const osgbEditModalVisible = ref(false);
    const showOsgbEditModal = (visible, record) => {
      osgbEditModalVisible.value = visible;
      osgb.value = record;
    };

    /**
     * 分页信息
     */
    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ["10", "20", "30"],
      showQuickJumper: true,
      showSizeChanger: true,
    });

    /**
     * 处理表格改变
     * @param {*} p
     */
    const handleTableChange = (p) => {
      console.log(p);
      pagination.current = p.current;
      pagination.pageSize = p.pageSize;
      fetchData();
    };

    /**
     * 获取数据
     */
    const fetchData = () => {
      isLoading.value = true;
      listOsgbFromProject({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        query: {
          projectId: project.value.id,
        },
      })
        .then((res) => {
          if (res.data.code == 200) {
            pagination.total = res.data.data.total;
            for (let i = 0; i < res.data.data.list.length; i++) {
              res.data.data.list[i].gmtCreate = new Date(res.data.data.list[i].gmtCreate).toLocaleString();
              res.data.data.list[i].gmtModify = new Date(res.data.data.list[i].gmtModify).toLocaleString();
            }
            data.value = res.data.data.list;
          } else {
            console.log("查询失败");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    /**
     * 删除一条记录
     * @param {*} record 删除记录对象
     */
    const deleteOne = (record) => {
      deleteOsgbFromProject(record.id)
        .then((res) => {
          if (res.data.code == 200) {
            message.success("移除成功");
            fetchData();
          } else {
            message.error("移除失败");
          }
        })
        .catch((err) => {
          message.error("移除失败");
        });
    };

    onMounted(() => {
      fetchData();
    });
    return {
      data,
      isLoading,
      osgbAddModalVisible,
      osgbEditModalVisible,
      pagination,
      project,
      osgb,
      ...toRefs(state),
      onSelectChange,
      showOsgbAddModal,
      showOsgbEditModal,
      fetchData,
      handleTableChange,
      deleteOne,
    };
  },
});
</script>

<style lang="less" scoped>
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
