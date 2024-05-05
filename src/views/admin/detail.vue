<template>
  <el-switch
      v-model="value"
      inline-prompt
      style="--el-switch-on-color: #91cc75; --el-switch-off-color: #fac858"
      active-text="表"
      inactive-text="图"
  />
  <div>

    <div className="chart" ref="barContainer"></div>
    <div className="chart" ref="lineContainer"></div>
    <div className="chart" ref="myContainer"></div>
    <div className="chart" ref="aContainer"></div>

  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import * as echarts from 'echarts';

const barContainer = ref();
const lineContainer = ref();
const myContainer = ref()
const aContainer = ref()
const value = ref(false)

const revenueData = ref({
  dates: ['2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06'],
  values: [100, 1500, 1200, 1800, 2000, 1600]
});
const orderStatusData = ref([
  {value: 0, name: '早餐'},
  {value: 0, name: '午餐'},
  {value: 0, name: '晚餐'},
  {value: 0, name: '宵夜'}
]);
const data = ref([
  {name: '菜品1', sales: 100},
  {name: '菜品2', sales: 200},
  {name: '菜品3', sales: 300},
  {name: '菜品', sales: 150},
  {name: '菜品5', sales: 250},
]);
const myOption = ref({
  title: {
    text: '用餐时间段',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['早餐', '午餐', '晚餐', '宵夜']
  },
  series: [
    {
      name: '用餐时间段',
      type: 'pie',
      radius: '50%',
      center: ['50%', '60%'],
      data: orderStatusData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});
const lineOption = ref({
  title: {
    text: '营业额折线图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c} 元'
  },
  xAxis: {
    type: 'category',
    data: revenueData.value.dates
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '营业额',
      type: 'line',
      data: revenueData.value.values
    }
  ]
});
const aOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  xAxis: {
    type: 'category',
    data: data.value.map(item => item.name),
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'bar',
      data: data.value.map(item => item.sales),
    },
  ],
});
const constOption = ref({
  title: {
    text: '营业额柱状图',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b}: {c} 元'
  },
  xAxis: {
    type: 'category',
    data: revenueData.value.dates
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '营业额',
      type: 'bar',
      data: revenueData.value.values
    }
  ]
});


const barChart = ref()
const lineChart = ref()
const myChart = ref()
const aChart = ref()

onMounted(() => {
  console.log('---------------')
  barChart.value = echarts.init(barContainer.value);
  lineChart.value = echarts.init(lineContainer.value);
  myChart.value = echarts.init(myContainer.value);
  aChart.value = echarts.init(aContainer.value);
  barChart.value.setOption(constOption.value);
  lineChart.value.setOption(lineOption.value);
  myChart.value.setOption(myOption.value);
  aChart.value.setOption(aOption.value);

});

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
