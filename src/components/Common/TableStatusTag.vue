<template>
  <el-tag :type="tagType">
    {{ statusText }}
  </el-tag>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  statusMap: {
    type: Object,
    default: () => ({})
  },
  typeMap: {
    type: Object,
    default: () => ({})
  }
})

// 根据状态值获取显示文本
const statusText = computed(() => {
  return props.statusMap[props.status] || props.status
})

// 根据状态值获取标签类型
const tagType = computed(() => {
  return props.typeMap[props.status] || 'info'
})
</script>

<style scoped>
/* 这里可以添加自定义样式 */
</style>