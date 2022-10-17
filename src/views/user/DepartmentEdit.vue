<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item ref="name" label="部门名称" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item ref="manager" label="部门经理" name="manager">
      <a-input v-model:value="formState.manager" />
    </a-form-item>
    <a-form-item ref="address" label="部门地址" name="address">
      <a-input v-model:value="formState.address" />
    </a-form-item>
    <a-form-item ref="userCount" label="用户数量" name="userCount">
      <a-input v-model:value="formState.userCount" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 19, offset: 0 }">
      <a-row>
        <a-col :span="5">
        </a-col>
        <a-col :span="6">
        </a-col>
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
import { updateDepartment } from "../../assets/js/api_v2";
import { SearchOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    SearchOutlined,
  },

  props: { formData: Object },

  setup(props, context) {
    const reload = inject("reload");
    const rules = {
      name: [
        {
          required: true,
          message: "请输入部门名称",
          trigger: "blur",
        },
      ],
      manager: [
        {
          required: false,
          message: "请输入部门经理（没有可以暂时不填）",
          trigger: "blur",
        },
      ],
      address: [
        {
          required: false,
          message: "请输入部门地址（没有可以暂时不填）",
          trigger: "blur",
        },
      ],
      user_count: [
        {
          required: true,
          message: "请输入部门人数",
          trigger: "blur",
        },
      ],
    };
    const formRef = ref([]);
    const formState = ref({});
    formState.value = { ...props.formData.value };

    const onSubmit = () => {
      formRef.value
        .validate()
        .then((data) => {
          let department = {
            name: formState.value.name,
            manager: formState.value.manager,
            address: formState.value.address,
            userCount: formState.value.userCount,
          };
          department["id"] = formState.value.id;
          updateDepartment(department)
            .then((res) => {
              if (res.data.code == 200) {
                message.success("更新部门成功");
                reload();
              } else {
                message.error("更新部门失败");
              }
            })
            .catch(() => {
              message.error("更新部门失败");
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
      onSubmit,
      resetForm,
      rules,
    };
  },
};
</script>
