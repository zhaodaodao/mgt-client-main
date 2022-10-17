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
    <a-form-item :wrapper-col="{ span: 14, offset: 9 }">
      <a-button type="primary" @click="onSubmit" :loading="isCreating">添加</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive, ref, inject } from "vue";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { addOsgbToProject } from "../../../assets/js/api_v2";
import { message } from "ant-design-vue";

export default defineComponent({
  props: {
    project: Object,
  },
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  setup(props) {
    const project = props.project;

    const reload = inject("reload");
    const formRef = ref();
    const postfix = ref("\\tileset.json");
    const newOsgb = reactive({
      name: "",
      projectId: project.id,
      url: "",
      isChecked: true,
    });

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
          message: "请输入模型完整路径",
          trigger: "blur",
        },
      ],
    };

    const isCreating = ref(false);
    /**
     * 表单提交
     */
    const onSubmit = () => {
      formRef.value.validate().then(() => {
        isCreating.value = true;
        let { ...data } = newOsgb;
        data["url"] = `${newOsgb.url}${postfix.value}`;
        data["isChecked"] = newOsgb.isChecked == true ? 1 : 0;
        data["projectId"] = project["id"];
        addOsgbToProject(data)
          .then((res) => {
            if (res.data.code == 200) {
              message.success("添加模型资源成功");
              reload();
            } else {
              message.error("添加模型资源失败");
            }
          })
          .catch(() => {
            message.error("添加模型资源失败");
          })
          .finally(() => {
            isCreating.value = false;
          });
      });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };

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

      onSubmit,
      resetForm,
      postfix,
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
