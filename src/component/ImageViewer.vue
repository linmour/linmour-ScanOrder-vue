<script lang="ts" setup>
import {computed, defineOptions, PropType, ref} from 'vue'

defineOptions({ name: 'ImageViewer' })

const props = {
  urlList: {
    type: Array as PropType<string[]>,
    default: (): string[] => []
  },
  zIndex: 200,
  initialIndex: 0,
  infinite: true,
  hideOnClickModal: false,
  appendToBody: false,
  show: false
};

const getBindValue = computed(() => {
  const propsData = { ...props }
  delete propsData.show
  return propsData
})

const show = ref(props.show)

const close = () => {
  show.value = false
}
</script>

<template>
  <ElImageViewer v-if="show" v-bind="getBindValue" @close="close" />
</template>
