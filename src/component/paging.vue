<template>
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
</template>

<script setup>
import {shopList} from "../api/linmour-account/shop";
import {defineEmits, onMounted, reactive, ref, watch} from "vue";
import {getProductList} from "../api/linmour-product/product";
import {getLocalstorage} from "@/utils/localStorage";

const shopId = ref()
const total = ref(0)
const state = reactive({
  queryParams: {
    pageNo: 1,
    pageSize: 10,
  },
})
const emits = defineEmits(["update:params"]);
const load = () => {
  // state.queryParams = props.param
  //查询商店
  if (props.type === 1){
    shopList(state.queryParams).then(res =>{
      if (res.code === 200){
        state.tableData = res.data.list
        total.value = res.data.total
        emits('update:params', state.tableData);

      }
    })
  //查询菜品
  }else if (props.type === 2){
    shopId.value = JSON.parse(getLocalstorage("ShopId")).shopId
    state.queryParams.shopId = shopId
    getProductList(state.queryParams).then(res =>{
      if (res.code === 200){
        state.tableData = res.data.list
        total.value = res.data.total
        emits('update:params', state.tableData);
      }
    })
  }
}

watch(props.param,(newVal) =>{
  state.queryParams = newVal
  load()
},{deep:true})

const props = defineProps({
      type: Number,
      param:{}// 子组件接收的 prop
    },
);

onMounted(() =>{
  load()
})
</script>

<style scoped>

</style>
