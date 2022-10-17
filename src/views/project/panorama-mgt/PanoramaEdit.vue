<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item ref="name" label="资源名称" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item ref="longitude" label="经度" name="longitude">
      <a-input v-model:value="formState.longitude" />
    </a-form-item>
    <a-form-item ref="latitude" label="纬度" name="latitude">
      <a-input v-model:value="formState.latitude" />
    </a-form-item>
    <a-form-item ref="altitude" label="高程" name="altitude">
      <a-input v-model:value="formState.altitude" />
    </a-form-item>
    <a-form-item label="文件路径" name="url">
      <a-input v-model:value="formState.url" />
    </a-form-item>
    <a-form-item label="资源描述" name="description">
      <a-textarea v-model:value="formState.description" />
    </a-form-item>
    <a-form-item label="默认加载" name="isChecked">
      <a-switch v-model:checked="formState.isChecked" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 19, offset: 9 }">
      <a-button type="primary" @click="onSubmit">提交</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { inject, reactive, ref, toRaw, watch } from "vue";
import { message } from "ant-design-vue";
import { updatePanorama } from "../../../assets/js/api_v2";
export default {
  props: { formData: Object },

  setup(props, context) {
    const reload = inject("reload");
    const rules = {
      name: [
        {
          required: true,
          message: "请输入资源名称",
          trigger: "blur",
        },
      ],
      longitude: [
        {
          required: true,
          message: "经度信息非法或为空",
          trigger: "change",
          pattern: new RegExp(/^[1-9]\d*[\.]{0,1}\d*$/, "g"),
        },
      ],
      latitude: [
        {
          required: true,
          message: "纬度信息非法或为空",
          trigger: "change",
          pattern: new RegExp(/^[1-9]\d*[\.]{0,1}\d*$/, "g"),
        },
      ],
      altitude: [
        {
          required: true,
          message: "高程信息非法或为空",
          trigger: "change",
          pattern: new RegExp(/^[1-9]\d*[\.]{0,1}\d*$/, "g"),
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
    const formRef = ref([]);
    const formState = ref({});
    formState.value = { ...props.formData.value };
    formState.value.isChecked = props.formData.value.isChecked == 1 ? true : false;

    const onSubmit = () => {
      formRef.value
        .validate()
        .then((val) => {
          val.isChecked = val.isChecked == true ? 1 : 0;
          val["id"] = formState.value.id;
          updatePanorama(val)
            .then(() => {
              message.success("更新成功");
              reload();
            })
            .catch(() => {
              message.error("更新失败");
            });
        })
        .catch((error) => {
          console.log("error", error);
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
      formState,
      onSubmit,
      resetForm,
      rules,
    };
  },
};
</script>
