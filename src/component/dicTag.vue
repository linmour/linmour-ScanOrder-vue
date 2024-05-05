<template>
  <span
      v-if="getDictData(type,value).colorType === 'default' || getDictData(type,value).colorType === '' || getDictData(type,value).colorType === undefined"
      :key="getDictData(type,value).value" :index="index"
  >{{ getDictData(type, value).label }}</span>
  <el-tag v-else :disable-transitions="true" :key="getDictData(type,value).value" :index="getDictData(type,value).id"
          :type="getDictData(type,value).colorType">
    {{ getDictData(type, value).label }}
  </el-tag>
</template>

<script setup>
import {getJSONLocalstorage} from "../utils/localStorage";

const props = defineProps({
  type: String,
  value: [Number, String, Boolean, Array],
});


const getDictData = (type, value) => {
  let a = getJSONLocalstorage("DictList")
  let b = a.filter(m => m.dictType == type)
  return b.filter(m => m.value == value)[0];
}

</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
