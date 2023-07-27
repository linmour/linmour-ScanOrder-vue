<template>
  <div>
    <div className="chart" ref="barContainer"></div>
    <div className="chart" ref="lineContainer"></div>
    <div className="chart" ref="myContainer"></div>
    <div className="chart" ref="aContainer"></div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import * as echarts from 'echarts';

const barContainer = ref(null);
const lineContainer = ref(null);
const myContainer = ref(null)
const aContainer = ref(null)

onMounted(() => {
  const barChart = echarts.init(barContainer.value);
  const lineChart = echarts.init(lineContainer.value);
  const myChart = echarts.init(myContainer.value);
  const aChart = echarts.init(aContainer.value);

  const revenueData = {
    dates: ['2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06'],
    values: [100, 1500, 1200, 1800, 2000, 1600]
  };

  const constOption = {
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
      data: revenueData.dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '营业额',
        type: 'bar',
        data: revenueData.values
      }
    ]
  };

  const lineOption = {
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
      data: revenueData.dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '营业额',
        type: 'line',
        data: revenueData.values
      }
    ]
  };
  const orderStatusData = [
    {value: 25, name: '待处理'},
    {value: 60, name: '进行中'},
    {value: 15, name: '已完成'}
  ];
  const myOption = {
    title: {
      text: '订单状态占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['待处理', '进行中', '已完成']
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: '50%',
        center: ['50%', '60%'],
        data: orderStatusData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const data = [
    {name: '菜品1', sales: 100},
    {name: '菜品2', sales: 200},
    {name: '菜品3', sales: 300},
    {name: '菜品', sales: 150},
    {name: '菜品5', sales: 250},
  ];

  const aOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: data.map(item => item.sales),
      },
    ],
  };

  barChart.setOption(constOption);
  lineChart.setOption(lineOption);
  myChart.setOption(myOption);
  aChart.setOption(aOption);
});


</script>

<style scoped>
.chart {
  width: 50%;
  height: 300px;
  float: left;
}
</style>