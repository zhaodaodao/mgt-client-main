<template>
  <a-tabs v-model:activeKey="activeKey" tabPosition="left">
    <a-tab-pane key="1" tab="超级管理员">
      <user-list :currentRole="-1" :userRole="userInfo.role"></user-list>
    </a-tab-pane>
    <a-tab-pane key="2" tab="管理员" force-render>
      <user-list :currentRole="0" :userRole="userInfo.role"></user-list>
    </a-tab-pane>
    <a-tab-pane key="3" tab="普通用户">
      <user-list :currentRole="1" :userRole="userInfo.role"></user-list>
    </a-tab-pane>
    <a-tab-pane key="4" tab="部门管理">
      <department-list></department-list>
    </a-tab-pane>
  </a-tabs>
</template>
<script>
import { defineComponent, ref , onBeforeMount, reactive} from "vue";
import UserList from "@views/user/UserList.vue";
import DepartmentList from "@views/user/DepartmentList";
export default defineComponent({
  components:{
    UserList,
    DepartmentList,
  },
  setup() {
    const userInfo = reactive({})

    onBeforeMount(()=>{
      let data = JSON.parse(localStorage.getItem("userInfo"));
      userInfo.username = data.username;
      userInfo.role = data.role;
      setTimeout(()=>{}, 1000)
    });

    return {
      activeKey: ref("1"),
      userInfo
    };
  },
});
</script>