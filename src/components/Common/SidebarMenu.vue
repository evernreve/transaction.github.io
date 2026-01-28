<template>
  <div class="sidebar-menu-wrapper">
    <div class="logo">
      <h3>{{ logoTitle }}</h3>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :router="true"
      :unique-opened="true"
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><menu /></el-icon>
          <span>基础信息管理</span>
        </template>
        <el-menu-item index="/business-orders">
          <el-icon><document /></el-icon>
          <template #title>业务单管理</template>
        </el-menu-item>
        <el-menu-item index="/transaction-orders">
          <el-icon><wallet /></el-icon>
          <template #title>交易单管理</template>
        </el-menu-item>
        <el-menu-item index="/refund-orders">
          <el-icon><money /></el-icon>
          <template #title>退款单管理</template>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Menu, Document, Wallet, Money } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  logoTitle: {
    type: String,
    default: '交易后台系统'
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

const activeMenu = computed(() => {
  const path = route.path
  return path
})
</script>

<style scoped>
.sidebar-menu-wrapper {
  height: 100%;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #4a5568;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.sidebar-menu {
  border: none;
  height: calc(100vh - 60px);
}
</style>