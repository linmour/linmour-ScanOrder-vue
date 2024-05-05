<template>
  <el-table :data="orderInfo" border style="width: 100%">
    <el-table-column prop="id" label="订单号" width="190"/>
    <el-table-column prop="tableId" label="餐桌" width="180"/>
    <el-table-column prop="payType" label="支付类型" width="150">
      <template #default="scope">
        <dicttag type="pay_type" :value="scope.row.payType" />
      </template>
    </el-table-column>
    <el-table-column label="详细菜品">
      <template #default="scope">
        <el-button
            text
            bg
            link
            type="success"
            @click="orderDetail(scope.row.id)"
        >查看订单条目
        </el-button>
      </template>

    </el-table-column>
    <el-table-column prop="remark" label="备注"/>
    <el-table-column prop="payAmount" label="支付金额"width="150"/>

    <el-table-column prop="createTime" label="时间"/>
  </el-table>

  <el-dialog v-model="dialogFormVisible" title="信息" width="40%">
    <el-table :data="orderItem" border style="width: 100%">
      <el-table-column prop="name" label="名字" width="180"/>
      <el-table-column prop="propsText" label="规格"/>
      <el-table-column prop="quantity" label="个数"/>
      <el-table-column prop="picture" label="图片">
        <el-image style="width: 100px; height: 100px" :src="picture"/>
      </el-table-column>
      <el-table-column prop="price" label="单价"/>
    </el-table>
  </el-dialog>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {GetOrderByShopId} from "../../api/linmour-order";
import Dicttag from "../../component/dicTag.vue";

const orderAll = ref()
const orderInfo = ref()
const orderItem = ref()

onMounted(() => {
  GetOrderByShopId().then(res => {
    orderAll.value = res
    orderInfo.value = res.map(obj => obj.orderInfo)
  })

})

const dialogFormVisible = ref(false)
const orderDetail = (orderId) =>{

  let a = orderAll.value.filter(n => n.orderInfo.id == orderId)
  orderItem.value =a[0].orderItems
  dialogFormVisible.value = true
}
</script>

<style scoped>

</style>
