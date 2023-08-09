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
          <el-button>订单详情</el-button>
        </div>
      </el-card>
    </el-col>

  </el-row>


</template>

<script setup>
import {onMounted, reactive} from "vue";
import {getTable} from "../api/linmour-restaurant/table";

const state =reactive({
  form:{}
})

onMounted(() =>{
  getTable(1).then(res =>{
    if (res.code === 200){
      state.form = res.data
    }
  })
})
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
</style>
