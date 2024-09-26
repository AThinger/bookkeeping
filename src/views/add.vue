<template>
  <van-cell-group>
    <van-field
      v-for="(items, index) in addForm"
      :key="index"
      :label="items.name"
      v-model="items.money"
      :left-icon="items.icon"
      :placeholder="`请输入${items.name}收入`"
      type="number"
      label-width="20%"
      size="large"
      style="font-size: 1.1rem"
    />
    <!-- 展示新增数据 -->
    <van-field
      v-if="addedItems.length"
      v-for="(item, index) in addedItems"
      :key="index"
      :label="item.name"
      v-model="item.money"
      :left-icon="item.icon"
      right-icon="delete"
      @click-right-icon="removeItem(index)"
      type="number"
      label-width="20%"
      size="large"
      style="font-size: 1.1rem"
    />
    <van-field
      v-model="time"
      @click="showCalendar = true"
      left-icon="clock"
      label="日历"
      placeholder="点击选择日期"
      label-width="20%"
      size="large"
      style="font-size: 1.1rem"
    />
    <van-calendar
      v-model:show="showCalendar"
      @confirm="onConfirmDate"
      :show-confirm="false"
      :min-date="new Date(2024, 8, 1)"
    />
  </van-cell-group>
  <van-button
    plain
    icon="plus"
    type="primary"
    @click="showPopup = true"
    class="btn"
  >
    新增数据
  </van-button>
  <van-button type="primary" icon="passed" @click="onConfirm" class="btn">
    提交
  </van-button>
  <!-- 新增数据弹窗 -->
  <van-popup
    v-model:show="showPopup"
    closeable
    close-icon="close"
    round
    :style="{ padding: '35px' }"
    @click-close-icon="resetAddForm"
  >
    <van-cell-group>
      <van-field
        v-model="newDateForm.name"
        clearable
        label="名称"
        left-icon="records-o"
        label-width="20%"
        size="large"
        style="font-size: 1.1rem"
      />
      <van-field
        v-model="newDateForm.money"
        clearable
        type="number"
        label="金额"
        left-icon="balance-o"
        label-width="20%"
        size="large"
        style="font-size: 1.1rem"
      />
    </van-cell-group>
    <van-button
      type="primary"
      plain
      @click="addItem"
      style="width: 100%"
      icon="plus"
      >添加</van-button
    >
  </van-popup>
</template>

<script setup>
import { ref } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { PostAdd } from "../server/api";

// 获取当前日期并格式化为 "YYYY-MM-DD"
const today = new Date();
const formattedDate = `${today.getFullYear()}-${String(
  today.getMonth() + 1
).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

// 表单相关
const addForm = ref([
  {
    name: "现金",
    money: "",
    icon: "gold-coin",
  },
  {
    name: "微信",
    money: "",
    icon: "wechat",
  },
  {
    name: "支付宝",
    money: "",
    icon: "alipay",
  },
  {
    name: "乐刷",
    money: "",
    icon: "card",
  },
]);

// 日期选择器相关
const showCalendar = ref(false);
const time = ref(formattedDate);
const onConfirmDate = (selectedDate) => {
  showCalendar.value = false;
  time.value =
    selectedDate.getFullYear() +
    "-" +
    String(selectedDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(selectedDate.getDate()).padStart(2, "0");
};

// 新增数据弹窗相关
const showPopup = ref(false);
const newDateForm = ref({
  name: "",
  money: "",
});
const addedItems = ref([]);
// 清空+关闭 弹窗
const resetAddForm = () => {
  newDateForm.value = { name: "", money: "" };
  showPopup.value = false;
};
const addItem = () => {
  if (newDateForm.value.name && newDateForm.value.money) {
    addedItems.value.push({
      name: newDateForm.value.name,
      money: newDateForm.value.money,
      icon: "balance-list-o",
    });
    resetAddForm();
    showToast("添加数据成功");
  } else {
    if (!newDateForm.value.name && newDateForm.value.money) {
      showToast("请填写名称");
      return;
    } else if (!newDateForm.value.money && newDateForm.value.name) {
      showToast("请填写金额");
      return;
    } else {
      showToast("请填写名称和金额");
    }
  }
};
// 删除数据项
const removeItem = (index) => {
  addedItems.value.splice(index, 1); // 从数组中移除对应项
  showToast("删除数据成功");
};

// 提交表单
const router = useRouter();
const onConfirm = async () => {
  // 处理表单数据
  const form = [...addForm.value, ...addedItems.value];
  // 验证每个 items 的 money 字段是否为空
  for (let item of form) {
    if (!item.money) {
      showToast(`"${item.name}" 不得为空`);
      return;
    }
  }
  // 计算每个项的总金额
  const totalMoney = form.reduce((total, item) => {
    return total + Number(item.money); // 确保将总金额转换为数字类型进行累加
  }, 0);
  const result = {
    form: form,
    totalMoney: totalMoney,
    time: time.value,
  };
  console.log("新增的数据", result);
  const addId = await PostAdd(result);
  router.push({
    path: "/details",
    query: {
      id: JSON.stringify(addId),
      time: time.value,
      totalMoney: totalMoney,
    },
  });
};
</script>

<style scoped>
.btn {
  width: 45%;
  margin-top: 10px;
  margin-left: 13px;
}
</style>
