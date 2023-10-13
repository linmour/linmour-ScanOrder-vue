<template>
  <div>
    <div>
      <el-input v-model="state.queryParams.name" placeholder="店铺名字" class="ml5 w300" style="height: 40px"/>
      <el-select v-model="state.queryParams.status" placeholder="店铺状态" class="ml5" size="large">
        <el-option :key="1" label="正常" :value="1"/>
        <el-option :key="0" label="停用" :value="0"/>
      </el-select>
      <el-button class="ml5" type="primary">
        <el-icon style="vertical-align: middle;">
          <Search/>
        </el-icon>
        <span style="vertical-align: middle" @click="load"> 搜索 </span>
      </el-button>
      <el-button type="warning">
        <el-icon style="vertical-align: middle;">
          <RefreshLeft/>
        </el-icon>
        <span style="vertical-align: middle" @click="reset"> 重置 </span>
      </el-button>
      <el-button type="success" class="ml5">
        <el-icon style="vertical-align: middle;">
          <Plus/>
        </el-icon>
        <span style="vertical-align: middle"> 新增 </span>
      </el-button>
    </div>
    <div style="margin: 10px 0">
      <el-table row-key="date" :data="state.tableData" style="width: 100%">
        <el-table-column
            prop="createTime"
            label="开店时间"
            sortable
            width="180"
            column-key="createTime"

        />
        <el-table-column prop="name" label="名字" width="180"/>
        <el-table-column prop="position" label="所在城市"/>

        <el-table-column  prop="businessHours" label="运营时间" />
        <el-table-column
            prop="businessStatus"
            label="运营状态"
            width="100"
        >
          <template #default="scope">
            <el-tag
                :type="scope.row.businessStatus === 1 ? '' : 'success'"
                disable-transitions
            >{{ scope.row.businessStatus === 1 ? '营业中' : '休息中' }}
            </el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template #default="scope">
            <el-button type="primary" @click="edit(scope.row)">详情</el-button>
            <el-button type="success" @click="entire(scope.row)">进入店铺</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogFormVisible" title="信息" width="40%">
      <el-form :model="state.form" label-width="80px" style="padding: 0 20px" status-icon>
        <el-form-item prop="name" label="名字">
          <el-input v-model="state.form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item prop="intro" label="简介">
          <el-input v-model="state.form.intro" autocomplete="off"/>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="state.form.status" style="width: 100%">
            <el-option :key="1" label="正常" :value="1"/>
            <el-option :key="0" label="停用" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item  prop="businessHours" label="运营时间">
          <el-time-picker v-model="state.form.businessHours" autocomplete="off" value-format="HH:mm:ss"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </span>
      </template>
    </el-dialog>

    <page
        :total="total"
        v-model:page="state.queryParams.pageNo"
        v-model:limit="state.queryParams.pageSize"
        @pagination="getList"
    />
  </div>
</template>

<script setup>
import {
  Search, RefreshLeft, Plus
} from '@element-plus/icons-vue'
import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from 'vue-router'

import {useMenuStore, useShopStore} from "../stores";
import Page from "../component/paging.vue";
import {shopList} from "../api/linmour-system/shop";


const MenuStore = useMenuStore()
const ShopStore = useShopStore()
const router = useRouter()
const state = reactive({
  tableData: [],
  queryParams: {
    pageNo: 1,
    pageSize: 10,
    name: undefined,
    status: undefined
  },
  form: {}
})

const total = ref(0)
const getList =  async () =>{
  const res = await shopList(state.queryParams)
    if (res.code === 200) {
      state.tableData = res.data.list
      total.value = res.data.total
  }
}

const dialogFormVisible = ref(false)
const reset = () => {
  state.queryParams.name = undefined
}

const entire = (row) => {
  ShopStore.setShopId(row.id)
  MenuStore.setSort('2')
  router.push('/overview')
}

const edit = (row) => {
  state.form.name = row.name
  state.form.intro = row.intro
  state.form.status = row.status
  state.form.businessHours = row.businessHours
  dialogFormVisible.value = true
}


onMounted(() => {
  getList()

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
