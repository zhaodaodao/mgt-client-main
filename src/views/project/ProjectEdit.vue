<template>
  <a-typography style="text-align: left">
    <a-typography-title :level="2">{{ project.name }}</a-typography-title>
    <a-typography-paragraph>
      {{ project.introduction }}
    </a-typography-paragraph>
  </a-typography>
  <a-layout class="container">
    <a-layout-sider>
      <a-menu class="sider" mode="vertical" v-model:selectedKeys="selectedKeys" :style="{ lineHeight: '64px' }">
        <a-menu-item :key="item.title" v-for="item in menu">
          <router-link :to="{ name: item.name, query: { info: projectBase64 } }" />{{ item.title }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content>
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script>
import Base64 from "@/assets/js/Base64";
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
  componet: {
    Base64,
  },
  setup() {
    const route = useRoute();

    /**
     * 未解码的project对象
     */
    const projectBase64 = route.query.info;
    /**
     * 项目对象
     */
    const project = ref(Base64.decode(route.query.info));
    /**
     * 模型类别菜单
     */
    const menu = ref([]);

    (function () {
      // 获取菜单
      route.matched.forEach((r) => {
        // 找到当前路由
        if (r.name === "ProjectEdit") {
          // 获取子路由meta
          r.children.forEach((rc) => {
            menu.value.push(rc.meta);
          });
        }
      });
    })();
    const selectedKeys = ref([`${route.meta.title}`]);

    return {
      project,
      menu,
      selectedKeys,
      projectBase64,
    };
  },
};
</script>

<style lang="less" scoped>
.sider {
  background-color: white;
  height: 100%;
}

.top {
  min-height: 160px;
}
</style>
