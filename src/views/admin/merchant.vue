<template>
  <el-table :data="state.tableData" border style="width: 100%">
    <el-table-column prop="realName" label="名字" width="180"/>
    <el-table-column prop="phone" label="电话"/>
    <el-table-column prop="idCardUrl" label="身份证图片">
      <template #default="scope">
        <el-image style="width: 100px; height: 100px" :src="scope.row.idCardUrl" :fit="fit" />
      </template>
    </el-table-column>
    <el-table-column prop="avatar" label="头像">
      <template #default="scope">
        <el-image style="width: 100px; height: 100px" :src="scope.row.avatar" :fit="fit" />
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        <dicttag type="common_sex" :value="scope.row.sex" />
      </template>
    </el-table-column>
    <el-table-column prop="status" label="账号状态">
      <template #default="scope">
        <el-switch
            v-model="scope.row.status"
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
    <el-table-column prop="idCard" label="身份证"/>
    <el-table-column prop="createTime" label="开店时间"/>
    <el-table-column label="操作" width="230px">
      <template #default="scope">
        <el-button @click="edit(scope.row.id)">修改</el-button>
        <el-button @click="deleted(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>

import {onMounted, reactive} from "vue";
import {getMerchant, save0rUpdateMerchant} from "../../api/linmour-system/merchant";
import { Check, Close } from '@element-plus/icons-vue'
import Dicttag from "../../component/dicTag.vue";

const state = reactive({
  tableData: [],
  queryParams: {
    pageNo: 1,
    pageSize: 10,
    name: undefined,
  },
  form: {}
})

const changeStatus = async (row) => {
  await save0rUpdateMerchant(row)
}

const getList =  async () =>{
  let res = await getMerchant(state.queryParams)
  state.tableData = res
}

onMounted(() => {
  getList()
})



</script>

<style scoped>



</style>
