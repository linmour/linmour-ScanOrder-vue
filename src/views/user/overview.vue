<template>
  <div style="display: flex; gap: 50px;">
    <el-card style="width: 350px">
      <template #header>
        <div class="card-header">
          <span>今 日 营 业 额</span>
        </div>
      </template>
      <div style="font-size: 30px">
        {{ dataAnaly.orderSummaryDay.price }} 元

      </div>
    </el-card>
    <el-card style="width: 350px">
      <template #header>
        <div class="card-header">
          <span>今 日 订 单 数</span>
        </div>
      </template>
      <div style="font-size: 30px">
        {{ dataAnaly.orderSummaryDay.orderNum }} 个
      </div>
    </el-card>
    <el-card style="width: 380px">
      <template #header>
        <div class="card-header">
          <span>今 日 菜 品 销 售 总 数</span>
        </div>
      </template>
      <div style="font-size: 30px">
        {{ dataAnaly.orderSummaryDay.productNum }} 个
      </div>
    </el-card>
    <el-card>
      <el-table :data="dataAnaly.productSummaryDay" style="height: 120px">
        <el-table-column prop="name" label="商品名" width="150"/>
        <el-table-column prop="num" label="销量" width="120"/>
      </el-table>
    </el-card>

  </div>

</template>

<script setup>
import {ref, onMounted} from 'vue';
import {initWebSocket, websocketsend} from '../../utils/webstock';


onMounted(() => {

  initWebSocket();
  setTimeout(() => {
    websocketsend(`{"dataAnaly": ""}`);
  }, 100); // 延迟 100 毫秒
  window.addEventListener('onmessageWS', getSocketData)


});

const dataAnaly = ref({
  orderSummaryDay: {
    orderNum: 0,

    price: 0,
    productNum: 0,
  },
  productSummaryDay: [],
  timePeriodMap: []
});

const getSocketData = (res) => {
  res = JSON.parse(res.detail.data)

  //res和dataAnaly结构不一样，直接赋值感知不到数据更新
  dataAnaly.value.orderSummaryDay.price = res.orderSummaryDay.price;
  dataAnaly.value.orderSummaryDay.orderNum = res.orderSummaryDay.orderNum;
  dataAnaly.value.orderSummaryDay.productNum = res.orderSummaryDay.productNum;
  dataAnaly.value.productSummaryDay = res.productSummaryDay;
  dataAnaly.value.timePeriodMap = res.timePeriodMap
  // for (let i = 0; i < dataAnaly.value.timePeriodMap.length; i++) {
  //   if (dataAnaly.value.timePeriodMap[i].orderNum == undefined)
  //     orderStatusData.value[i].value = 0
  //   else
  //     orderStatusData.value[i].value = dataAnaly.value.timePeriodMap[i].orderNum;
  // }
  // myChart.value.setOption(myOption.value);

}

</script>

<style scoped>
.chart {
  width: 50%;
  height: 300px;
  float: left;
}

.left-column {
  float: left;
  width: 50%;
}

.right-column {
  float: right;
  width: 50%;
}
</style>
