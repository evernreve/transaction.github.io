<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <SidebarMenu :logo-title="'交易后台系统'" />
    </el-aside>

    <!-- 主内容区域 -->
    <el-container>
      <el-header class="header">
        <HeaderBar :title="title" />
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderBar from '@/components/Common/HeaderBar.vue'
import SidebarMenu from '@/components/Common/SidebarMenu.vue'

const route = useRoute()

// 根据当前路由动态显示标题
const title = computed(() => {
  return route.meta.title || '首页'
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.header {
  padding: 0;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>