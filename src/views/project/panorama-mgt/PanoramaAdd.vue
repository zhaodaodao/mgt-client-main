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
    <!-- <a-form-item label="上传全景图文件" name="file">
      <a-upload
        v-model:file-list="fileList"
        name="file"
        :multiple="false"
        :action="`${appName}${panoramaDataApi}/upload/file`"
        :headers="headers"
        @change="handleChange"
        accept=".zip"
      >
        <a-button>
          <upload-outlined></upload-outlined>
          点击上传
        </a-button>
      </a-upload>
    </a-form-item> -->
    <a-form-item :wrapper-col="{ span: 14, offset: 9 }">
      <a-button type="primary" @click="onSubmitV2">提交</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { reactive, ref, inject } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { addPanorama, APP_NAME } from "../../../assets/js/api_v2.js";
export default {
  components: {
    UploadOutlined,
  },

  props: {
    project: Object,
  },
  setup(props) {
    const appName = APP_NAME;
    const formRef = ref();
    const url = ref("");
    const reload = inject("reload");
    const project = props.project;
    const isUploading = ref(false);
    const formState = reactive({
      name: "",
      isChecked: true,
      description: "",
    });
    const fileList = ref([]);

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

    const onSubmitV2 = () => {
      formRef.value.validate().then((val) => {
        let { ...data } = val;
        data["isChecked"] = val.isChecked == 1 ? 1 : 0;
        data["projectId"] = project["id"];
        addPanorama(data).then((res) => {
          if (res.data.code == 200) {
            message.success("添加成功");
            reload();
          } else {
            message.error("添加失败,请确认后重新提交");
          }
        });
      });
    };

    const onSubmit = () => {
      formRef.value
        .validate()
        .then((val) => {
          if (url.value === "") {
            message.error("文件未上传");
          } else {
            var { file, ...data } = val;
            data["url"] = url.value;
            data["projectId"] = project["id"];
            data["isChecked"] = val.isChecked == 1 ? 1 : 0;
            console.log(data);
            addPanorama(data).then((res) => {
              if (res.data.code == 200) {
                message.success("添加成功");
                reload();
              } else {
                message.error("添加失败,请重新提交并确认文件正确性");
                fileList.value.pop();
              }
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const fileUpload = (info) => {
      if (fileList.value.length == 1) {
        return;
      }
      panoramaUpload(info.file)
        .then((res) => {
          if (res.data.code == 200) {
            url.value = res.data.data;
            message.success(`${info.file.name} 文件上传成功`);
          } else {
            message.error(`${info.file.name} 文件上传失败`);
          }
        })
        .catch(() => {
          fileList.value.pop();
        })
        .finally(() => {
          isUploading.value = false;
          fileList.value[0]["status"] = "done";
        });
    };

    const handleChange = (info) => {
      if (fileList.value.length == 2) {
        message.error("仅支持单次上传一个压缩包");
        fileList.value.pop();
        isUploading.value = false;
        return;
      }

      if (info.file.status == "uploading") {
        isUploading.value = true;
      }

      if (info.file.status == "done") {
        message.success(`${info.file.name} 文件上传成功`);
        isUploading.value = false;
        url.value = info.file.response.data;
      }
    };

    return {
      formRef,
      appName,
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 22,
      },
      other: "",
      formState,
      rules,
      isUploading,
      onSubmit,
      resetForm,
      fileList,
      headers: {},
      handleChange,
      fileUpload,
      onSubmitV2,
    };
  },
};
</script>
