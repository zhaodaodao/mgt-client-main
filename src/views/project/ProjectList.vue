<template>
  <a-modal v-model:visible="visible" title="新建项目" :footer="null">
    <project-add></project-add>
  </a-modal>
  <div>
    <a-page-header :ghost="false">
      <a-layout-content style="display: flex; justify-content: space-between; align-items: center">
        <a-typography-title :level="3">项目列表</a-typography-title>
        <a-button type="primary" size="large" @click="showCreateNewProjectModal" :disabled="err500">新建项目</a-button>
      </a-layout-content>
    </a-page-header>
    <a-spin :spinning="isLoading" tip="Loading...">
      <div class="card-container" v-if="!isLoading && card">
        <a-list v-if="!err500" :data-source="data.value" :grid="{ gutter: 16, column: 4 }">
          <template #renderItem="{ item }">
            <a-list-item>
              <project-card :project="item"></project-card>
            </a-list-item>
          </template>
        </a-list>
        <img
          v-if="err500"
          style="height: 60%; width: 60%"
          src="../../../public/img/500.png"
          alt="服务器异常"
          srcset=""
        />
      </div>
    </a-spin>
    <div class="list-container" v-if="!isLoading && !card">
      <a-table></a-table>
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { reactive, ref } from "@vue/reactivity";
import Empty from "@components/Empty.vue";
import ProjectCard from "@components/ProjectCard.vue";
import ProjectAdd from "./ProjectAdd.vue";
import { DownOutlined, EditFilled, DeleteFilled, EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import { onMounted } from "vue";

export default {
  components: {
    Empty,
    ProjectCard,
    ProjectAdd,

    DownOutlined,
    EditFilled,
    DeleteFilled,
    EditOutlined,
    DeleteOutlined,
  },

  setup() {
    const PROJECT_DATA_API = "/api/project";

    /**
     * cesium 页面url
     */
    const cesiumWorkUrl = ref("");

    /**
     * 新建项目对话框是否可见
     */
    const visible = ref(false);
    /**
     * 展示新建项目对话框
     */
    const showCreateNewProjectModal = () => {
      visible.value = true;
    };

    /**
     * 项目是否创建中
     */
    const creating = ref(false);
    /**
     * 新的项目对象
     */
    const newProject = reactive({});
    /**
     * 新建项目
     */
    const createNewProject = () => {
      if (typeof newProject.name !== "undefined") {
        if (new String(newProject.name).replace(/[ ]/g, "").length !== 0) {
          creating.value = true;
          return axios
            .post(`${PROJECT_DATA_API}/create?name=${newProject.name}`)
            .then((res) => {
              creating.value = false;
              visible.value = false;
              if (res.data.code === 200) {
                message.success("创建成功", 4);
              } else {
                message.error("创建失败", 4);
              }
              fetchData();
            })
            .catch(() => {
              creating.value = false;
              visible.value = false;
              message.error("创建失败", 4);
            });
        }
      }
      message.error("项目名不能为空", 4);
    };

    /**
     * project list
     */
    const data = reactive({});
    /**
     * 项目列表是否加载中
     */
    const isLoading = ref(true);
    /**
     * 服务端错误标记
     */
    const err500 = ref(false);
    /**
     * 获取项目列表数据
     */
    const fetchData = () => {
      isLoading.value = true;
      axios
        .post(`${PROJECT_DATA_API}/list`)
        .then((res) => {
          data.value = res.data.data;
          isLoading.value = false;
          err500.value = false;
        })
        .catch(function () {
          err500.value = true;
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    onMounted(() => {
      console.log("enter projectList");
      fetchData();
    });

    return {
      activeKey: ref("1"),
      card: ref(true),
      data,
      isLoading,
      visible,
      clientWidth: document.documentElement.clientWidth,
      newProject,
      creating,
      err500,
      cesiumWorkUrl,

      showCreateNewProjectModal,
      createNewProject,
    };
  },
};
</script>

<style scopd>
.top-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-container {
  margin-top: 30px;
  min-height: 600px;
}
.ant-tabs-bar,
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  border: none;
}
.card-container > .ant-tabs-card > .ant-tabs-bar {
  display: flex;
}
.card-container p {
  margin: 0;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  padding: 0px 22px;
  font-size: 16px;
}
.card-container > .ant-tabs-card .ant-tabs-content {
  margin-top: -16px;
}
.card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  padding: 16px;
  background: #fff;
}
.card-container > .ant-tabs-card > .ant-tabs-nav::before {
  display: none;
}
.card-container > .ant-tabs-card .ant-tabs-tab,
[data-theme="compact"] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}
.card-container > .ant-tabs-card .ant-tabs-tab-active,
[data-theme="compact"] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #fff;
  border-color: #fff;
}
#components-tabs-demo-card-top .code-box-demo {
  padding: 24px;
  overflow: hidden;
  background: #f5f5f5;
}
[data-theme="compact"] .card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -8px;
}
[data-theme="dark"] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}
[data-theme="dark"] #components-tabs-demo-card-top .code-box-demo {
  background: #000;
}
[data-theme="dark"] .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  background: #141414;
}
[data-theme="dark"] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #141414;
  border-color: #141414;
}

.area-card {
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.ant-card-meta-title,
.ant-card-meta-description {
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.ant-card-meta-title {
  font-size: 16px;
  line-height: 18px;
  font-weight: 500;
  font-style: normal;
}

.ant-card-actions {
  border-radius: 0 0 5px 5px;
}

.ant-modal-content {
  width: 620px;
}
</style>
