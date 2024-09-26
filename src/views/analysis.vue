<template>
  <van-collapse v-model="activeNames">
    <van-collapse-item
      v-for="(item, year) in data"
      :key="year"
      :name="year"
      :title="year"
      size="large"
    >
      <template v-for="item2 in item">
        <van-cell :title="item2.month" :value="formatCurrency(item2.value)" />
      </template>
      <van-cell
        title="共计"
        :value="formatCurrency(calculateTotal(item))"
        style="font-size: 16px; font-weight: bold"
      />
    </van-collapse-item>
  </van-collapse>
</template>

<script setup>
import { ref } from "vue";
import { formatCurrency } from "./format";
import { getYearMonthMoney } from "@/server/api";
import { onMounted } from "vue";

const data = ref({});

// 初始化展开的项
const activeNames = ref(["2024 年"]);
onMounted(async () => {
  const res = await getYearMonthMoney();
  console.log(res);
  // 处理 API 返回的数据，转换成所需格式
  res.forEach((item) => {
    const [year, month] = item.yearMonth.split("-"); // 拆分年份和月份
    const yearKey = `${year} 年`;
    // 如果 yearKey 不在 data 中，初始化该年份
    if (!data.value[yearKey]) {
      data.value[yearKey] = [];
    }
    // 将月份和总计金额添加到年份中
    data.value[yearKey].push({
      month: `${month} 月`,
      value: `${parseFloat(item.totalSum).toFixed(2)} ￥`, // 格式化为带 ￥ 的字符串
    });
  });
});

// 计算总金额的函数
const calculateTotal = (items) => {
  return (
    items
      .reduce((total, item) => {
        const amount = parseFloat(item.value.replace(" ￥", ""));
        return total + (isNaN(amount) ? 0 : amount);
      }, 0)
      .toFixed(2) + " ￥"
  ); // 返回格式化后的总计
};
</script>

<style scoped></style>
