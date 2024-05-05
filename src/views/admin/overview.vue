<template>
  <div style="display: flex; gap: 50px;">
    <el-card style="width: 350px">
      <template #header>
        <div class="card-header">
          <span>商  户  总  量</span>
        </div>
      </template>
      <div style="font-size: 30px">
      </div>
    </el-card>
    <el-card style="width: 350px">
      <template #header>
        <div class="card-header">
          <span>店 铺 总 数</span>
        </div>
      </template>
      <div style="font-size: 30px">
      </div>
    </el-card>
    <el-card style="width: 350px">
      <template #header>
        <div class="card-header">
          <span>订 单 总  数</span>
        </div>
      </template>
      <div style="font-size: 30px">
      </div>
    </el-card>
    <el-card style="width: 380px">
      <template #header>
        <div class="card-header">
          <span>用  户  总  数</span>
        </div>
      </template>
      <div style="font-size: 30px">
      </div>
    </el-card>
  </div>
  <!--  <el-calendar>-->
  <!--    <template #date-cell="{ data }">-->
  <!--      <p :class="data.isSelected ? 'is-selected' : ''">-->
  <!--        {{ data.day.split('-').slice(1).join('-') }}-->
  <!--        {{ data.isSelected ? '✔️' : '' }}-->
  <!--      </p>-->
  <!--    </template>-->
  <!--  </el-calendar>-->
  <div style="margin-top: 150px" className="chart" ref="lineContainer"></div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {initWebSocket, websocketsend} from '../../utils/webstock';
import * as echarts from "echarts";
import {shopList} from "../../api/linmour-system/shop";
import {getMerchant} from "../../api/linmour-system/merchant";
import {GetOrderByShopId} from "../../api/linmour-order";

const lineContainer = ref();
const lineChart = ref()


const generateDatesFromSevenDaysAgo = (date) => {
  const datesArray = [];
  for (let i = 6; i >= 0; i--) {
    // 减去当前天数，从6天前开始
    const pastDate = new Date(date);
    pastDate.setDate(pastDate.getDate() - i);
    // 格式化日期为所需的字符串格式，例如：'YYYY-MM-DD'
    const formattedDate = pastDate.toISOString().split('T')[0];
    datesArray.push(formattedDate);
  }
  return datesArray;
}

onMounted(async () => {

  const date = ref([])
  date.value = generateDatesFromSevenDaysAgo(new Date());
  const res = await shopList()
  const res1 = await getMerchant()
  const res2 = await GetOrderByShopId()
  // 定义countDataByDates函数来统计数据
  const countDataByDates = (list, dates) => {
    const dateCounts = {}; // 创建一个映射来存储每个日期的计数
    // 统计每个日期的数据个数
    list.forEach(({createTime, id}) => {
      const dateKey = new Date(createTime).toISOString().split('T')[0];
      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
    });

    // 构建结果数组，按日期顺序填充计数，没有数据的日子为0
    return dates.map(date => dateCounts[date] || 0);
  };

  const dataCounts =ref(countDataByDates(res.list, date.value)) ;
  const dataCounts1 =ref(countDataByDates(res1, date.value)) ;
  const dataCounts2 =ref(countDataByDates(res2.map(n => n.orderInfo), date.value)) ;
  console.log(dataCounts.value);
  console.log(dataCounts1.value);
  console.log(dataCounts2.value);

// 更新lineOption的source属性以使用新的date.value
const lineOption = ref({
  title: {
    left: 'center',
    text: '近七日数据',
    textStyle: {
      color: '#6d6'
    }
  },
  tooltip: {},
  legend: {
    left: 'right',
    data: ['店铺个数', '商户个数','订单数量']
  },
  dataset: {
    source: [
      date.value,
      dataCounts.value,
      dataCounts1.value,
      dataCounts2.value
    ]
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {},
  series: [
    {
      name: '店铺个数',
      type: 'line',
      seriesLayoutBy: 'row',
      label: {
        show: true
      }
    },
    {
      name: '商户个数',
      type: 'line',
      seriesLayoutBy: 'row',
      label: {
        show: true
      }
    },
    {
      name: '订单个数',
      type: 'line',
      seriesLayoutBy: 'row',
      label: {
        show: true
      }
    }
  ]

});

initWebSocket();
setTimeout(() => {
  lineChart.value = echarts.init(lineContainer.value);
  lineChart.value.setOption(lineOption.value);
  websocketsend(`{"dataAnaly": ""}`);
}, 100); // 延迟 100 毫秒

// 监听窗口大小变化，自适应图表
window.addEventListener('resize', () => {
  if (lineChart.value !== null && lineChart.value !== undefined) {
    lineChart.value.resize();
  }
});

})
;


</script>

<style scoped>
.chart {
  width: 90%; /* 或者指定一个具体的像素值，如 '600px' */
  height: 600px; /* 根据您的需求调整高度 */
}
</style>
