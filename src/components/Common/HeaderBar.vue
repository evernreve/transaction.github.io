<template>
  <div class="header-bar">
    <div class="header-left">
      <div class="logo">
        <h3>{{ title }}</h3>
      </div>
    </div>
    <div class="header-right">
      <div class="user-info">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :size="32" :src="avatar" class="user-avatar" />
            <span class="user-name">{{ userName }}</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleProfile">个人资料</el-dropdown-item>
              <el-dropdown-item @click="handleChangePassword">修改密码</el-dropdown-item>
              <el-dropdown-item @click="handleLogout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// Props
defineProps({
  title: {
    type: String,
    default: '交易后台系统'
  }
})

// 用户信息
const userName = ref('管理员')
const avatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 路由器
const router = useRouter()

// 事件处理
const handleProfile = () => {
  console.log('查看个人资料')
}

const handleChangePassword = () => {
  console.log('修改密码')
}

const handleLogout = () => {
  // 这里可以添加实际的登出逻辑
  console.log('退出登录')
  router.push('/login')
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo h3 {
  margin: 0;
  color: #1890ff;
  font-size: 18px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 8px;
}

.user-name {
  margin-right: 6px;
}
</style>