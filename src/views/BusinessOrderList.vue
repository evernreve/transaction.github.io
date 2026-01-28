<template>
  <div class="business-order-list">
    <!-- 顶部导航和筛选区域 -->
    <el-card class="filter-card">
      <div class="filter-header">
        <el-breadcrumb separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>业务单管理</el-breadcrumb-item>
        </el-breadcrumb>
        
        <div class="time-filter">
          <el-radio-group v-model="timeRange" size="default">
            <el-radio-button label="今天" value="today" />
            <el-radio-button label="本周" value="week" />
            <el-radio-button label="本月" value="month" />
            <el-radio-button label="自定义" value="custom" />
          </el-radio-group>
          
          <el-date-picker
            v-if="timeRange === 'custom'"
            v-model="customTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="default"
          />
        </div>
      </div>
      
      <el-form :model="searchForm" inline class="search-form">

        <el-form-item label="商户订单号">
          <el-input 
            v-model="searchForm.merchantOrderNumber" 
            placeholder="请输入商户订单号" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="产品名称">
          <el-select v-model="searchForm.businessLine" placeholder="请选择产品名称" clearable style="width: 150px;">
            <el-option label="B2B收款" value="b2b_collection" />
            <el-option label="VCC收款" value="vcc_collection" />
            <el-option label="数币充值" value="crypto_recharge" />
            <el-option label="法币兑换" value="fiat_exchange" />
            <el-option label="B2B付款" value="b2b_payment" />
            <el-option label="数币提现" value="crypto_withdrawal" />
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="searchForm.transactionType" placeholder="请选择交易类型" clearable style="width: 150px;">
            <el-option label="VCC开户" value="vcc_opening" />
            <el-option label="VCC收款" value="vcc_collection" />
            <el-option label="数币提现" value="crypto_withdrawal" />
            <el-option label="法币兑换" value="fiat_exchange" />
            <el-option label="支付" value="payment" />
            <el-option label="退款" value="refund" />
            <el-option label="转账" value="transfer" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="searchForm.paymentMethod" placeholder="请选择支付方式" clearable style="width: 120px;">
            <el-option label="渠道支付" value="渠道支付" />
            <el-option label="余额记账" value="余额记账" />
            <el-option label="SWIFT" value="swift" />
            <el-option label="SEPA" value="sepa" />
            <el-option label="ACH" value="ach" />
            <el-option label="PayPal" value="paypal" />
            <el-option label="Stripe" value="stripe" />
            <el-option label="支付宝" value="alipay" />
            <el-option label="微信" value="wechat" />
            <el-option label="银行转账" value="bank_transfer" />
          </el-select>
        </el-form-item>
        <el-form-item label="平台租户ID">
          <el-input v-model="searchForm.tenantId" placeholder="请输入平台租户ID" clearable style="width: 120px;" />
        </el-form-item>
        <el-form-item label="代理商ID">
          <el-input v-model="searchForm.agentId" placeholder="请输入代理商ID" clearable style="width: 120px;" />
        </el-form-item>
        <el-form-item label="商户ID">
          <el-input v-model="searchForm.merchantId" placeholder="请输入商户ID" clearable style="width: 150px;" />
        </el-form-item>
        <el-form-item label="商户用户ID">
          <el-input v-model="searchForm.userId" placeholder="请输入商户用户ID" clearable style="width: 120px;" />
        </el-form-item>
        <el-form-item label="交易子类型">
          <el-input v-model="searchForm.transactionSubType" placeholder="请输入交易子类型" clearable style="width: 150px;" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.orderStatus" placeholder="请选择订单状态" clearable style="width: 120px;">
            <el-option label="待处理" value="pending" />
            <el-option label="已处理" value="processed" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="未知" value="unknown" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.reviewStatus" placeholder="请选择审核状态" clearable style="width: 120px;">
            <el-option label="待合规一审" value="compliance_first_review" />
            <el-option label="本金确认" value="principal_confirmation" />
            <el-option label="手续费确认" value="fee_confirmation" />
            <el-option label="审核通过" value="approved" />
            <el-option label="待合规二审" value="compliance_second_review" />
          </el-select>
        </el-form-item>
        <el-form-item label="最终执行渠道">
          <el-input v-model="searchForm.executedChannel" placeholder="请输入执行渠道" clearable style="width: 150px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-container">
      <div class="table-header">
        <div class="table-title">业务单列表</div>
        <div class="table-actions">
          <el-button size="small" @click="refreshData">刷新</el-button>
        </div>
      </div>
      
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        @sort-change="handleSortChange"
      >

        <el-table-column prop="merchantOrderNumber" label="商户订单号" width="200" />
        <el-table-column prop="businessLine" label="产品名称" width="150">
          <template #default="{ row }">
            <el-tag :type="getBusinessLineType(row.businessLine)">
              {{ getBusinessLineText(row.businessLine) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="transactionType" label="交易类型" width="150">
          <template #default="{ row }">
            <el-tag :type="getTransactionTypeType(row.transactionType)">
              {{ getTransactionTypeText(row.transactionType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="120">
          <template #default="{ row }">
            <el-tag :type="getPaymentMethodType(row.paymentMethod)">
              {{ getPaymentMethodText(row.paymentMethod) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tenantId" label="平台租户ID" width="120" />
        <el-table-column prop="agentId" label="代理商ID" width="120" />
        <el-table-column prop="merchantId" label="商户ID" width="150" />
        <el-table-column prop="userId" label="商户用户ID" width="120" />
        <el-table-column prop="payerAccount" label="付款人账号" width="200" show-overflow-tooltip />
        <el-table-column prop="payeeAccount" label="收款人账号" width="200" show-overflow-tooltip />
        <el-table-column prop="transactionSubType" label="交易子类型" width="150" show-overflow-tooltip />
        <el-table-column prop="purpose" label="交易用途" width="150" show-overflow-tooltip />
        <el-table-column prop="originalAmount" label="金额（原币）" width="120">
          <template #default="{ row }">
            ¥{{ row.originalAmount?.toFixed(2) || row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="actualPaidAmount" label="实付金额" width="120">
          <template #default="{ row }">
            ¥{{ row.actualPaidAmount?.toFixed(2) || row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="feeDetails" label="手续费明细" width="150" show-overflow-tooltip />
        <el-table-column prop="feeDeductionMethod" label="手续费扣除方式" width="120" />
        <el-table-column prop="exchangeRate" label="汇率" width="100" />
        <el-table-column prop="orderStatus" label="订单状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusType(row.orderStatus)">
              {{ getOrderStatusText(row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reviewStatus" label="审核状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getReviewStatusType(row.reviewStatus)">
              {{ getReviewStatusText(row.reviewStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
        <el-table-column prop="executedChannel" label="最终执行渠道" width="150" />
        <el-table-column prop="hasRefund" label="是否关联退款" width="120">
          <template #default="{ row }">
            <el-tag :type="row.hasRefund ? 'danger' : 'success'">
              {{ row.hasRefund ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="refundOrderNumber" label="关联退款单号" width="200" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ row }">
            <div class="operation-cell">
              <el-button size="small" @click="handleViewDetail(row)">查看详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailDrawerVisible"
      :title="`业务单详情 - ${currentRow?.orderNumber || ''}`"
      size="1200px"
      destroy-on-close
    >
      <div v-if="currentRow" class="detail-content">
        <el-tabs v-model="activeTab" type="border-card">
          <!-- Tab 1: 基础信息 -->
          <el-tab-pane label="基础信息" name="basic">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="平台订单号">{{ currentRow.platformOrderNumber }}</el-descriptions-item>
              <el-descriptions-item label="商户订单号">{{ currentRow.merchantOrderNumber }}</el-descriptions-item>
              <el-descriptions-item label="平台租户ID">{{ currentRow.tenantId }}</el-descriptions-item>
              <el-descriptions-item label="平台租户名称">{{ currentRow.tenant }}</el-descriptions-item>
              <el-descriptions-item label="代理商ID">{{ currentRow.agentId }}</el-descriptions-item>
              <el-descriptions-item label="代理商名称">{{ currentRow.agent }}</el-descriptions-item>
              <el-descriptions-item label="商户ID">{{ currentRow.merchantId }}</el-descriptions-item>
              <el-descriptions-item label="商户名称">{{ currentRow.merchant }}</el-descriptions-item>
              <el-descriptions-item label="商户用户ID">{{ currentRow.userId }}</el-descriptions-item>
              <el-descriptions-item label="产品名称">
                <el-tag :type="getBusinessLineType(currentRow.businessLine)">
                  {{ getBusinessLineText(currentRow.businessLine) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="交易类型">
                <el-tag :type="getTransactionTypeType(currentRow.transactionType)">
                  {{ getTransactionTypeText(currentRow.transactionType) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="交易子类型">{{ currentRow.transactionSubType }}</el-descriptions-item>
              <el-descriptions-item label="支付方式">
                <el-tag :type="getPaymentMethodType(currentRow.paymentMethod)">
                  {{ getPaymentMethodText(currentRow.paymentMethod) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="付款人账号">{{ currentRow.payerAccount }}</el-descriptions-item>
              <el-descriptions-item label="收款人账号">{{ currentRow.payeeAccount }}</el-descriptions-item>
              <el-descriptions-item label="交易附言/用途">{{ currentRow.purpose }}</el-descriptions-item>
              <el-descriptions-item label="金额（原币）">{{ `¥${currentRow.originalAmount?.toFixed(2) || currentRow.amount.toFixed(2)}` }}</el-descriptions-item>
              <el-descriptions-item label="实付金额">{{ `¥${currentRow.actualPaidAmount?.toFixed(2) || currentRow.amount.toFixed(2)}` }}</el-descriptions-item>
              <el-descriptions-item label="手续费明细">{{ currentRow.feeDetails }}</el-descriptions-item>
              <el-descriptions-item label="手续费扣除方式">{{ currentRow.feeDeductionMethod || '-' }}</el-descriptions-item>
              <el-descriptions-item label="汇率">{{ currentRow.exchangeRate || '1.0000' }}</el-descriptions-item>
              <el-descriptions-item label="订单状态">
                <el-tag :type="getOrderStatusType(currentRow.orderStatus)">
                  {{ getOrderStatusText(currentRow.orderStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item v-if="currentRow.transactionType === 'vcc_opening'" label="开户状态">
                <el-tag :type="getOrderStatusType(currentRow.accountOpeningStatus)">
                  {{ getOrderStatusText(currentRow.accountOpeningStatus || currentRow.orderStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item v-if="currentRow.transactionType === 'vcc_opening'" label="账户充值状态">
                <el-tag :type="getOrderStatusType(currentRow.accountFundingStatus)">
                  {{ getOrderStatusText(currentRow.accountFundingStatus || currentRow.orderStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="审核状态">
                <el-tag :type="getReviewStatusType(currentRow.reviewStatus)">
                  {{ getReviewStatusText(currentRow.reviewStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ currentRow.createTime }}</el-descriptions-item>
              <el-descriptions-item label="最终执行渠道">{{ currentRow.executedChannel }}</el-descriptions-item>
              <el-descriptions-item label="是否关联退款">
                <el-tag :type="currentRow.hasRefund ? 'danger' : 'success'">
                  {{ currentRow.hasRefund ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="关联退款单号">{{ currentRow.refundOrderNumber || '-' }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{ currentRow.remark }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <!-- Tab 2: 详情信息 -->
          <el-tab-pane label="详情信息" name="details">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="渠道成本快照">
                成本: ¥{{ currentRow.channelCostSnapshot?.cost || '0.00' }}，报价时间: {{ currentRow.channelCostSnapshot?.quoteTime || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="订单子状态/响应码">{{ currentRow.orderSubStatus || '已完成' }}</el-descriptions-item>
              <el-descriptions-item label="审核操作人与时间">
                审核员: {{ currentRow.reviewOperator || '-' }}，时间: {{ currentRow.reviewTime || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="完整状态时间轴">
                <el-timeline style="margin-top: 10px;">
                  <el-timeline-item 
                    v-for="(item, index) in getStatusTimelineItems(currentRow.statusTimeline, currentRow.createTime)" 
                    :key="index" 
                    :timestamp="item.timestamp" 
                    :type="item.type"
                    placement="top"
                  >
                    {{ item.content }}
                  </el-timeline-item>
                </el-timeline>
              </el-descriptions-item>
              <el-descriptions-item label="关联交易单号">
                <el-table
                  :data="getRelatedTransactionDataWithChannel(currentRow.relatedTransactionNumbers, currentRow.relatedTransactionStatuses, currentRow.relatedChannelNumber) || []"
                  style="width: 100%; margin-top: 10px;"
                  size="small"
                  :show-header="true"
                >
                  <el-table-column prop="transactionNumber" label="交易单号" width="200">
                    <template #default="{ row }">
                      <el-link type="primary" :underline="false">{{ row.transactionNumber }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="交易流水状态" width="250">
                    <template #default="{ row }">
                      <el-tag :type="getTransactionStatusType(row.status)">{{ row.status }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="channelNumber" label="关联渠道单号" width="200">
                    <template #default="{ row }">
                      {{ row.channelNumber || '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template #default="{ row }">
                      <el-button 
                        size="small" 
                        type="primary" 
                        @click="viewTransactionDetail(row.transactionNumber)"
                      >
                        查看交易单详情
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>

              <el-descriptions-item label="风控评分/标签">
                风险分: {{ currentRow.riskScore || '0' }}，标签: {{ currentRow.riskLabel || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="风控审核备注">{{ currentRow.riskRemark || '-' }}</el-descriptions-item>
              <el-descriptions-item label="合规流水号/备案号">{{ currentRow.complianceNumber || '-' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { businessOrderAPI } from '@/utils/mockData.js'

// 当前激活的标签页
const activeTab = ref('basic')

// 获取状态时间轴项目
const getStatusTimelineItems = (timeline, createTime) => {
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    return [];
  }
  
  // 定义状态类型映射
  const statusTypes = {
    '创建': 'info',
    '风控中': 'primary',
    '审核中': 'warning',
    '执行中': 'primary',
    '失败': 'danger',
    '完成': 'success'
  };
  
  // 计算每个步骤的时间
  const baseTime = new Date(createTime);
  
  return timeline.map((step, index) => {
    // 为每个步骤增加一定时间间隔
    const stepTime = new Date(baseTime.getTime() + index * 30 * 60000); // 每步增加30分钟
    
    return {
      content: step,
      timestamp: stepTime.toISOString().slice(0, 19).replace('T', ' '),
      type: statusTypes[step] || 'info'
    };
  });
}

// 获取关联交易单数据
const getRelatedTransactionData = (numbers, statuses) => {
  if (!numbers || !statuses) return [];
  
  // 将交易单号和状态配对
  return numbers.map((number, index) => {
    const status = Array.isArray(statuses) ? statuses[index] : statuses;
    return {
      transactionNumber: number,
      status: status || '未知状态'
    };
  });
}

// 获取关联交易单和渠道单数据
const getRelatedTransactionDataWithChannel = (numbers, statuses, channelNumber) => {
  if (!numbers || !statuses) return [];
  
  // 将交易单号、状态和渠道单号配对
  return numbers.map((number, index) => {
    const status = Array.isArray(statuses) ? statuses[index] : statuses;
    // 只有第一笔交易单才有渠道单号，或者根据某种规则分配
    const channelNum = index === 0 ? channelNumber : null; // 根据您的说明，每笔交易单可能有自己的渠道单，这里做简单处理
    return {
      transactionNumber: number,
      status: status || '未知状态',
      channelNumber: channelNum
    };
  });
}

// 获取交易状态类型
const getTransactionStatusType = (status) => {
  if (status.includes('失败')) return 'danger';
  if (status.includes('完成')) return 'success';
  if (status.includes('处理')) return 'warning';
  if (status.includes('待')) return 'info';
  return 'info';
}

// 时间范围筛选
const timeRange = ref('') // 初始状态为空，表示不限制时间范围
const customTimeRange = ref([])

// 搜索表单
const searchForm = reactive({
  keyword: '',
  orderNumber: '',
  status: '',
  tenant: '',
  agent: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 详情抽屉
const detailDrawerVisible = ref(false)
const currentRow = ref(null)

// 排序参数
const sortParams = ref({})

// 当前跟踪日志
const currentTrackingLogs = ref([])

// 当前执行记录
const currentExecutionRecords = ref([])

// 路由数据
const currentRouteData = ref(null)

// 业务线文本映射
const getBusinessLineText = (line) => {
  const map = {
    'b2b_collection': 'B2B收款',
    'vcc_collection': 'VCC收款',
    'crypto_recharge': '数币充值',
    'fiat_exchange': '法币兑换',
    'b2b_payment': 'B2B付款',
    'crypto_withdrawal': '数币提现'
  }
  return map[line] || line
}

// 业务线标签类型映射
const getBusinessLineType = (line) => {
  const map = {
    'b2b_collection': 'primary',
    'vcc_collection': 'success',
    'crypto_recharge': 'warning',
    'fiat_exchange': 'info',
    'b2b_payment': 'danger',
    'crypto_withdrawal': 'warning'
  }
  return map[line] || 'info'
}

// 交易类型文本映射
const getTransactionTypeText = (type) => {
  const map = {
    'vcc_opening': 'VCC开户',
    'vcc_collection': 'VCC收款',
    'crypto_withdrawal': '数币提现',
    'fiat_exchange': '法币兑换',
    'payment': '支付',
    'refund': '退款',
    'transfer': '转账'
  }
  return map[type] || type
}

// 交易类型标签类型映射
const getTransactionTypeType = (type) => {
  const map = {
    'vcc_opening': 'primary',
    'vcc_collection': 'success',
    'crypto_withdrawal': 'warning',
    'fiat_exchange': 'info',
    'payment': 'primary',
    'refund': 'danger',
    'transfer': 'warning'
  }
  return map[type] || 'info'
}

// 支付方式文本映射
const getPaymentMethodText = (method) => {
  const map = {
    'swift': 'SWIFT',
    'sepa': 'SEPA',
    'ach': 'ACH',
    'paypal': 'PayPal',
    'stripe': 'Stripe',
    'alipay': '支付宝',
    'wechat': '微信',
    'bank_transfer': '银行转账',
    '渠道支付': '渠道支付',
    '余额记账': '余额记账'
  }
  return map[method] || method
}

// 支付方式标签类型映射
const getPaymentMethodType = (method) => {
  const map = {
    'swift': 'primary',
    'sepa': 'success',
    'ach': 'warning',
    'paypal': 'info',
    'stripe': 'danger',
    'alipay': 'primary',
    'wechat': 'success',
    'bank_transfer': 'info',
    '渠道支付': 'primary',
    '余额记账': 'warning'
  }
  return map[method] || 'info'
}

// 订单状态文本映射
const getOrderStatusText = (status) => {
  const map = {
    pending: '待处理',
    processed: '已处理',
    completed: '已完成',
    cancelled: '已取消',
    unknown: '未知',
    failed: '失败'
  }
  return map[status] || status
}

// 订单状态标签类型映射
const getOrderStatusType = (status) => {
  const map = {
    pending: 'info',
    processed: 'info',
    completed: 'success',
    cancelled: 'danger',
    unknown: 'warning',
    failed: 'danger'
  }
  return map[status] || 'info'
}

// 审核状态文本映射
const getReviewStatusText = (status) => {
  const map = {
    compliance_first_review: '待合规一审',
    principal_confirmation: '本金确认',
    fee_confirmation: '手续费确认',
    approved: '审核通过',
    compliance_second_review: '待合规二审'
  }
  return map[status] || status
}

// 审核状态标签类型映射
const getReviewStatusType = (status) => {
  const map = {
    compliance_first_review: 'info',
    principal_confirmation: 'primary',
    fee_confirmation: 'warning',
    approved: 'success',
    compliance_second_review: 'info'
  }
  return map[status] || 'info'
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      merchantOrderNumber: searchForm.merchantOrderNumber || undefined,
      businessLine: searchForm.businessLine || undefined,
      transactionType: searchForm.transactionType || undefined,
      paymentMethod: searchForm.paymentMethod || undefined,
      tenantId: searchForm.tenantId || undefined,
      agentId: searchForm.agentId || undefined,
      merchantId: searchForm.merchantId || undefined,
      userId: searchForm.userId || undefined,
      transactionSubType: searchForm.transactionSubType || undefined,
      orderStatus: searchForm.orderStatus || undefined,
      reviewStatus: searchForm.reviewStatus || undefined,
      executedChannel: searchForm.executedChannel || undefined,
      keyword: searchForm.keyword || undefined,
      timeRange: timeRange.value || undefined,
      customTimeRange: timeRange.value === 'custom' ? customTimeRange.value : undefined,
      sortBy: sortParams.value.prop,
      sortOrder: sortParams.value.order
    }
    
    const result = await businessOrderAPI.getList(params)
    tableData.value = result.data
    total.value = result.total
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.merchantOrderNumber = ''
  searchForm.businessLine = ''
  searchForm.transactionType = ''
  searchForm.paymentMethod = ''
  searchForm.tenantId = ''
  searchForm.agentId = ''
  searchForm.merchantId = ''
  searchForm.userId = ''
  searchForm.transactionSubType = ''
  searchForm.orderStatus = ''
  searchForm.reviewStatus = ''
  searchForm.executedChannel = ''
  timeRange.value = '' // 重置时间范围
  customTimeRange.value = []
  currentPage.value = 1
  fetchData()
}

// 查看详情
const handleViewDetail = (row) => {
  currentRow.value = { ...row }
  
  // 模拟路由数据
  currentRouteData.value = {
    orderId: row.orderNumber,
    routeSteps: [
      {
        stepName: '业务单创建',
        description: '接收业务单请求',
        timestamp: row.createTime,
        status: 'info',
        type: 'primary'
      },
      {
        stepName: '路由输入',
        description: `业务类型: ${row.type}, 商户: ${row.merchant}`,
        timestamp: new Date(new Date(row.createTime).getTime() + 1000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'info',
        type: 'primary'
      },
      {
        stepName: '渠道A匹配',
        description: `${row.channel}: 匹配成功`,
        timestamp: new Date(new Date(row.createTime).getTime() + 2000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'info',
        type: 'primary'
      },
      {
        stepName: '费用计算',
        description: `费用: ${row.feeDescription}`,
        timestamp: new Date(new Date(row.createTime).getTime() + 3000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'info',
        type: 'primary'
      },
      {
        stepName: '路由决策完成',
        description: '路由策略已确定',
        timestamp: new Date(new Date(row.createTime).getTime() + 4000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'success',
        type: 'success'
      }
    ],
    channelComparison: [
      { 
        channelName: row.channel, 
        cost: '¥0.50', 
        rate: '99.9%', 
        time: '2秒', 
        selected: true,
        reason: '匹配业务类型'
      },
      { 
        channelName: '备用渠道', 
        cost: '¥0.60', 
        rate: '99.8%', 
        time: '3秒', 
        selected: false,
        reason: '非首选渠道'
      }
    ],
    feeEstimates: [
      { feeName: '渠道手续费', amount: '¥0.50', description: '渠道处理费用' },
      { feeName: '平台服务费', amount: '¥0.10', description: '平台技术服务费' }
    ],
    netAmount: (parseFloat(row.feeDescription.replace(/[^\d.-]/g, '')) + 0.10).toFixed(2) || '0.60'
  }
  
  // 模拟跟踪日志
  currentTrackingLogs.value = [
    {
      nodeName: '业务单创建',
      status: 'success',
      statusText: '成功',
      timestamp: row.createTime,
      details: '业务单请求已接收',
      remark: '订单创建成功'
    },
    {
      nodeName: '路由完成',
      status: 'success',
      statusText: '成功',
      timestamp: new Date(new Date(row.createTime).getTime() + 5000).toISOString().slice(0, 19).replace('T', ' '),
      details: `路由决策完成，选择${row.channel}渠道`,
      remark: '渠道选择成功'
    },
    {
      nodeName: '提交渠道处理',
      status: 'processing',
      statusText: '进行中',
      timestamp: new Date(new Date(row.createTime).getTime() + 8000).toISOString().slice(0, 19).replace('T', ' '),
      details: `已向${row.channel}渠道提交处理请求`,
      remark: '等待渠道响应'
    },
    {
      nodeName: '处理完成',
      status: row.status === 'completed' ? 'success' : 'failed',
      statusText: row.status === 'completed' ? '成功' : '失败',
      timestamp: row.updateTime || new Date().toISOString().slice(0, 19).replace('T', ' '),
      details: row.status === 'completed' ? `${row.channel}返回处理成功` : '处理失败，原因未知',
      remark: row.status === 'completed' ? '业务单完成' : '业务单失败'
    }
  ]
  
  // 模拟执行记录
  currentExecutionRecords.value = [
    {
      id: 1,
      channelName: row.channel,
      channelTraceNo: `CHNL${row.orderNumber.substring(5)}`,
      channelStatus: row.status === 'completed' ? 'success' : 'failed',
      actualFee: '¥0.50',
      executeTime: row.updateTime || new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
  ]
  
  detailDrawerVisible.value = true
  activeTab.value = 'basic' // 默认显示基础信息标签页
}

// 分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

// 当前页变化
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchData()
}

// 排序处理
const handleSortChange = ({ column, prop, order }) => {
  if (prop && order) {
    sortParams.value = {
      prop,
      order: order === 'ascending' ? 'asc' : 'desc'
    }
  } else {
    sortParams.value = {}
  }
  fetchData()
}

// 刷新数据
const refreshData = () => {
  fetchData()
}

// 导出功能
const handleExport = () => {
  ElMessage.info('正在导出数据...')
  // 这里可以实现实际的导出逻辑
}

// 查看交易单详情
const viewTransactionDetail = (transactionNumber) => {
  // 在新窗口打开交易单列表页，并传递查询参数
  const url = `/transaction-orders?orderNumber=${encodeURIComponent(transactionNumber)}`;
  window.open(url, '_blank');
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.operation-cell {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.business-order-list {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-form {
  margin: 0;
}

.table-container {
  min-height: 500px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.table-title {
  font-size: 16px;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.detail-content {
  padding: 20px 0;
  height: 100%;
}
</style>