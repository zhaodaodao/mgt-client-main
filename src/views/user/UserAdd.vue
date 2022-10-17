<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item ref="username" label="用户名" name="username">
      <a-input v-model:value="formState.username" />
    </a-form-item>
    <a-form-item ref="password" label="密码" name="password">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>
    <a-form-item label="角色" ref="role">
      <a-select ref="role" v-model:value="formState.role" style="width: 120px" name="role">
        <a-select-option :value="1" :disabled="userRole < 1 ? false : true">普通用户</a-select-option>
        <a-select-option :value="0" :disabled="userRole < 0 ? false : true">管理员</a-select-option>
        <a-select-option :value="-1" :disabled="userRole < -1 ? false : true">超级管理员</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item ref="comment" label="用户备注" name="comment">
      <a-input v-model:value="formState.comment" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 18, offset: 9 }">
      <a-button type="primary" @click="onSubmit">提交</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { inject, reactive, ref, toRaw, watch } from "vue";
import { message } from "ant-design-vue";
import { register } from "../../assets/js/api_v2";
import { SearchOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    SearchOutlined,
  },

  props: { userRole: Number },

  setup(props, context) {
    const reload = inject("reload");
    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
      ],
      role: [
        {
          required: true,
          message: "请选择角色",
          trigger: "blur",
        },
      ],
    };

    const formRef = ref([]);
    const formState = ref({
      username: "",
      password: "",
      role: 1,
      comment: "",
    });
    const userRole = ref(props.userRole);
    formState.role = userRole - 1;

    const onSubmit = () => {
      formRef.value
        .validate()
        .then((data) => {
            //这里使用了formState
            // 因为formRef拿不到select的值
          register(formState.value)
            .then((res) => {
              if (res.data.code == 200) {
                message.success(`新增用户 ${data.username} 成功`);
                reload();
              } else {
                  message.error(`新增用户 ${data.username} 失败`);
              }
            })
            .catch(() => {
              message.error(`新增用户 ${data.username} 失败`);
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
        span: 6,
      },
      wrapperCol: {
        span: 13,
      },
      formState,
      userRole,
      onSubmit,
      resetForm,
      rules,
    };
  },
};
</script>
