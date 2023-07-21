<template>
  <div>
    <div>
      <el-input v-model="state.queryParams.name" placeholder="店铺名字" class="ml5 w300" style="height: 40px"/>
      <el-select v-model="state.queryParams.status" placeholder="店铺状态" class="ml5" size="large">
        <el-option :key="1" label="正常" :value="1" />
        <el-option :key="0" label="停用" :value="0" />
      </el-select>
      <el-button class="ml5" type="primary">
        <el-icon style="vertical-align: middle;">
          <Search />
        </el-icon>
        <span style="vertical-align: middle" @click="load"> 搜索 </span>
      </el-button>
      <el-button type="warning" >
        <el-icon style="vertical-align: middle;">
          <RefreshLeft />
        </el-icon>
        <span style="vertical-align: middle" @click="reset"> 重置 </span>
      </el-button>
      <el-button type="success" class="ml5">
        <el-icon style="vertical-align: middle;">
          <Plus />
        </el-icon>
        <span style="vertical-align: middle"> 新增 </span>
      </el-button>
    </div>
    <div style="margin: 10px 0">
      <el-table :data="state.tableData" stripe border>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="intro" label="简介"></el-table-column>
        <el-table-column prop="status" label="店铺状态"> </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogFormVisible" title="信息" width="40%">
      <el-form :model="state.form" label-width="80px" style="padding: 0 20px" status-icon>
        <el-form-item prop="name" label="名字" >
          <el-input v-model="state.form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="intro" label="简介" >
          <el-input v-model="state.form.intro" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="status" label="状态" >
          <el-select v-model="state.form.status" style="width: 100%">
            <el-option :key="1" label="正常" :value="1" />
            <el-option :key="0" label="停用" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          保存
        </el-button>
      </span>
      </template>
    </el-dialog>



    <div style="margin: 10px 0">
      <el-pagination
          @current-change="load"
          @size-change="load"
          v-model:current-page="state.queryParams.pageNo"
          v-model:page-size="state.queryParams.pageSize"
          background
          :page-sizes="[1, 5, 10, 20]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup>
import {
  Search, RefreshLeft, Plus
} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from "vue";

import {shopList} from "../api/linmour-account/shop";


const state = reactive({
    tableData: [],
    queryParams: {
      pageNo: 1,
      pageSize: 10,
      name: undefined,
      status: undefined
    },
  form:{}
})
const dialogFormVisible = ref(false)
const total = ref(0)
const reset = () =>{
  state.queryParams.name = undefined
  load()
}

const load = () => {
  shopList(state.queryParams).then(res =>{
    console.log(res)
    if (res.code === 200){
      state.tableData = res.data.list
      total.value = res.data.total
    }
  })
}

const edit = (row) =>{
  state.form.name = row.name
  state.form.intro = row.intro
  state.form.status = row.status
  console.log(row)
  dialogFormVisible.value = true
}

onMounted(() =>{
  load()
})

</script>

<style>

.ml5 {
  margin-left: 5px;
}
.w300 {
  width: 250px;
}

th {
  background-color: aliceblue !important;
}

</style>