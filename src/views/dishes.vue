<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="id" label="id" width="180" />
    <el-table-column prop="name" label="name" width="180" />
    <el-table-column prop="intro" label="intro" />
  </el-table>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getProductList } from "../api/linmour-product/product";
import { getLocalstorage } from "../utils/localStorage";

const tableData = ref([]);

onMounted(() => {
  getProductList(JSON.parse(getLocalstorage("pinia-shopStore")).shopId)
      .then(res => {
        if (res.code === 200) {
          tableData.value = res.data;
        }
      })
      .catch(error => {
        console.error(error);
      });
});
</script>


<style scoped>

</style>