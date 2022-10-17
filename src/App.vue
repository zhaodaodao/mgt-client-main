<template>
  <a-config-provider :locale="zh_CN">
    <router-view v-if="isRouteAlive" />
  </a-config-provider>
</template>
<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      zh_CN,
      isRouteAlive: true,
    };
  },

  methods: {
    reload() {
      this.isRouteAlive = false;
      this.$nextTick(() => {
        this.isRouteAlive = true;
      });
    },
  },
};
</script>
<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
