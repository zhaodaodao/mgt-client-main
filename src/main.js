import { createApp } from "vue";
import App from "./App.vue";
import router from "@router";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.less";
import "@assets/style/glo.less";
const app = createApp(App);
app.use(router);
app.use(Antd);

app.config.globalProperties.$width = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
  xxxl: 2000,
};

app.mount("#app");
