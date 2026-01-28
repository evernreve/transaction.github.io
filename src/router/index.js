import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/Layout.vue'
import BusinessOrderList from '@/views/BusinessOrderList.vue'
import TransactionOrderList from '@/views/TransactionOrderList.vue'
import RefundOrderList from '@/views/RefundOrderList.vue' // 新增退款单管理页面

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/business-orders',
    children: [
      {
        path: '/business-orders',
        name: 'BusinessOrderList',
        component: BusinessOrderList,
        meta: { title: '业务单管理' }
      },
      {
        path: '/transaction-orders',
        name: 'TransactionOrderList',
        component: TransactionOrderList,
        meta: { title: '交易单管理' }
      },
      {
        path: '/refund-orders',
        name: 'RefundOrderList',
        component: RefundOrderList,
        meta: { title: '退款单管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),  // 改为 hash 模式
  routes
})

export default router