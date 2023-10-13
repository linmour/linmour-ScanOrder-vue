<template>
  <el-select
      v-model="a"
      @change="updateParma"
      placeholder="请选择"
      clearable
      class="!w-240px"
  >
    <el-option
        v-for="dict in dictList"
        :key="dict.value"
        :label="dict.label"
        :value="dict.value"
    />
  </el-select>
</template>

<script setup>
import {getDictOptions} from "../utils/dict"
import {onMounted, ref} from "vue";
const dictList = getDictOptions(props.dictType)


const props = defineProps({
  //字典的类型
  dictType:{
    type: String,
    required: true
  },
  //字典对应的值 1
  param:{
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:params'])
const updateParma = (value) => {
  emit('update:params', value)
}
const a = ref(props.param)
onMounted(() => {
  dictList.forEach(m =>{
    if (m.value == props.param){
      a.value = m.label
    }
  })

})
</script>

<style scoped>

</style>
