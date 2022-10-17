<template>
  <a-button class="add-buttom" type="primary" @click="showTiffAddModal(true)">添加</a-button>
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
          <a-button type="primary" slot="record" @click="showTiffEditModal(true, record)">编辑</a-button>
        </div>

        <div class="delete">
          <a-popconfirm :title="`确定要从项目中移除 ${record.name} 吗？`" @confirm="deleteOne(record.id)" slot="record">
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
  <a-modal
    title="添加卫星图片(tif)"
    :destroyOnClose="true"
    style="top: 20px"
    width="800px"
    v-model:visible="modal1Visible"
    footer=""
  >
    <tiff-add :project="project"></tiff-add>
  </a-modal>

  <a-modal
    title="编辑"
    style="top: 20px"
    width="800px"
    :destroyOnClose="true"
    v-model:visible="modal2Visible"
    footer=""
  >
    <tiff-edit :formData="formData"></tiff-edit>
  </a-modal>
</template>
<script>
import { message } from "ant-design-vue";
import { onMounted } from "vue";

import { toRefs } from "vue";
import { inject, reactive, ref } from "vue";
import { deleteTiff, listTiff } from "../../../assets/js/api_v2";
import { useRoute } from "vue-router";
import Base64 from "@/assets/js/Base64";
import Empty from "@components/Empty.vue";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons-vue";

import TiffAdd from "@views/project/tiff-mgt/TiffAdd.vue";
import TiffEdit from "@views/project/tiff-mgt/TiffEdit.vue";
const columns = [
  {
    title: "资源名称",
    dataIndex: "name",
    width: 5,
    key: "name",
    fixed: "false",
  },
  {
    title: "文件夹路径",
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
export default {
  components: {
    TiffAdd,
    TiffEdit,
    Empty,
    CheckCircleTwoTone,
    MinusCircleTwoTone,
  },

  setup() {
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
    var data = ref([]);
    const state = reactive({
      selectedRowKeys: [],
    });

    const modal1Visible = ref(false);
    const showTiffAddModal = (visible) => {
      modal1Visible.value = visible;
    };

    const modal2Visible = ref(false);
    const showTiffEditModal = (visible, record) => {
      modal2Visible.value = visible;
      formData.value = record;
    };
    const onSelectChange = (selectedRowKeys) => {
      state.selectedRowKeys = selectedRowKeys;
    };

    const handleTableChange = (newPagination) => {
      pagination.current = newPagination.current;
      pagination.pageSize = newPagination.pageSize;
      getData();
    };
    const getData = () => {
      listTiff({
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        query: {
          projectId: project.value.id,
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
    const deleteOne = (id) => {
      deleteTiff(id)
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
      modal1Visible,
      modal2Visible,
      pagination,
      formData,
      project,
      onSelectChange,
      ...toRefs(state),
      handleTableChange,
      deleteOne,
      showTiffAddModal,
      showTiffEditModal,
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
.delete {
  float: right;
  margin-right: 10%;
}
.add-buttom {
  display: block;
  left: 20px;
}
</style>
