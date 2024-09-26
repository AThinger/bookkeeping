<template>
  <van-cell-group>
    <van-cell
      :title="`${route.query.time}`"
      @click="show = true"
      style="font-size: 1.2rem; font-weight: bold"
    >
      <template #right-icon>
        <van-icon name="delete-o" size="22" color="red" @click="deleteRecord" />
      </template>
    </van-cell>
    <van-cell
      v-for="(item, index) in date"
      :key="index"
      :icon="item.icon"
      center
    >
      <template #title>
        <van-cell
          :title="item.name"
          style="font-size: 17px"
          :value="formatCurrency(item.money)"
          :class="{ 'negative-money': item.money < 0 }"
        />
      </template>
    </van-cell>
    <van-cell
      :title="formatCurrency(route.query.totalMoney)"
      style="font-size: 23px; margin-top: 5px; text-align: center"
    />
  </van-cell-group>
</template>

<script setup>
import router from "@/router";
import { getDetail, deleteDetail } from "@/server/api";
import { showConfirmDialog } from "vant";
import { ref } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { formatCurrency } from "./format";

const route = useRoute();
const date = ref("");
onMounted(async () => {
  const res = await getDetail(JSON.parse(route.query.id));
  console.log("当日详情", res);
  date.value = res;
});
const deleteRecord = async () => {
  await showConfirmDialog({
    title: `是否确认删除 ${route.query.time} 记录？`,
  })
    .then(() => {
      deleteDetail(JSON.parse(route.query.id));
      router.push({
        path: "/",
      });
    })
    .catch(() => {});
};
</script>

<style scoped>
.negative-money {
  color: red; /* 将负数的文字颜色设为红色 */
}
</style>
