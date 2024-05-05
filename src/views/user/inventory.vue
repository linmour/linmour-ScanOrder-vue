<template>
  <el-main>
    <el-button @click="addInventory">添加库存</el-button>
  </el-main>
  <el-table :data="inventory" border style="width: 100%">
    <el-table-column prop="name" label="食材" width="190"/>
    <el-table-column prop="num" label="库存个数" width="180"/>
    <el-table-column prop="threshold" label="阈值" width="180"/>

      <el-table-column label="相关菜品">
        <template  #default="scope">
          <el-tag
              v-for="product in scope.row.productInfo"
              class="mx-1"
              effect="dark"
          >
            {{ product.name }}
          </el-tag>
        </template>
      </el-table-column>

    <el-table-column prop="unit" label="计量单位"/>
    <el-table-column prop="unit" label="操作">
      <template #default="scope">
        <el-button @click="update(scope.row.id)">修改</el-button>
        <el-button @click="deleted(scope.row.id)">删除</el-button>
      </template>

    </el-table-column>
  </el-table>


  <el-dialog
      v-model="centerDialogVisible"
      width="500"
      align-center
  >
    <el-form :model="state.form" label-width="80px" style="padding: 0 20px" status-icon>
      <el-form-item prop="name" label="食材">
        <el-input v-model="state.form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="unit" label="计量单位">
        <el-input v-model="state.form.unit" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="num" label="库存个数">
        <el-input v-model="state.form.num" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="threshold" label="阈值">
        <el-input v-model="state.form.threshold" autocomplete="off"/>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogFormVisible" title="信息" width="40%">
    <el-form :model="state.form" label-width="80px" style="padding: 0 20px" status-icon>
      <el-form-item prop="name" label="名字">
        <el-input v-model="state.form.name" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="unit" label="计量单位">
        <el-input v-model="state.form.unit" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="num" label="库存个数">
        <el-input v-model="state.form.num" autocomplete="off"/>
      </el-form-item>
      <el-form-item prop="threshold" label="阈值">
        <el-input v-model="state.form.threshold" autocomplete="off"/>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
         <el-button @click="submit1">确定</el-button>
        <el-button @click="cancel1">取消</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {getProductInventory, createInventory} from "@/api/linmour-product/product";
import {onMounted, reactive, ref} from "vue";
import {deletedInventory, getProductInventoryById, updateInventory} from "../../api/linmour-product/product";

const state = reactive({
  queryParams: {
    pageNo: 1,
    pageSize: 10,
  },
  form: {}
})
const centerDialogVisible = ref(false)
const dialogFormVisible = ref(false)
const inventory = ref([])

const addInventory = () => {
  centerDialogVisible.value = true
}

const submit = () => {
  createInventory(state.form).then(res => {
    getInventory()
  })
  centerDialogVisible.value = false
}
const submit1 = () => {
  updateInventory(state.form).then(getInventory(), dialogFormVisible.value = false, getInventory())
}
const cancel = () => {
  centerDialogVisible.value = false
}
const cancel1 = () => {
  dialogFormVisible.value = false
}

const update = (id) => {
  getProductInventoryById(id).then(res => {
    state.form = res
  })
  dialogFormVisible.value = true
}

const deleted = (id) => {
  deletedInventory(id).then(res => {
    getInventory()
  })

}

onMounted(() => {
  getInventory()

})
const getInventory = () => {
  getProductInventory(state.queryParams).then(res => {
    inventory.value = res.list
    console.log(inventory.value,"-----/*/")
  })
}

const productInfo = () => {

}

</script>

<style scoped>

</style>
