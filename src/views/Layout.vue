<template>
  <a-layout class="contanier" style="min-height: 100vh">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      v-model:collapsed="menuCollapsed"
      @collapse="onCollapse"
      width="70px"
      :theme="theme"
    >
      <div :class="menuCollapsed ? 'sider-wrapper' : 'sider-wrapper fixed'">
        <div class="logo">
          <img :src="require(`../../public/img/logo.png`)" alt="logo" />
        </div>
        <a-menu :theme="theme" mode="vertical" v-model:selectedKeys="selectedKeys">
          <a-menu-item key="1">
            <router-link to="/project" />
            <Icon>
              <template #component>
                <svg class="main-menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path
                    d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
                  ></path>
                </svg>
              </template>
            </Icon>
          </a-menu-item>

          <a-menu-item key="2">
            <router-link to="/user" />
            <Icon>
              <template #component>
                <svg class="main-menu-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                </svg>
              </template>
            </Icon>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/log" />
            <Icon>
              <template #component>
                <svg class="main-menu-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M960 512c0-59.5-40.9-109.7-96.1-124v68.6c-9.4-5.5-20.4-8.6-32-8.6-35.3 0-64.1 28.7-64.1 64s28.7 64 64.1 64c11.7 0 22.6-3.1 32-8.6V636c-10.2 2.6-21 4.1-32 4.1-70.7 0-128.1-57.4-128.1-128s57.5-128 128.1-128c11.1 0 21.8 1.4 32 4V192c0-52.9-41.8-96-93.1-96H221.2c-51.3 0-93.1 43.1-93.1 96v159.5h128.1v64H128.1V352H64v64h64.1v191.5h128.1v64H127.1V608H64v64h64.1v160c0 52.9 41.8 96 93.1 96h549.6c51.3 0 93.1-43.1 93.1-96V635.9C919.1 621.7 960 571.5 960 512zM320.3 288h384.4v64H320.3v-64z m0 192h318.4v64H320.3v-64z m384.4 256H320.3v-64h384.4v64z m164.4-276z m4.9 3.9l-0.1-0.1s0.1 0 0.1 0.1zM869.1 564z m4.9-3.9l-0.1 0.1s0.1 0 0.1-0.1z m21.9-45.2c0-1 0.1-1.9 0.1-2.9s0-2-0.1-2.9c0 1 0.1 1.9 0.1 2.9s-0.1 2-0.1 2.9z m-17.7 41.2l0.3-0.3-0.3 0.3z m1.6-1.7l0.1-0.1-0.1 0.1z m2.3-2.8c0.2-0.2 0.3-0.4 0.5-0.6-0.2 0.2-0.3 0.4-0.5 0.6z m1.5-1.9c0.2-0.2 0.4-0.5 0.5-0.7-0.2 0.2-0.3 0.4-0.5 0.7z m2-2.9c0.2-0.3 0.4-0.6 0.6-1-0.2 0.4-0.4 0.7-0.6 1z m1.3-2.2c0.3-0.4 0.5-0.9 0.8-1.4-0.2 0.5-0.5 1-0.8 1.4z m1.7-2.9c0.2-0.5 0.5-0.9 0.7-1.4-0.2 0.5-0.5 0.9-0.7 1.4z m1.2-2.5c0.3-0.6 0.6-1.3 0.9-1.9-0.3 0.7-0.6 1.3-0.9 1.9z m1.3-2.9c0.2-0.6 0.5-1.2 0.7-1.8-0.2 0.6-0.4 1.2-0.7 1.8z m1.1-2.8c0.3-0.8 0.5-1.6 0.8-2.4-0.3 0.9-0.5 1.7-0.8 2.4z m1-2.9c0.2-0.7 0.4-1.5 0.6-2.2-0.2 0.8-0.4 1.5-0.6 2.2z m0.8-3c0.2-0.9 0.4-1.8 0.6-2.6-0.2 0.8-0.4 1.7-0.6 2.6z m0.7-2.9c0.2-0.8 0.3-1.7 0.5-2.5-0.2 0.8-0.4 1.6-0.5 2.5z m0.5-3.3c0.1-0.9 0.3-1.9 0.4-2.8-0.1 0.9-0.2 1.8-0.4 2.8z m0.4-3c0.1-0.9 0.2-1.9 0.2-2.8 0 1-0.1 1.9-0.2 2.8z m-17.4-50.5l0.3 0.3-0.3-0.3z m1.6 1.7l0.1 0.1-0.1-0.1z m2.3 2.8c0.2 0.2 0.3 0.4 0.5 0.6-0.2-0.2-0.3-0.4-0.5-0.6z m1.5 1.9c0.2 0.2 0.4 0.5 0.5 0.7-0.2-0.2-0.3-0.4-0.5-0.7z m2 2.9c0.2 0.3 0.4 0.7 0.6 1-0.2-0.4-0.4-0.7-0.6-1z m1.3 2.2c0.3 0.4 0.5 0.9 0.8 1.4-0.2-0.5-0.5-1-0.8-1.4z m1.7 2.9c0.2 0.5 0.5 0.9 0.7 1.4-0.2-0.5-0.5-0.9-0.7-1.4z m1.2 2.5c0.3 0.6 0.6 1.3 0.9 1.9-0.3-0.7-0.6-1.3-0.9-1.9z m1.3 2.9c0.2 0.6 0.5 1.2 0.7 1.8-0.2-0.6-0.4-1.2-0.7-1.8z m1.1 2.8c0.3 0.8 0.5 1.6 0.8 2.4-0.3-0.9-0.5-1.7-0.8-2.4z m1 2.9c0.2 0.7 0.4 1.5 0.6 2.2-0.2-0.8-0.4-1.5-0.6-2.2z m0.8 3c0.2 0.9 0.4 1.8 0.6 2.6-0.2-0.8-0.4-1.7-0.6-2.6z m0.7 2.9c0.2 0.8 0.3 1.7 0.5 2.5-0.2-0.8-0.4-1.6-0.5-2.5z m0.5 3.3c0.1 0.9 0.3 1.9 0.4 2.8-0.1-0.9-0.2-1.8-0.4-2.8z m0.4 3c0.1 0.9 0.2 1.9 0.2 2.8 0-1-0.1-1.9-0.2-2.8z"
                    p-id="2233"
                  ></path>
                </svg>
              </template>
            </Icon>
          </a-menu-item>
        </a-menu>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        :style="{
          background: '#fff',
          padding: 0,
          boxShadow: '0 16px 15px 0 rgb(0 0 0 / 4%)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: '99',
        }"
      >
        <a-dropdown>
          <a-space :size="22" class="user-wrapper" @click.prevent align="center">
            <a-divider type="vertical" style="height: 40px; background-color: #cfd6db" />
            <img
              class="ava"
              alt="user"
              :src="
                userInfo.role == -1
                  ? require('../../public/img/24.jpg')
                  : userInfo.role == 0
                  ? require('../../public/img/21.jpg')
                  : require('../../public/img/1.png')
              "
            />
            <a-space :size="2" direction="vertical" align="center">
              <a-typography-title class="user-text" :level="5">{{ userInfo.username }}</a-typography-title>
              <a-typography-text class="user-text" type="secondary"
                >[
                {{ userInfo.role == -1 ? "超级管理员" : userInfo.role == 0 ? "管理员" : "普通用户" }}
                ]</a-typography-text
              >
            </a-space>
          </a-space>
          <template #overlay>
            <a-menu class="user-menu">
              <a-menu-item @click="showChangePasswordModal">
                <Icon class="icon-std">
                  <template #component>
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M820.92 550.61c0-21.32 17.29-38.61 38.61-38.61s38.61 17.29 38.61 38.61v308.91c0 21.32-17.29 38.61-38.61 38.61H164.47c-21.32 0-38.61-17.29-38.61-38.61V164.47c0-21.32 17.29-38.61 38.61-38.61h386.14c21.32 0 38.61 17.29 38.61 38.61s-17.29 38.61-38.61 38.61H203.08v617.83h617.83v-270.3z"
                        fill="currentColor"
                        opacity=".5"
                        p-id="13204"
                      ></path>
                      <path
                        d="M393.5 685.77l447.63-441.41c15.19-14.97 15.36-39.42 0.38-54.61-14.98-15.19-39.42-15.36-54.61-0.38L339.27 630.78c-15.19 14.98-15.36 39.42-0.38 54.61 14.98 15.19 39.42 15.35 54.61 0.38z"
                        fill="#00BE85"
                        p-id="13205"
                      ></path>
                    </svg>
                  </template>
                </Icon>
                <a>修改密码</a>
                <a-modal v-model:visible="passwordChangeModalVisible" title="修改密码" @ok="changePasswordOkHandle">
                  <h1>修改密码后需要重新登录!!!</h1>
                  <a-row style="margin: 4px">
                    <a-col :span="24">
                      <a-input-password
                        v-model:value="passwordChangeFormData.oldPassword"
                        type="password"
                        placeholder="原密码"
                      >
                        <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                      </a-input-password>
                    </a-col>
                  </a-row>
                  <a-row style="margin: 4px">
                    <a-col :span="24">
                      <a-input-password
                        v-model:value="passwordChangeFormData.newPassword"
                        type="password"
                        placeholder="新密码"
                      >
                        <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                      </a-input-password>
                    </a-col>
                  </a-row>
                  <a-row style="margin: 4px">
                    <a-col :span="24">
                      <a-input-password
                        v-model:value="passwordChangeFormData.repeatNewPassword"
                        type="password"
                        placeholder="请重复密码"
                      >
                        <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                      </a-input-password>
                    </a-col>
                  </a-row>
                  <template #footer>
                    <a-button key="back" @click="changePasswordCancleHandle">取消</a-button>
                    <a-button
                      key="submit"
                      type="primary"
                      :loading="passwordChangeModalLoading"
                      @click="changePasswordOkHandle"
                      >确定</a-button
                    >
                  </template>
                </a-modal>
              </a-menu-item>
              <a-menu-item @click="logout">
                <Icon class="icon-std">
                  <template #component>
                    <svg
                      t="1643026729836"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="4161"
                    >
                      <path
                        d="M700.778231 828.255782H224.304762c-27.863946 0-50.155102-22.291156-50.155102-50.155102V53.638095C174.14966 25.77415 196.440816 3.482993 224.304762 3.482993h476.473469c34.829932 0 62.693878 27.863946 62.693878 62.693878v699.385034c0.696599 34.133333-27.863946 62.693878-62.693878 62.693877z"
                        fill="#FFFFFF"
                        p-id="4162"
                      ></path>
                      <path
                        d="M764.168707 65.480272v699.385034c0 34.829932-27.863946 62.693878-62.693877 62.693878H224.304762c-4.87619 0-9.752381-0.696599-14.628572-2.089796-20.897959-6.269388-36.223129-25.077551-36.223129-48.065306V52.941497C173.453061 25.077551 195.744218 2.786395 223.608163 2.786395h477.170068c34.829932 0 63.390476 28.560544 63.390476 62.693877z"
                        fill="currentColor"
                        p-id="4163"
                      ></path>
                      <path
                        d="M396.364626 1012.157823L202.710204 845.670748C184.598639 830.345578 174.14966 807.357823 174.14966 783.673469V37.616327C174.14966 21.594558 192.957823 12.538776 205.496599 22.987755l211.069387 181.812245c14.628571 12.538776 22.987755 30.65034 22.987755 50.155102v737.697959c0 22.291156-26.470748 34.133333-43.189115 19.504762z"
                        fill="#6097FD"
                        p-id="4164"
                      ></path>
                      <path
                        d="M844.97415 394.971429L753.719728 303.717007c-11.145578-11.145578-29.953741-11.145578-41.09932 0-11.145578 11.145578-11.145578 29.953741 0 41.09932l41.795919 41.795918H556.582313c-16.021769 0-29.257143 13.235374-29.257143 29.257143 0 16.021769 13.235374 29.257143 29.257143 29.257143h197.834014l-41.795919 41.795918c-11.145578 11.145578-11.145578 29.953741 0 41.09932 5.572789 5.572789 13.235374 8.359184 20.897959 8.359183s14.628571-2.786395 20.201361-8.359183l91.254422-91.254422c5.572789-5.572789 8.359184-12.538776 8.359183-20.897959s-2.786395-15.32517-8.359183-20.897959z"
                        fill="#21D3AC"
                        p-id="4165"
                      ></path>
                    </svg>
                  </template>
                </Icon>
                <a>注销登录</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content :style="{ padding: '24px 16px 0', height: '80vh', overflow: 'auto' }">
        <a-layout class="wrapper">
          <empty v-if="selectedKeys == 0" />
          <router-view />
          <a-layout-footer> </a-layout-footer>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  UploadOutlined,
  PlusCircleFilled,
  EditFilled,
  ExclamationCircleOutlined,
  LockOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import Icon from "@ant-design/icons-vue";
import { onMounted, reactive, ref, createVNode } from "vue";
import Empty from "../components/Empty.vue";
import { changePassword } from "../assets/js/api_v2";
import router from "../router";
import VueCookies from "vue-cookies";

export default {
  components: {
    UploadOutlined,
    PlusCircleFilled,
    EditFilled,
    ExclamationCircleOutlined,
    LockOutlined,
    Icon,
    Empty,
  },

  setup() {
    // 数据
    const data = reactive({
      projects: [
        {
          name: "Demo Project",
          manager: "邱嘉华",
          area: [
            {
              name: "区域 A",
              description: "项目1-区域A",
            },
            {
              name: "区域 B",
              description: "项目1-区域B",
            },
          ],
        },
        {
          name: "Wordpress Project",
          manager: "邱嘉华",
          area: [
            {
              name: "区域 A",
              description: "项目1-区域A",
            },
            {
              name: "区域 B",
              description: "项目1-区域B",
            },
          ],
        },
        {
          name: "Task Management",
          manager: "邱嘉华",
          area: [
            {
              name: "区域 A",
              description: "项目1-区域A",
            },
            {
              name: "区域 B",
              description: "项目1-区域B",
            },
          ],
        },
        {
          name: "Testing Project",
          manager: "邱嘉华",
          area: [
            {
              name: "区域 A",
              description: "项目1-区域A",
            },
            {
              name: "区域 B",
              description: "项目1-区域B",
            },
          ],
        },
        {
          name: "Themes Design",
          manager: "曹越群",
          area: [
            {
              name: "区域 A",
              description: "项目2-区域A",
            },
          ],
        },
      ],
    });

    const clientWidth = ref(document.documentElement.clientWidth);

    const selectedKeys = ref(["1"]);

    const pages = ref(["project", "user", "log"]);

    const onCollapse = (collapsed, type) => {};

    const passwordChangeFormData = reactive({
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    });
    const passwordChangeModalVisible = ref(false);
    const passwordChangeModalLoading = ref(false);

    const userInfo = {
      username: null,
      role: null,
    };

    onMounted(() => {
      window.onresize = () => {
        return (() => {
          clientWidth.value = document.documentElement.clientWidth; // 宽
        })();
      };
      let data = JSON.parse(localStorage.getItem("userInfo"));
      userInfo.username = data.username;
      userInfo.role = data.role;
    });

    const logout = () => {
      Modal.confirm({
        title: () =>
          "尊敬的" +
          (userInfo.role == -1 ? "超级管理员" : userInfo.role == 0 ? "管理员" : "普通用户") +
          userInfo.username,
        icon: () => createVNode(ExclamationCircleOutlined),
        content: () =>
          createVNode(
            "div",
            { style: "color:red;" },
            "是否需要注销登录？\n当前未保存的操作将会丢失，注销登录后需要重新登录，请确保能够正常登录系统。"
          ),
        onOk() {
          //todo 注销登录,删除登录状态信息
          localStorage.removeItem("userInfo");
          VueCookies.remove("token");
          message.success("注销登录成功");
          router.push({ name: "Login", query: { random: Math.random() } });
        },
        onCancel() {
          message.info("取消注销登录");
        },
        class: "test",
      });
    };

    const changePasswordOkHandle = () => {
      passwordChangeModalLoading.value = true;
      let data = {
        oldPassword: passwordChangeFormData.oldPassword,
        newPassword: passwordChangeFormData.newPassword,
      };
      changePassword(data)
        .then((res) => {
          if (res.data.code == 200) {
            localStorage.removeItem("userInfo");
            document.cookie = "token=;expires=0";
            //todo 注销登录,删除登录状态信息
            localStorage.removeItem("userInfo");
            VueCookies.remove("token");
            message.success("修改密码成功,请重新登录");
            router.push({ name: "Login" });
          } else {
            message.error(res.data.message);
          }
        })
        .catch(() => {
          message.error("系统错误");
        })
        .finally(() => {
          passwordChangeModalVisible.value = false;
        });
    };
    const changePasswordCancleHandle = () => {
      message.info("取消修改密码");
      passwordChangeModalLoading.value = false;
      passwordChangeModalVisible.value = false;
    };
    const showChangePasswordModal = () => {
      passwordChangeModalVisible.value = true;
    };
    return {
      theme: "light",
      clientWidth,
      selectedKeys,

      data,
      menuCollapsed: ref(false),
      userInfo,
      passwordChangeFormData,
      passwordChangeModalVisible,
      passwordChangeModalLoading,

      onCollapse,
      logout,
      changePasswordOkHandle,
      changePasswordCancleHandle,
      showChangePasswordModal,
    };
  },
};
</script>
<style lang="less" scoped>
.logo {
  height: 40px;
  margin: 12px 5px;
  img {
    width: 100%;
    height: 40px;
  }
}

.main-menu-icon {
  width: 26px;
  height: 26px;
  fill: currentColor;
}

.sider-wrapper {
  border-right: 1px solid #cfd6db;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 26px;
  height: 100vh;
}

.fixed {
  position: fixed;
  z-index: 100;
}

.pro {
  padding-top: 22px;
  h3 {
    margin: 0 !important;
    letter-spacing: 2px;
  }
  .btn-pro-new {
    border-radius: 5px !important;
    letter-spacing: 2px;
    width: 190px;
  }
}

@media (min-width: @width-lg) {
  .pro::after {
    content: "";
    border-right: 1px solid #cfd6db;
    height: 40px;
    position: absolute;
    left: 0;
    top: 13px;
    content: "";
    border-right: 1px solid #cfd6db;
    height: 40px;
    position: absolute;
    left: 230px;
    top: 13px;
  }
}

.btn-new-pro-wrapper {
  display: flex;
}

.user-wrapper {
  margin-right: 32px;
  .ava {
    width: 48px;
    height: 48px;
  }
  .user-text {
    display: flex;
    line-height: 22px;
    margin-bottom: 0;
  }
}

.sub-list {
  margin-top: 32px !important;
}

.list-item {
  color: #7f8385;
  font-size: 16px;
  line-height: 18px;
  font-weight: 400;
  font-style: normal;

  :hover {
    color: @primary-color;
  }
}

.user-menu {
  height: 86px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
  border-radius: 5px;
  .icon-std {
    color: @primary-color;
    height: 2em;
    width: 2em;
    vertical-align: bottom;
  }
}

.wrapper {
  height: 88vh;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
}
</style>
