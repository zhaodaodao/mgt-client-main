import qs from "qs";

export let APP_NAME = "";
export let CLIENT_NAME = "";

if (process.env.NODE_ENV == "production") {
  APP_NAME = "/mgt-server";
  CLIENT_NAME = "/mgt-client"
  axios.defaults.baseURL = "/mgt-server";
}
const OSGB_DATA_API = "/api/v2/osgb";
const KML_DATA_API = "/api/v2/kml";
const ARTIFICIAL_DATA_API = "/api/v2/artificial";
const PANORAMA_DATA_API = "/api/v2/panorama";
const TIFF_DATA_API = "/api/v2/tiff";
const TERRAIN_DATA_API = "/api/v2/terrain";
const CESIUM_WORK_DATA_API = "/api/v2/cesium";
const USER_API = "/api/v2/user";
const VERIFY_API = "/api/v2/verify";
const DEPARTMENT_API = "/api/v2/department";

/**
 * osgb模型对应增删改查操作
 */
export const addOsgbToProject = (data) => {
  return axios.post(`${OSGB_DATA_API}/create`, qs.parse(data));
};

export const listOsgbFromProject = (query) => {
  return axios.post(`${OSGB_DATA_API}/list`, qs.parse(query));
};

export const editOsgbToProject = (data) => {
  return axios.post(`${OSGB_DATA_API}/update `, qs.parse(data));
};

export const deleteOsgbFromProject = (data) => {
  return axios.post(`${OSGB_DATA_API}/remove/?id=${data}`);
};

/**
 *  全景图对应的查询、删除、更新、添加操作
 */
export const listPanorama = (data) => {
  return axios.post(`${PANORAMA_DATA_API}/list`, qs.parse(data));
};

export const deletePanorama = (data) => {
  return axios.post(`${PANORAMA_DATA_API}/remove?id=${data}`);
};

export const updatePanorama = (data) => {
  return axios.post(`${PANORAMA_DATA_API}/update`, qs.parse(data));
};

export const addPanorama = (data) => {
  return axios.post(`${PANORAMA_DATA_API}/create`, qs.parse(data));
};

/**
 *
 * 人工模型对应的查询、删除、添加、更新操作
 */
export const listArtificial = (query) => {
  return axios.post(`${ARTIFICIAL_DATA_API}/list`, qs.parse(query));
};

export const deleteArtificial = (data) => {
  return axios.post(`${ARTIFICIAL_DATA_API}/remove?id=${data}`);
};

export const updateArtificial = (data) => {
  return axios.post(`${ARTIFICIAL_DATA_API}/update`, qs.parse(data));
};

export const addArtificial = (data) => {
  return axios.post(`${ARTIFICIAL_DATA_API}/create`, qs.parse(data));
};

/**
 *
 * kml对应的查询、删除、添加、更新操作
 */

export const listKml = (query) => {
  return axios.post(`${KML_DATA_API}/list`, qs.parse(query));
};

export const deleteKml = (data) => {
  return axios.post(`${KML_DATA_API}/remove?id=${data}`);
};

export const addKml = (data) => {
  return axios.post(`${KML_DATA_API}/create`, qs.parse(data));
};

export const updateKml = (data) => {
  return axios.post(`${KML_DATA_API}/update`, qs.parse(data));
};

/**
 * 对tif的crud
 */
export const listTiff = (query) => {
  return axios.post(`${TIFF_DATA_API}/list`, qs.parse(query));
};

export const deleteTiff = (data) => {
  return axios.post(`${TIFF_DATA_API}/remove?id=${data}`);
};

export const addTiff = (data) => {
  return axios.post(`${TIFF_DATA_API}/create`, qs.parse(data));
};

export const updateTiff = (data) => {
  return axios.post(`${TIFF_DATA_API}/update`, qs.parse(data));
};

/**
 * 对terrain的crud
 */
export const listTerrain = (query) => {
  return axios.post(`${TERRAIN_DATA_API}/list`, qs.parse(query));
};

export const deleteTerrain = (data) => {
  return axios.post(`${TERRAIN_DATA_API}/remove?id=${data}`);
};

export const addTerrain = (data) => {
  return axios.post(`${TERRAIN_DATA_API}/create`, qs.parse(data));
};

export const updateTerrain = (data) => {
  return axios.post(`${TERRAIN_DATA_API}/update`, qs.parse(data));
};

export const listTerrainByProjectId = (projectId) => {
  return axios.post(`${TERRAIN_DATA_API}/list/project?projectId=${projectId}`);
};

/**
 * 解除关联
 * @param {*} osgbId 目标osgbId
 * @returns 
 */
export const dissociateOsgb = (osgbId) => {
  return axios.post(`${TERRAIN_DATA_API}/dissociateOsgb?osgbId=${osgbId}`);
}

/**
 * 更新关联osgb
 * @param {*} data
 * @returns axios promise
 */
export const updateAssociatedOsgb = (data) => {
  return axios.post(`${TERRAIN_DATA_API}/update/associatedOsgb`, qs.parse(data));
};


let _cesiumPageUrl = "";
/**
 *
 * @returns cesium 页面的url
 */
export const cesiumPageUrl = () => {
  if (_cesiumPageUrl == "") {
    // 如果是生产环境，url从服务器获取
    if (process.env.NODE_ENV == "production") {
      axios.post(`${CESIUM_WORK_DATA_API}/url`).then((res) => {
        _cesiumPageUrl = res.data.data;
        return res.data.data;
      });
    } else {  // 开发环境，则从.evn.development获取
      _cesiumPageUrl = process.env.VUE_APP_CESIUM_WORK_URL;
    }

  } else {
    return _cesiumPageUrl;
  }
};
/**
 * 获取验证码
 */
export const getVerifyCode = () => {
  return axios.get(`${VERIFY_API}/getCode/base64`);
}

/**
 * 管理员登录
 * 这里后面的路由可以根据后端进行配置的
 * project-config.admin-login-router
 * @param {*} query 
 * @returns 
 */
export const login = (query) => {
  return axios.post(`${USER_API}/admin/9sdAzx7f0sfX`, qs.parse(query));
}

/**
 * 注册用户
 * @param {
 *  "username" : "xxxx",
 *  "password" : "xxx",
 *  "role" : "0" / "1",
 *  "comment" : "xxx"
 * } data 
 * @returns 
 */
export const register = (data) => {
  return axios.post(`${USER_API}/register`, qs.parse(data))
}

export const changePassword = (data) => {
  return axios.post(`${USER_API}/password/change`, qs.parse(data));
}

export const resetPassword = (data) => {
  return axios.post(`${USER_API}/password/reset?username=${data.username}`, data);
}

export const modifyUser = (data) => {
  return axios.post(`${USER_API}/modify`, qs.parse(data));
}

export const listUser = (data) => {
  return axios.post(`${USER_API}/list`, qs.parse(data));
}

export const modifyDisable = (data) => {
  return axios.post(`${USER_API}/modify/disable?id=${data.id}&disable=${data.disable}`);
}

export const userLoginState = (data) => {
  return axios.post(`${USER_API}/state`);
}

/**
 * 对部门进行的crud
 */
export const listDepartment = (query) => {
  return axios.post(`${DEPARTMENT_API}/list`, qs.parse(query));
};

export const deleteDepartment = (data) => {
  return axios.post(`${DEPARTMENT_API}/remove?id=${data}`);
};

export const addDepartment = (data) => {
  return axios.post(`${DEPARTMENT_API}/create`, qs.parse(data));
};

export const updateDepartment = (data) => {
  return axios.post(`${DEPARTMENT_API}/update`, qs.parse(data));
};