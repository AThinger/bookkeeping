import myAxios from "./myAxios";

// 新增数据
export const PostAdd = async (data) => {
  return await myAxios.post("/insert", data);
};

// 获取全部数据
export const postRecords = async (data) => {
  return await myAxios.post(`/get`,data);
};

// 获取单条数据
export const getDetail = async (id) => {
  return await myAxios.get(`/getOne/${id}`);
};

// 删除单条数据
export const deleteDetail = async (id) => {
  return await myAxios.delete(`/delete/${id}`);
};

// 获取年月份的收支数据
export const getYearMonthMoney = async () => {
  return await myAxios.get(`/getYearMonthMoney`);
};
