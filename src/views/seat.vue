<template>
  <el-row :gutter="12">
    <el-col v-for="(item, index) in state.form" :key="index" :span="8">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
            <el-tag :type="item.status === 1 ? 'danger' : (item.status === 0 ? 'success' : 'warning')">
              {{ item.status === 1 ? '有人' : (item.status === 0 ? '空闲' : '已预订') }}
            </el-tag>

          </div>
        </template>
        <div>
          菜品是否已上完:
          <el-tag style=" float: right;" :type="item.serving === 1 ? 'success' : 'danger'">{{ item.serving === 1 ? '是' : "否"}}</el-tag>
        </div>
        <div>
          <el-badge value="new" class="item" :hidden="hidden">
            <el-button @click="orderDetail">订单详情</el-button>
          </el-badge>
        </div>
      </el-card>
    </el-col>

  </el-row>
  <el-dialog v-model="dialogVisible" title="Tips" :width="dialogWidth" :before-close="handleClose">
    <div class="card-container" style="display: flex; justify-content: space-between; gap: 10px">
      <el-card v-for="item in 3" :key="item" class="box-card" ref="cardRefs">
        <div v-for="o in 14" :key="o" class="text item">{{ item }}</div>
      </el-card>
    </div>
  </el-dialog>

</template>

<script setup>
import {nextTick, onMounted, reactive, ref} from "vue";
import {getTable} from "../api/linmour-restaurant/table";
import {getOrderInfo} from "../api/linmour-order";
const dialogVisible = ref(false);
const dialogWidth = ref('30%');

const hidden = ref(true)

const state =reactive({
  form:{},
  orderList:[]
})
//后台推送订单
const getSocketData = (res) => {


}
const orderDetail = () =>{
  getOrderInfo().then(res =>{
     state.orderList = res.data
    console.log(state.orderList)
  })
  // dialogWidth.value = res.data.length *
  dialogVisible.value = true
}
onMounted(async () => {
  window.addEventListener('onmessageWS', getSocketData)

  getTable(1).then(res => {
    if (res.code === 200) {
      state.form = res.data
    }
  })
})

const handleClose = () => {
  dialogVisible.value = false;
};


</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}

</style>
