<template>
  <van-nav-bar title="账单新增" v-if="$route.path == '/add'" safe-area-inset-top/>
  <van-nav-bar
    title="账单管理"
    v-if="$route.path == '/'"
    @click-right="refreshPage"
    safe-area-inset-top
  >
    <template #right>
      <van-icon name="replay" size="20" color="blue" />
    </template>
  </van-nav-bar>
  <van-nav-bar
    title="账单详情"
    left-text="返回"
    left-arrow
    @click-left="$router.go(-1)"
    v-if="$route.path == '/details'"
    @click-right="refreshPage"
    safe-area-inset-top
  >
    <template #right>
      <van-icon name="replay" size="20" color="blue"/>
    </template>
  </van-nav-bar>
  <van-nav-bar title="账单分析" v-if="$route.path == '/analysis'" />

  <router-view />

  <van-tabbar route safe-area-inset-bottom>
    <van-tabbar-item replace to="/add" icon="plus">新增</van-tabbar-item>
    <van-tabbar-item replace to="/" icon="underway-o">记录</van-tabbar-item>
    <van-tabbar-item replace to="/analysis" icon="chart-trending-o">分析</van-tabbar-item>
    
  </van-tabbar>
</template>

<script setup>


const refreshPage = () => {
  window.location.reload(); // 使用 window 对象来调用 reload
};
</script>

<style scoped></style>
