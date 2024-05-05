<template>
  <el-table :data="state.tableData" border style="width: 100%">
    <el-table-column prop="name" label="名字" width="180"/>
    <el-table-column prop="intro" label="简介"/>
    <el-table-column prop="feeRate" label="费率 %" />
    <el-table-column prop="auditStatus" label="审核状态">
      <template #default="scope">
        <dicttag type="audit_status" :value="scope.row.auditStatus" />
      </template>
    </el-table-column>
    <el-table-column prop="shopStatus" label="店铺状态">
      <template #default="scope">
        <el-switch
            v-model="scope.row.shopStatus"
            class="mt-2"
            style="margin-left: 24px"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            @change="changeStatus(scope.row)"
            :active-value="1"
            :inactive-value="0"
        />
      </template>
    </el-table-column>
    <el-table-column prop="parentId" label="店铺类型">
      <template #default="scope">
        <el-tag v-if="scope.row.parentId == 0" type="primary">主店</el-tag>
        <el-tag v-else type="primary">分店</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="realName" label="所属人"/>
    <el-table-column prop="businessStatus" label="营业状态">
      <template #default="scope">
        <dicttag type="business_status" :value="scope.row.businessStatus" />
      </template>
    </el-table-column>
    <el-table-column prop="businessHours" label="营业时间段"/>

    <el-table-column prop="position" label="地址"/>
    <el-table-column label="操作" width="230px">
      <template #default="scope">
        <el-button @click="edit(scope.row.id)">修改</el-button>
        <el-button @click="deleted(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>

import {save0rUpdateShop, shopList} from "../../api/linmour-system/shop";
import {onMounted, reactive, ref} from "vue";
import Dicttag from "../../component/dicTag.vue";
import { Check, Close } from '@element-plus/icons-vue'

const state = reactive({
  tableData: [],
  queryParams: {
    pageNo: 1,
    pageSize: 10,
    name: undefined,
  },
  form: {}
})

const getList =  async () =>{
  let res = await shopList(state.queryParams)
    state.tableData = res.list
}
const changeStatus = async (row) => {
  await save0rUpdateShop(row)
}

onMounted(() => {
  getList()

})
</script>

<style scoped>

</style>
