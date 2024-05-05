<template>
  <el-table :data="state.tableData" border style="width: 100%">
    <el-table-column prop="shopName" label="店名" width="180"/>
    <el-table-column prop="payAmount" label="支付金额"/>
    <el-table-column prop="commission" label="抽成"/>
    <el-table-column prop="payType" label="支付类型">

      <template #default="scope">
        <dicttag type="pay_type" :value="scope.row.payType" />
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="支付时间"/>

  </el-table>
</template>

<script setup>

import {onMounted, reactive} from "vue";
import {getOrderPayAmount} from "../../api/linmour-order";
import Dicttag from "../../component/dicTag.vue";

const state = reactive({
  tableData: [],
  queryParams: {
    pageNo: 1,
    pageSize: 10,
  },
  form: {}
})

// const changeStatus = async (row) => {
//   await save0rUpdateMerchant(row)
// }

const getList =  async () =>{
  let res = await getOrderPayAmount(state.queryParams)
  state.tableData = res
}

onMounted(() => {
  getList()
})


</script>

<style scoped>

</style>
