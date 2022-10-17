<template>
  <a-card hoverable :loading="isLoading" :title="project.name" size="small">
    <template #cover>
      <img alt="example" :src="project.imgUrl == null ? require(`../../public/img/021.png`) : project.imgUrl" />
    </template>
    <template #extra><a :href="`${cesiumPageUrl()}/#/?info=${projectBase64}`" target="_blank">查看</a></template>
    <router-link :to="{ name: `ProjectEditOsgb`, query: { info: projectBase64 } }">
      <a-card-grid style="width: 50%; text-align: center">
        <a-statistic title="倾斜模型" :value="data.osgbCount" />
      </a-card-grid>
    </router-link>
    <router-link :to="{ name: `ProjectEditKml`, query: { info: projectBase64 } }">
      <a-card-grid style="width: 50%; text-align: center"
        ><a-statistic title="KML" :value="data.kmlLayerCount" />
      </a-card-grid>
    </router-link>
    <router-link :to="{ name: `ProjectEditArtificial`, query: { info: projectBase64 } }">
      <a-card-grid style="width: 50%; text-align: center">
        <a-statistic title="人工模型" :value="data.artificialLayerCount" />
      </a-card-grid>
    </router-link>
    <router-link :to="{ name: `ProjectEditPanorama`, query: { info: projectBase64 } }">
      <a-card-grid style="width: 50%; text-align: center">
        <a-statistic title="全景图" :value="data.panoramaCount" />
      </a-card-grid>
    </router-link>
    <a-card-grid style="width: 100%; text-align: left" :hoverable="false">
      <a-typography-text type="secondary" class="introduction">
        {{ project.introduction }}
      </a-typography-text>
    </a-card-grid>
    <template #actions>
      <div class="modify-time-wrapper">
        <a-typography-text type="secondary">{{ new Date(project.gmtModify).toLocaleString() }}</a-typography-text>
      </div>
      <div class="actions">
        <div class="action-modify" @click="gotoEdit">
          <edit-outlined key="edit" />
        </div>
        <a-divider type="vertical" style="height: 22px"></a-divider>
        <div class="action-delete" @click="showDeleteProjectModal">
          <delete-outlined key="delete" />
        </div>
      </div>
    </template>
  </a-card>
  <a-modal title="警告" v-model:visible="visible" :confirm-loading="confirmLoading" @ok="handleOk">
    <p>
      确定要删除项目
      <a-typography-link href="https://antdv.com" target="_blank">
        {{ project.name }}
      </a-typography-link>
      吗？
    </p>
  </a-modal>
</template>

<script>
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, toRefs, inject } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

import Base64 from "../assets/js/Base64";
import { deleteProject } from "../assets/js/api";
import { cesiumPageUrl } from "../assets/js/api_v2";

export default {
  name: "ProjectCard",
  components: {
    EditOutlined,
    DeleteOutlined,
  },

  props: {
    project: Object,
  },

  setup(props) {
    const reload = inject("reload");
    const { project } = toRefs(props);
    const PROJECT_DATA_API = "/api/project";
    const router = useRouter();

    const showDeleteProjectModal = () => {
      visible.value = true;
    };

    /**
     * 统计数据
     */
    const data = ref({});

    const projectBase64 = Base64.encode(project.value);
    /**
     * 获取项目统计数据
     */
    const isLoading = ref(true);

    const fetchData = () => {
      isLoading.value = true;
      axios
        .post(`${PROJECT_DATA_API}/stat?id=${project.value.id}`)
        .then((res) => {
          data.value = res.data.data;
          isLoading.value = false;
        })
        .catch(() => {
          isLoading.value = false;
        });
    };

    const visible = ref(false);
    const confirmLoading = ref(false);
    /**
     * 删除项目
     */
    const handleOk = () => {
      visible.value = true;
      confirmLoading.value = true;
      deleteProject(project.value.id)
        .then((res) => {
          if (res.data.code === 200) {
            message.success("删除成功", 4);
            reload();
          } else {
            message.error("未知错误", 4);
            confirmLoading.value = false;
          }
        })
        .finally(() => {
          visible.value = false;
          confirmLoading.value = false;
        });
    };

    /**
     * 前往编辑页面
     */
    const gotoEdit = () => {
      router.push({
        name: "ProjectEdit",
        query: {
          info: Base64.encode(project.value),
        },
      });
    };

    onMounted(() => {
      fetchData();
    });

    return {
      isLoading,
      data,
      visible,
      confirmLoading,
      projectBase64,
      handleOk,
      gotoEdit,
      showDeleteProjectModal,
      cesiumPageUrl,
    };
  },

  computed() {},
};
</script>

<style lang="less" scoped>
p,
div {
  text-align: start;
}

span {
  color: @primary-color;
}

.modify-time-wrapper {
  text-align: center;
}

.actions {
  display: flex;
  justify-content: center;
  .action-modify,
  .action-delete {
    width: 50%;
    text-align: center;
  }
}

.introduction {
  display: -webkit-box;
  display: -moz-box;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
