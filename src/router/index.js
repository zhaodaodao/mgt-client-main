import { createRouter, createWebHashHistory } from "vue-router";
import { userLoginState, APP_NAME } from "../assets/js/api_v2"
import VueCookies from 'vue-cookies'
import { message } from "ant-design-vue";

const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/project",
    component: () => import("@views/Layout.vue"),
    children: [
      {
        path: "/project",
        name: "Project",
        redirect: "/project/list",
        component: () => import("@views/Container.vue"),
        children: [
          {
            path: "/project/list",
            name: "ProjectList",
            component: () => import("@views/project/ProjectList.vue"),
          },
          {
            path: "/project/edit",
            name: "ProjectEdit",
            redirect: "/project/edit/osgb",
            component: () => import("@views/project/ProjectEdit.vue"),
            children: [
              {
                path: "/project/edit/osgb",
                name: "ProjectEditOsgb",
                meta: { title: "倾斜模型", name: "ProjectEditOsgb" },
                component: () => import("@views/project/osgb-mgt/OsgbList.vue"),
              },
              {
                path: "/project/edit/kml",
                name: "ProjectEditKml",
                meta: { title: "Kml", name: "ProjectEditKml" },
                component: () => import("@views/project/kml-mgt/KmlList.vue"),
              },
              {
                path: "/project/edit/artificial",
                name: "ProjectEditArtificial",
                meta: { title: "人工模型", name: "ProjectEditArtificial" },
                component: () => import("@views/project/artificial-mgt/ArtificialList.vue"),
              },
              {
                path: "/project/edit/panorama",
                name: "ProjectEditPanorama",
                meta: { title: "全景图", name: "ProjectEditPanorama" },
                component: () => import("@views/project/panorama-mgt/PanoramaList.vue"),
              },
              {
                path: "/project/edit/tiff",
                name: "ProjectEditTiff",
                meta: { title: "卫星图片", name: "ProjectEditTiff" },
                component: () => import("@views/project/tiff-mgt/TiffList.vue"),
              },
              {
                path: "/project/edit/terrain",
                name: "ProjectEditTerrain",
                meta: { title: "地形(DEM)", name: "ProjectEditTerrain" },
                component: () => import("@views/project/terrain-mgt/TerrainList.vue"),
              },
              {
                path: "/project/edit/auth",
                name: "ProjectEditAuth",
                meta: { title: "权限控制", name: "ProjectEditAuth" },
                component: () => import("@views/project/auth-mgt/UserProjectList.vue"),
              },
            ],
          },
        ],
      },
      {
        path: "/user",
        name: "User",
        component: () => import("@views/user/User.vue"),
      },
      {
        path: "/log",
        name: "Log",
        component: () => import("@views/Log.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@views/user/Login.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@views/About.vue"),
  },
  // 测试路由
  {
    path: "/test",
    component: () => import("@views/test/Test.vue"),
    beforeEnter: () => {
      // 仅开发环境可以进入
      return process.env.NODE_ENV === "development";
    },
    children: [
      {
        path: "/test/ProjectCard",
        name: "ProjectCard",
        component: () => import("@components/ProjectCard.vue"),
      },
      {
        path: "/test/osgb-list",
        name: "OsgbList",
        component: () => import("@views/project/osgb-mgt/OsgbList.vue"),
      },
      {
        path: "/test/project-add",
        name: "ProjectAdd",
        component: () => import("@views/project/ProjectAdd.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@views/error/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // 检查登录状态
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (null == userInfo) {
    if (to.name == "Login") {
      next();
    } else {
      next({ name: "Login" });
    }
  }
  // 获取cookie中的token，保证cesium前端登录和这里登录一致
  let token = VueCookies.get("token");
  // 获取cookie中的登录状态
  // 解决了cesium端与后台管理端的一致性
  // 前提是cookie得同源
  if (token != userInfo.token) {
    userLoginState().then((res) => {
      if (res.data.code == 200 && res.data.data.role != 1) {
        userInfo = res.data.data;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } else {
        localStorage.removeItem("userInfo");
        VueCookies.remove("token");
        // 这里写死了跳转地址
        window.location = `${CLIENT_NAME}/#/login`;
      }
    })
  }

  // 已经登录了禁止重复登录
  if (to.name == "Login" && null != userInfo) {
    message.error(`您的账号 ${userInfo.username} 已登录系统,将禁止您重复登录`)
    if (from != null) {
      next({name: from.name});
    } else {
      next({name: "Layout"});
    }
  }

  // 加载动画
  let bar = document.getElementById("global-loading-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "global-loading-bar";
    document.body.append(bar);
  } else {
    bar.style.display = "block";
  }

  next();
});

router.afterEach((to, from) => {
  // 加载动画
  let bar = document.getElementById("global-loading-bar");
  if (bar) {
    setTimeout(() => {
      bar.style.display = "none";
    }, 300);
  }
});

export default router;
