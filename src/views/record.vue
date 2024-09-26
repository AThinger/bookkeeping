<template>
  <van-cell-group>
    <van-cell
      :value="time"
      @click="show = true"
      style="font-size: 1.2rem; width: 100%"
    >
      <template #title>
        <img src="@/assets/time.png" style="width: 6vw; height: 6vw" />
      </template>
    </van-cell>
    <van-calendar
      v-model:show="show"
      type="range"
      @confirm="onConfirm"
      :min-date="new Date(2024, 8, 1)"
      allow-same-day
    />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="(item, index) in addForm"
          :key="index"
          :title="item.billTime"
          is-link
          :value="formatCurrency(item.totalMoney)"
          style="font-size: 1.2rem"
          @click="
            () => {
              $router.push({
                path: '/details',
                query: {
                  id: JSON.stringify(item.id),
                  time: item.billTime,
                  totalMoney: item.totalMoney,
                },
              });
            }
          "
        />
      </van-list>
    </van-pull-refresh>
  </van-cell-group>
</template>

<script setup>
import { postRecords } from "@/server/api";
import { ref } from "vue";
import { formatCurrency } from "./format";

const addForm = ref([]); // 账单数据
const currentPage = ref(1); // 分页
const pageSize = ref(15); // 每页显示的条数
const startTime = ref(""); // 开始时间
const endTime = ref(""); // 结束时间

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = async () => {
  setTimeout(async () => {
    if (refreshing.value) {
      addForm.value = [];
      refreshing.value = false;
    }
    const res = await postRecords({
      pageNo: currentPage.value,
      pageSize: pageSize.value,
      startTime: startTime.value,
      endTime: endTime.value,
    });
    console.log("获取全部数据", res);
    addForm.value.push(...res.form);
    currentPage.value++;
    loading.value = false;
    if (addForm.value.length >= res.total) {
      finished.value = true;
    }
  }, 800);
};

const onRefresh = () => {
  // 清空列表数据
  finished.value = false;
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};

// 日期选择器
const time = ref("请选择查询日期");
const show = ref(false);
// 日期格式化
const formatDate = (time, num) => {
  const year = time.getFullYear(); // 年份
  const month = String(time.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1并补零
  const day = String(time.getDate()).padStart(2, "0"); // 补零
  if (num === 0) {
    return `${year}-${month}-${day}`;
  } else if (num === 1) {
    return `${month}-${day}`;
  }
};
// 选择日期区间后更新过滤结果
const onConfirm = async (value) => {
  startTime.value = formatDate(value[0], 0);
  endTime.value = formatDate(value[1], 0);
  // 更新显示的日期
  time.value = `${formatDate(value[0], 1)} 至 ${formatDate(value[1], 1)}`;
  addForm.value = [];
  currentPage.value = 1;
  onRefresh();
  show.value = false; // 关闭日期选择器
};
</script>

<style scoped></style>
