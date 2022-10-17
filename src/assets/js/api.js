import qs from "qs";

export let APP_NAME = "";
if (process.env.NODE_ENV == "production") {
  APP_NAME = "/mgt-server";
  axios.defaults.baseURL = "/mgt-server";
}

export const PROJECT_DATA_API = "/api/project";
export const OSGB_DATA_API = "/api/osgb";
export const KML_DATA_API = "/api/kml";
export const ARTIFICIAL_DATA_API = "/api/artificial";
export const PANORAMA_DATA_API = "/api/panorama";

/**
 * 项目图片上传
 * @returns promise
 */
export const uploadProjectImg = (img) => {
  let form = new FormData();
  form.append("img", img);
  return axios.post(`${PROJECT_DATA_API}/uploadImage`, form);
};

/**
 * 创建新的项目
 * @param {Object} data
 * @returns
 */
export const createProject = (data) => {
  return axios.post(`${PROJECT_DATA_API}/create`, qs.parse(data));
};

/**
 * 删除项目
 * @param {*} id
 * @returns
 */
export const deleteProject = (id) => {
  return axios.post(`${PROJECT_DATA_API}/delete?id=${id}`);
};

/**
 * 更新kml资源信息
 * @param {*} data 
 * @returns 
 */
export const updateKml = (data) => {
  return axios.post(`${KML_DATA_API}/update`, qs.parse(data));
};

/**
 * 删除kml资源
 * @param {*} data 
 * @returns 
 */
export const deleteKml = (data) => {
  return axios.post(`${KML_DATA_API}/delete?id=${data}`);
};

/**
 * 查询kml资源
 * @param {*} query 
 * @returns 
 */
export const listKml = (query) => {
  return axios.post(`${KML_DATA_API}/list`, qs.parse(query));
};

/**
 * 添加kml资源
 * @param {*} data 
 * @returns 
 */
export const addKml = (data) => {
  return axios.post(`${KML_DATA_API}/save`, qs.parse(data));
};

/**
 * 列出所有目标项目的osgb模型
 * @param {*} query
 * @returns
 */
export const listOsgbFromProject = (query) => {
  return axios.post(`${OSGB_DATA_API}/listFromProject`, qs.parse(query));
};

/**
 * 添加osgb模型至项目
 * @param {*} data
 * @returns
 */
export const addOsgbToProject = (data) => {
  return axios.post(`${OSGB_DATA_API}/addToProject/plus`, qs.parse(data));
};

export const editOsgbToProject = (data) => {
  return axios.post(`${OSGB_DATA_API}/updateFromProject`, qs.parse(data));
};

export const deleteOsgbFromProject = (data) => {
  return axios.post(`${OSGB_DATA_API}/removeFromProject`, qs.parse(data));
};

export const listArtificial = (query) => {
  return axios.post(`${ARTIFICIAL_DATA_API}/list`, qs.parse(query));
};

export const deleteArtificial = (data) => {
  return axios.post(`${ARTIFICIAL_DATA_API}/remove?id=${data}`);
};

export const addArtificial = (data) => {
  return axios.post(`${ARTIFICIAL_DATA_API}/upload/info`, qs.parse(data));
};

export const updateArtificial = (data) => {
  return axios.post(`${ARTIFICIAL_DATA_API}/update`, qs.parse(data));
};

export const listPanorama = (data) => {
  return axios.post(`${PANORAMA_DATA_API}/list`, qs.parse(data));
};

export const deletePanorama = (data) => {
  return axios.post(`${PANORAMA_DATA_API}/remove?id=${data}`);
};

export const addPanorama = (data) => {
  return axios.post(`${PANORAMA_DATA_API}/upload/info`, qs.parse(data));
};

export const updatePanorama = (data) => {
  return axios.post(`${PANORAMA_DATA_API}/update`, qs.parse(data));
};

export const kmlUpload = (file) => {
  let form = new FormData();
  form.append("file", file);
  return axios.post(`${KML_DATA_API}/upload`, form);
};

export const artificialUpload = (file) => {
  let form = new FormData();
  form.append("file", file);
  return axios.post(`${ARTIFICIAL_DATA_API}/upload/file`, form);
};
export const panoramaUpload = (file) => {
  let form = new FormData();
  form.append("file", file);
  return axios.post(`${PANORAMA_DATA_API}/upload/file`, form);
};
