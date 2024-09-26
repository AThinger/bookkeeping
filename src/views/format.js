export const formatCurrency = (value) => {
  const num = parseFloat(value); // 确保是数字
  if (isNaN(num)) return "0.00 ￥"; // 处理不可用的数字
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ￥"; // 使用正则添加逗号并加上“￥”
};
