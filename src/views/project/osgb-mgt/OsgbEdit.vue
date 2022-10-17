<template>
  <a-form ref="formRef" :model="newOsgb" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item ref="name" label="资源名称" name="name" required>
      <a-input v-model:value="newOsgb.name" />
    </a-form-item>
    <a-form-item label="文件路径" required name="url">
      <a-input :addon-after="postfix" v-model:value="newOsgb.url" />
    </a-form-item>
    <a-form-item label="默认加载" name="isChecked">
      <a-switch v-model:checked="newOsgb.isChecked" />
    </a-form-item>
    <a-form-item label="关联地形数据" name="associatedTerrain">
      <a-select
        v-model:value="associatedTerrainName"
        :loading="isLoading"
        :options="terrainList"
        @change="handleSelectChange"
        show-search
      ></a-select>
      <a-button type="default" shape="circle" size="small" @click="resetAssociatedTerrain">
        <template #icon>
          <DisconnectOutlined />
        </template>
      </a-button>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
      <a-button type="primary" @click="onSubmit" :loading="isCreating">确认</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, ref, inject, onMounted } from "vue";
import { PlusOutlined, LoadingOutlined, DisconnectOutlined } from "@ant-design/icons-vue";
import {
  editOsgbToProject,
  listTerrainByProjectId,
  updateAssociatedOsgb,
  dissociateOsgb,
} from "../../../assets/js/api_v2";
import { message } from "ant-design-vue";

export default defineComponent({
  props: {
    osgb: Object,
    project: Object,
  },
  components: {
    PlusOutlined,
    LoadingOutlined,
    DisconnectOutlined,
  },
  setup(props) {
    const osgb = props.osgb;
    const project = props.project;
    const postfix = ref("\\tileset.json");
    const newOsgb = ref({ ...osgb });
    newOsgb.value.isChecked = newOsgb.value.isChecked == 1 ? true : false;
    let length = newOsgb.value["url"].length;
    newOsgb.value["url"] = newOsgb.value["url"].substring(0, length - postfix.value.length);
    const reload = inject("reload");
    const formRef = ref();

    const rules = {
      name: [
        {
          required: true,
          message: "请输入资源名称",
          trigger: "blur",
        },
        {
          min: 1,
          max: 64,
          message: "少于64字",
          trigger: "blur",
        },
      ],
      url: [
        {
          required: true,
          message: "请输入文件路径",
          trigger: "blur",
        },
      ],
    };

    const isLoading = ref(false);

    const isCreating = ref(false);

    const terrainList = ref([]);

    const associatedTerrainName = ref("");

    let associatedTerrain = {};

    const handleSelectChange = (value, option) => {
      associatedTerrain = { ...option };
      associatedTerrain.associatedOsgbId = osgb.id;
    };

    const resetAssociatedTerrain = () => {
      associatedTerrain = {};
      associatedTerrain.associatedOsgbId = "";
      associatedTerrainName.value = "";
    };

    const fetchTerrainData = () => {
      isLoading.value = true;
      const projectId = project.id;
      listTerrainByProjectId(projectId)
        .then((res) => {
          if (res.data.code === 200) {
            res.data.data.forEach((ter) => {
              // 当前关联的地形对象
              if (ter.associatedOsgbId == osgb.id) {
                ter.disabled = false;
                associatedTerrain = { ...ter };
                associatedTerrainName.value = associatedTerrain.name;
              }
              terrainList.value.push({
                value: `${ter.name}${
                  ter.associatedOsgbId === null || ter.disabled == false ? "" : " （已被其他模型关联）"
                }`, // 名称作为value
                id: ter.id,
                disabled: ter.associatedOsgbId === null || ter.disabled == false ? false : true,
              });
            });
            // // 找到第一个可用的ter
            // associatedTerrainName.value = terrainList.value.find((ter) => {
            //   return ter.disabled === false;
            // }).value;
          }
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    /**
     * 表单提交
     */
    const onSubmit = () => {
      isCreating.value = true;
      formRef.value.validate().then((val) => {
        let { ...data } = { ...val };
        data.isChecked = data.isChecked == true ? 1 : 0;
        data["projectId"] = newOsgb.value.projectId;
        data["id"] = newOsgb.value.id;
        data["url"] = `${val.url}${postfix.value}`;
        // 修改数据请求
        editOsgbToProject(data)
          .then((res) => {
            if (res.data.code == 200) {
              // 修改terrain
              if (
                "" == associatedTerrain.associatedOsgbId ||
                typeof associatedTerrain.associatedOsgbId === "undefined"
              ) {
                // 移除关联
                dissociateOsgb(data["id"])
                  .then((res) => {
                    if (res.data.code == 200) {
                      message.success("模型信息修改成功");
                    } else {
                      message.error("修改失败");
                    }
                  })
                  .catch(() => {
                    message.error("修改失败");
                  });
              } else {
                updateAssociatedOsgb(associatedTerrain)
                  .then((res) => {
                    if (res.data.code == 200) {
                      message.success("模型信息修改成功");
                    } else {
                      message.error("修改失败");
                    }
                  })
                  .catch(() => {
                    message.error("修改失败");
                  });
              }
              reload();
            }
          })
          .catch(() => {
            message.error("修改失败");
          })
          .finally(() => {
            isCreating.value = false;
          });
      });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };

    onMounted(() => {
      fetchTerrainData();
    });

    return {
      formRef,
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 22,
      },
      other: "",
      newOsgb,
      rules,
      isCreating,
      terrainList,
      isLoading,
      associatedTerrain,
      associatedTerrainName,
      postfix,
      handleSelectChange,
      onSubmit,
      resetForm,
      resetAssociatedTerrain,
    };
  },
});
</script>
<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
