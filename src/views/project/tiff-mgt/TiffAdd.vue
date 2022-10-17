<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item ref="name" label="资源名称" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item label="默认加载" name="isChecked">
      <a-switch v-model:checked="formState.isChecked" />
    </a-form-item>
    <a-form-item label="文件夹路径" name="url">
      <a-input v-model:value="formState.url" />
    </a-form-item>
    <a-form-item label="资源描述" name="description">
      <a-textarea v-model:value="formState.description" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 18, offset: 9 }">
      <a-button type="primary" @click="onSubmit">提交</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { reactive, ref, inject } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { addTiff } from "../../../assets/js/api_v2.js";
export default {
  components: {
    UploadOutlined,
  },

  props: {
    project: Object,
  },
  setup(props) {
    const formRef = ref();
    const reload = inject("reload");
    const project = props.project;
    const formState = reactive({
      name: "",
      isChecked: false,
      description: "",
      url: "",
    });

    const rules = reactive({
      name: [
        {
          required: true,
          message: "请输入资源名称",
          trigger: "blur",
        },
      ],
      url: [
        {
          required: true,
          message: "请输入文件夹路径",
          trigger: "blur",
        },
      ],
    });

    const onSubmit = () => {
      formRef.value.validate().then((val) => {
        let { ...data } = val;
        data["isChecked"] = val.isChecked == 1 ? 1 : 0;
        data["projectId"] = project["id"];
        addTiff(data)
          .then((res) => {
            if (res.data.code == 200) {
              message.success("添加成功");
              reload();
            } else {
              message.error("添加失败,请确认后重新提交");
            }
          })
          .catch((res) => {
            message.error("添加失败,请确认后重新提交");
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
      rules,
      formState,
      resetForm,
      onSubmit,
    };
  },
};
</script>
