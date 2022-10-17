<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item ref="username" label="用户名" name="username">
      <a-input v-model:value="formState.username" :disabled="true" />
    </a-form-item>
    <a-form-item label="角色">
      <a-select ref="role" v-model:value="formState.role" style="width: 120px" name="role">
        <a-select-option :value="1" :disabled="userRole < 1 ? false : true">普通用户</a-select-option>
        <a-select-option :value="0" :disabled="userRole < 0 ? false : true">管理员</a-select-option>
        <a-select-option :value="-1" :disabled="userRole < -1 ? false : true">超级管理员</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item ref="comment" label="用户备注" name="comment">
      <a-input v-model:value="formState.comment" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 19, offset: 0 }">
      <a-row>
        <a-col :span="5">
          <a-popconfirm
            :title="`重置用户 ${formState.username} 随机6位字符密码`"
            @confirm="resetPasswordHandle"
            slot="formState"
          >
            <a-button :danger="true">重置密码</a-button>
          </a-popconfirm>
        </a-col>
        <a-col :span="6"
          ><a-input-password v-model:value="resetedPassword" v-if="resetedPassword"></a-input-password
        ></a-col>
        <a-col :span="3"></a-col>
        <a-col :span="4"><a-button type="primary" @click="onSubmit">提交</a-button></a-col>
        <a-col :span="4"> <a-button style="margin-left: 10px" @click="resetForm">重置</a-button></a-col>
        <a-col :span="2"> </a-col>
      </a-row>
    </a-form-item>
  </a-form>
</template>
<script>
import { inject, reactive, ref, toRaw, watch } from "vue";
import { message } from "ant-design-vue";
import { modifyUser, resetPassword } from "../../assets/js/api_v2";
import { SearchOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    SearchOutlined,
  },

  props: { formData: Object, userRole: Number },

  setup(props, context) {
    const reload = inject("reload");
    const rules = {
      username: [
        {
          required: true,
          message: "请勿修改用户名",
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
    const formState = ref({});
    const userRole = ref(props.userRole);
    formState.value = { ...props.formData.value };
    let resetedPassword = ref(null);

    const onSubmit = () => {
      formRef.value
        .validate()
        .then((data) => {
          let user = {
            username: formState.value.username,
            role: formState.value.role,
            comment: formState.value.comment,
          };
          modifyUser(user)
            .then((res) => {
              if (res.data.code == 200) {
                message.success("更新用户成功");
                reload();
              } else {
                message.error("更新用户失败");
              }
            })
            .catch(() => {
              message.error("更新用户失败");
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const resetPasswordHandle = () => {
      resetPassword({ username: formState.value.username }).then((res) => {
        if (res.data.code == 200) {
          resetedPassword.value = res.data.data.password;
          message.success("重置密码成功,请从右侧输入框中复制。");
        } else {
          message.error("重置密码失败");
        }
      });
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
      resetedPassword,
      resetPasswordHandle,
    };
  },
};
</script>
