<template>
  <a-form ref="formRef" :model="newProject" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item ref="name" label="项目名" name="name" required>
      <a-input v-model:value="newProject.name" />
    </a-form-item>
    <a-form-item ref="introduction" label="项目简介" name="introduction">
      <a-input v-model:value="newProject.introduction" />
    </a-form-item>
    <a-form-item label="项目开始时间" required name="gmtStart">
      <a-date-picker
        v-model:value="newProject.gmtStart"
        show-time
        type="date"
        placeholder="选择日期"
        style="width: 100%"
        format="YYYY-MM-DD"
      />
    </a-form-item>
    <!-- <a-form-item label="项目预计结束时间" required name="gmtEnd">
      <a-date-picker
        v-model:value="newProject.gmtEnd"
        show-time
        type="date"
        placeholder="选择日期"
        style="width: 100%"
      />
    </a-form-item> -->
    <a-form-item label="项目封面" name="imgUrl">
      <a-upload
        v-model:file-list="fileList"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :customRequest="imgUpload"
        :before-upload="beforeImgUpload"
        @change="handleImgChange"
        @preview="handlePreview"
      >
        <img
          v-if="newProject.imgUrl"
          :src="`${newProject.imgUrl}`"
          alt="封面"
          style="max-width: 200px; max-height: 200px"
        />
        <div v-else>
          <loading-outlined v-if="isImgUploading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">Upload</div>
        </div>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="newProject.imgUrl" />
        </a-modal>
      </a-upload>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
      <a-button type="primary" @click="onSubmit" :loading="isCreating" :disabled="isImgUploading">创建</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { defineComponent, reactive, ref, inject } from "vue";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { uploadProjectImg, createProject } from "../../assets/js/api";
import { message } from "ant-design-vue";

export default defineComponent({
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  setup() {
    const reload = inject("reload");
    const formRef = ref();

    const newProject = reactive({
      name: "",
      introduction: undefined,
      gmtStart: undefined,
      // gmtEnd: undefined,
      imgUrl: undefined,
    });

    const rules = {
      name: [
        {
          required: true,
          message: "请输入项目名",
          trigger: "blur",
        },
        {
          min: 1,
          max: 64,
          message: "少于64字",
          trigger: "blur",
        },
      ],
      introduction: [
        {
          required: true,
          message: "请输入项目简介",
          trigger: "blur",
        },
        {
          min: 1,
          max: 128,
          message: "少于128字",
          trigger: "blur",
        },
      ],
      gmtStart: [
        {
          required: true,
          message: "请选择项目开始日期",
          trigger: "change",
          type: "object",
        },
      ],
      gmtEnd: [
        {
          required: true,
          message: "请选择项目预计结束日期",
          trigger: "change",
          type: "object",
        },
      ],
    };

    const previewVisible = ref(false);
    const handleCancel = () => {
      previewVisible.value = false;
    };

    const handlePreview = () => {
      // if (!newProject.url && !file.preview) {
      //   file.preview = await getBase64(file.originFileObj);
      // }

      // previewImage.value = file.url || file.preview;
      if (!newProject.imgUrl) {
        previewVisible.value = true;
      }
    };

    const imgUpload = (info) => {
      uploadProjectImg(info.file)
        .then((res) => {
          if (res.data.code == 200) {
            newProject.imgUrl = res.data.data;
          } else {
            message.error("图片上传失败");
          }
        })
        .catch((err) => {
          console.log(err);
          message.error("图片上传失败");
        })
        .finally(() => {
          info.file.status = "done";
          handleImgChange(info);
        });
    };

    const isImgUploading = ref(false);
    const fileList = ref([]);

    /**
     * 图片上传状态改变
     *
     * @param {*} info
     */
    const handleImgChange = (info) => {
      if (info.file.status === "uploading") {
        isImgUploading.value = true;
        return;
      }

      if (info.file.status === "done") {
        isImgUploading.value = false;
      }
    };

    const isCreating = ref(false);
    /**
     * 表单提交
     */
    const onSubmit = () => {
      isCreating.value = true;
      let newProjectCopy = { ...newProject };
      newProjectCopy.gmtStart = newProject.gmtStart.valueOf();
      // newProjectCopy.gmtEnd = newProject.gmtEnd.valueOf();
      formRef.value
        .validate()
        .then(() => {
          createProject(newProjectCopy).then((res) => {
            if (res.data.code == 200) {
              message.success("项目创建成功");
              reload();
            } else {
              message.error("项目创建失败");
            }
          });
        })
        .catch(() => {
          message.error("项目创建失败");
        })
        .finally(() => {
          isCreating.value = false;
        });
    };

    const beforeImgUpload = (file) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        message.error("只支持 JPG 和 PNG 格式的图片!");
      }

      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isLt2M) {
        message.error("图片大小必须小于10MB!");
      }

      return isJpgOrPng && isLt2M;
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    return {
      formRef,
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 12,
      },
      fileList,
      isImgUploading,
      other: "",
      newProject,
      rules,
      isCreating,
      previewVisible,

      handleCancel,
      handlePreview,
      onSubmit,
      resetForm,
      handleImgChange,
      beforeImgUpload,
      imgUpload,
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
