<template>
  
  
  <div class="refund-order-list">
    <!-- 顶部搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="退款单号">
          <el-input 
            v-model="searchForm.refundNumber" 
            placeholder="请输入退款单号" 
            clearable 
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item label="关联业务单号">
          <el-input 
            v-model="searchForm.relatedOrderNumber" 
            placeholder="请输入关联业务单号" 
            clearable 
            style="width: 180px;"
          />
        </el-form-item>
        <el-form-item label="平台租户ID">
          <el-input 
            v-model="searchForm.tenantId" 
            placeholder="请输入平台租户ID" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="平台租户名称">
          <el-input 
            v-model="searchForm.tenant" 
            placeholder="请输入平台租户名称" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="代理商ID">
          <el-input 
            v-model="searchForm.agentId" 
            placeholder="请输入代理商ID" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="代理商名称">
          <el-input 
            v-model="searchForm.agent" 
            placeholder="请输入代理商名称" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="商户ID">
          <el-input 
            v-model="searchForm.merchantId" 
            placeholder="请输入商户ID" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="商户名称">
          <el-input 
            v-model="searchForm.merchant" 
            placeholder="请输入商户名称" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="商户用户ID">
          <el-input 
            v-model="searchForm.userId" 
            placeholder="请输入商户用户ID" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="付款人账号">
          <el-input 
            v-model="searchForm.payerAccount" 
            placeholder="请输入付款人账号" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="收款人账号">
          <el-input 
            v-model="searchForm.payeeAccount" 
            placeholder="请输入收款人账号" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="交易子类型">
          <el-input 
            v-model="searchForm.transactionSubType" 
            placeholder="请输入交易子类型" 
            clearable 
            style="width: 150px;"
          />
        </el-form-item>
        
        <el-form-item label="退款路径">
          <el-select v-model="searchForm.refundPath" placeholder="请选择退款路径" clearable style="width: 120px;">
            <el-option label="原路退回" value="原路退回" />
            <el-option label="退转付" value="退转付" />
            <el-option label="记账" value="记账" />
          </el-select>
        </el-form-item>
        <el-form-item label="手续费承担方">
          <el-select v-model="searchForm.feeBearer" placeholder="请选择手续费承担方" clearable style="width: 120px;">
            <el-option label="商户承担" value="商户承担" />
            <el-option label="平台承担" value="平台承担" />
            <el-option label="用户承担" value="用户承担" />
          </el-select>
        </el-form-item>
        <el-form-item label="退款状态">
          <el-select v-model="searchForm.status" placeholder="请选择退款状态" clearable style="width: 120px;">
            <el-option label="待退款" value="awaiting_refund" />
            <el-option label="待审核" value="awaiting_review" />
            <el-option label="退款中" value="refunding" />
            <el-option label="退款成功" value="refund_success" />
            <el-option label="退款失败" value="refund_failed" />
            <el-option label="退款退回" value="refund_returned" />
            <el-option label="退款退回审核" value="refund_return_review" />
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
        <el-form-item label="退款方式">
          <el-select v-model="searchForm.method" placeholder="请选择退款方式" clearable style="width: 120px;">
            <el-option label="原路退回" value="original" />
            <el-option label="银行转账" value="bank" />
            <el-option label="记账" value="accounting" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行渠道">
          <el-select v-model="searchForm.channel" placeholder="请选择执行渠道" clearable style="width: 120px;">
            <el-option label="支付宝" value="alipay" />
            <el-option label="微信支付" value="wechat" />
            <el-option label="银联" value="unionpay" />
            <el-option label="银行转账" value="bank" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格列表 -->
    <el-card class="table-card">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="refundNumber" label="退款单号" width="200" />
        <el-table-column prop="relatedOrderNumber" label="关联业务单号" width="200">
          <template #default="{ row }">
            <el-button 
              type="text" 
              @click="goToRelatedOrder(row.relatedOrderNumber)"
              style="color: #409EFF;"
            >
              {{ row.relatedOrderNumber }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="tenantId" label="平台租户ID" width="120" />
        <el-table-column prop="tenant" label="平台租户名称" width="120" />
        <el-table-column prop="agentId" label="代理商ID" width="120" />
        <el-table-column prop="agent" label="代理商名称" width="120" />
        <el-table-column prop="merchantId" label="商户ID" width="120" />
        <el-table-column prop="merchant" label="商户名称" width="120" />
        <el-table-column prop="userId" label="商户用户ID" width="120" />
        <el-table-column prop="payerAccount" label="付款人账号" width="200" show-overflow-tooltip />
        <el-table-column prop="payeeAccount" label="收款人账号" width="200" show-overflow-tooltip />
        <el-table-column prop="transactionSubType" label="交易子类型" width="150" show-overflow-tooltip />
        <el-table-column prop="purpose" label="交易附言/用途" width="150" show-overflow-tooltip />
        <el-table-column prop="reason" label="退款原因" width="150" show-overflow-tooltip />
        <el-table-column prop="refundDescription" label="退款说明" width="200" show-overflow-tooltip />
        <el-table-column prop="refundPath" label="退款路径" width="120">
          <template #default="{ row }">
            <el-tag :type="getRefundPathType(row.refundPath)">
              {{ row.refundPath }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="feeBearer" label="手续费承担方" width="120">
          <template #default="{ row }">
            <el-tag :type="getFeeBearerType(row.feeBearer)">
              {{ row.feeBearer }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="退款金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="method" label="退款方式" width="120">
          <template #default="{ row }">
            <el-tag :type="getMethodType(row.method)">
              {{ getMethodText(row.method) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="退款状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
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
        <el-table-column prop="expectedArrivalTime" label="预计到账时间" width="180" />
        <el-table-column prop="actualArrivalTime" label="实际到账时间" width="180" />
        <el-table-column prop="channel" label="执行渠道" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="最后更新时间" width="180" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ row }">
            <div class="operation-cell">
              <el-button size="small" @click="handleViewDetail(row)">查看详情</el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form
        :model="formModel"
        :rules="formRules"
        ref="formRef"
        label-width="120px"
      >
        <el-form-item label="退款单号" prop="refundNumber">
          <el-input
            v-model="formModel.refundNumber"
            :disabled="!!formModel.id"
            placeholder="请输入退款单号"
          />
        </el-form-item>
        <el-form-item label="关联业务单号" prop="relatedOrderNumber">
          <el-input v-model="formModel.relatedOrderNumber" placeholder="请输入关联业务单号" />
        </el-form-item>
        <el-form-item label="退款原因" prop="reason">
          <el-input v-model="formModel.reason" type="textarea" :rows="3" placeholder="请输入退款原因" />
        </el-form-item>
        <el-form-item label="退款金额" prop="amount">
          <el-input-number
            v-model="formModel.amount"
            :min="0"
            :precision="2"
            :step="1"
            placeholder="请输入退款金额"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="退款方式" prop="method">
          <el-select v-model="formModel.method" placeholder="请选择退款方式" style="width: 100%;">
            <el-option label="原路退回" value="original" />
            <el-option label="银行转账" value="bank" />
            <el-option label="记账" value="accounting" />
          </el-select>
        </el-form-item>
        <el-form-item label="退款状态" prop="status">
          <el-select v-model="formModel.status" placeholder="请选择退款状态" style="width: 100%;">
            <el-option label="待退款" value="awaiting_refund" />
            <el-option label="待审核" value="awaiting_review" />
            <el-option label="退款中" value="refunding" />
            <el-option label="退款成功" value="refund_success" />
            <el-option label="退款失败" value="refund_failed" />
            <el-option label="退款退回" value="refund_returned" />
            <el-option label="退款退回审核" value="refund_return_review" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="reviewStatus">
          <el-select v-model="formModel.reviewStatus" placeholder="请选择审核状态" style="width: 100%;">
            <el-option label="待合规一审" value="compliance_first_review" />
            <el-option label="本金确认" value="principal_confirmation" />
            <el-option label="手续费确认" value="fee_confirmation" />
            <el-option label="审核通过" value="approved" />
            <el-option label="待合规二审" value="compliance_second_review" />
          </el-select>
        </el-form-item>
        <el-form-item label="预计到账时间" prop="expectedArrivalTime">
          <el-date-picker
            v-model="formModel.expectedArrivalTime"
            type="datetime"
            placeholder="选择预计到账时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="实际到账时间" prop="actualArrivalTime">
          <el-date-picker
            v-model="formModel.actualArrivalTime"
            type="datetime"
            placeholder="选择实际到账时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="执行渠道" prop="channel">
          <el-select v-model="formModel.channel" placeholder="请选择执行渠道" style="width: 100%;">
            <el-option label="支付宝" value="alipay" />
            <el-option label="微信支付" value="wechat" />
            <el-option label="银联" value="unionpay" />
            <el-option label="银行转账" value="bank" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailDrawerVisible"
      :title="`退款单详情 - ${currentRow?.refundNumber || ''}`"
      size="1200px"
    >
      <div v-if="currentRow" class="detail-content">
        <el-tabs v-model="activeTab" type="border-card">
          <!-- Tab 1: 基础信息 -->
          <el-tab-pane label="基础信息" name="basic">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="退款单号">{{ currentRow.refundNumber }}</el-descriptions-item>
              <el-descriptions-item label="关联业务单号">
                <el-button 
                  type="text" 
                  @click="goToRelatedOrder(currentRow.relatedOrderNumber)"
                  style="color: #409EFF;"
                >
                  {{ currentRow.relatedOrderNumber }}
                </el-button>
              </el-descriptions-item>
              <el-descriptions-item label="平台租户ID">{{ currentRow.tenantId }}</el-descriptions-item>
              <el-descriptions-item label="平台租户名称">{{ currentRow.tenant }}</el-descriptions-item>
              <el-descriptions-item label="代理商ID">{{ currentRow.agentId }}</el-descriptions-item>
              <el-descriptions-item label="代理商名称">{{ currentRow.agent }}</el-descriptions-item>
              <el-descriptions-item label="商户ID">{{ currentRow.merchantId }}</el-descriptions-item>
              <el-descriptions-item label="商户名称">{{ currentRow.merchant }}</el-descriptions-item>
              <el-descriptions-item label="商户用户ID">{{ currentRow.userId }}</el-descriptions-item>
              <el-descriptions-item label="交易子类型">{{ currentRow.transactionSubType }}</el-descriptions-item>
              <el-descriptions-item label="交易附言/用途">{{ currentRow.purpose }}</el-descriptions-item>
              <el-descriptions-item label="付款人账号">{{ currentRow.payerAccount }}</el-descriptions-item>
              <el-descriptions-item label="收款人账号">{{ currentRow.payeeAccount }}</el-descriptions-item>
              <el-descriptions-item label="退款原因">{{ currentRow.reason }}</el-descriptions-item>
              <el-descriptions-item label="退款说明">{{ currentRow.refundDescription }}</el-descriptions-item>
              <el-descriptions-item label="退款路径">
                <el-tag :type="getRefundPathType(currentRow.refundPath)">
                  {{ currentRow.refundPath }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="手续费承担方">
                <el-tag :type="getFeeBearerType(currentRow.feeBearer)">
                  {{ currentRow.feeBearer }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="退款金额">¥{{ currentRow.amount.toFixed(2) }}</el-descriptions-item>
              <el-descriptions-item label="退款方式">
                <el-tag :type="getMethodType(currentRow.method)">
                  {{ getMethodText(currentRow.method) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="退款状态">
                <el-tag :type="getStatusType(currentRow.status)">
                  {{ getStatusText(currentRow.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="审核状态">
                <el-tag :type="getReviewStatusType(currentRow.reviewStatus)">
                  {{ getReviewStatusText(currentRow.reviewStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="预计到账时间">{{ currentRow.expectedArrivalTime || '-' }}</el-descriptions-item>
              <el-descriptions-item label="实际到账时间">{{ currentRow.actualArrivalTime || '-' }}</el-descriptions-item>
              <el-descriptions-item label="执行渠道">{{ currentRow.channel }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ currentRow.createTime }}</el-descriptions-item>
              <el-descriptions-item label="最后更新时间">{{ currentRow.updateTime }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <!-- Tab 2: 详情信息 -->
          <el-tab-pane label="详情信息" name="details">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="退款路由策略快照">
                策略: {{ currentRow.refundRoutingStrategy?.strategy || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="关联交易单列表">
                <el-table
                  :data="getRelatedTransactionListData(currentRow.relatedTransactionList) || []"
                  style="width: 100%; margin-top: 10px;"
                  size="small"
                  :show-header="true"
                >
                  <el-table-column prop="transactionNumber" label="交易单号" width="200">
                    <template #default="{ row }">
                      <el-link type="primary" :underline="false">{{ row.transactionNumber }}</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
              <el-descriptions-item label="关联的退款渠道单列表">
                <el-table
                  :data="getRelatedChannelListData(currentRow.relatedRefundChannelList) || []"
                  style="width: 100%; margin-top: 10px;"
                  size="small"
                  :show-header="true"
                >
                  <el-table-column prop="channelNumber" label="渠道单号" width="200">
                    <template #default="{ row }">
                      <el-link type="primary" :underline="false">{{ row.channelNumber }}</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
              <el-descriptions-item label="当前生效交易单">{{ currentRow.currentActiveTransaction || '-' }}</el-descriptions-item>
              <el-descriptions-item label="状态时间轴">
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
              <el-descriptions-item label="审核操作人与时间">
                审核员: {{ currentRow.reviewOperator || '-' }}，时间: {{ currentRow.reviewTime || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="原始支付渠道单号">{{ currentRow.originalPaymentChannelNumber || '-' }}</el-descriptions-item>
              <el-descriptions-item label="原始支付交易信息">
                支付金额: ¥{{ currentRow.originalPaymentInfo?.amount || '0.00' }}，支付时间: {{ currentRow.originalPaymentInfo?.time || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="退款风控评分/结果">
                风险分: {{ currentRow.refundRiskScore || '0' }}，结果: {{ currentRow.refundRiskResult || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="审核备注">{{ currentRow.reviewRemark || '-' }}</el-descriptions-item>
              <el-descriptions-item label="合规流水号">{{ currentRow.complianceNumber || '-' }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { refundOrderAPI } from '@/utils/mockData.js'

// 搜索表单
const searchForm = reactive({
  refundNumber: '',
  relatedOrderNumber: '',
  tenantId: '',
  tenant: '',
  agentId: '',
  agent: '',
  merchantId: '',
  merchant: '',
  userId: '',
  payerAccount: '',
  payeeAccount: '',
  transactionSubType: '',
  purpose: '',
  reason: '',
  refundDescription: '',
  refundPath: '',
  feeBearer: '',
  status: '',
  reviewStatus: '',
  method: '',
  channel: ''
})

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const formModel = ref({
  id: null,
  refundNumber: '',
  relatedOrderNumber: '',
  reason: '',
  amount: 0,
  method: '',
  status: '',
  reviewStatus: '',
  expectedArrivalTime: '',
  actualArrivalTime: '',
  channel: '',
  createTime: '',
  updateTime: ''
})

// 当前激活的标签页
const activeTab = ref('basic')

// 详情抽屉
const detailDrawerVisible = ref(false)
const currentRow = ref(null)

// 表单验证规则
const formRules = {
  refundNumber: [
    { required: true, message: '请输入退款单号', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  relatedOrderNumber: [
    { required: true, message: '请输入关联业务单号', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请输入退款原因', trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '请输入退款金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '金额必须大于等于0', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请选择退款方式', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择退款状态', trigger: 'change' }
  ],
  reviewStatus: [
    { required: true, message: '请选择审核状态', trigger: 'change' }
  ],
  channel: [
    { required: true, message: '请选择执行渠道', trigger: 'change' }
  ]
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      refundNumber: searchForm.refundNumber || undefined,
      relatedOrderNumber: searchForm.relatedOrderNumber || undefined,
      tenantId: searchForm.tenantId || undefined,
      tenant: searchForm.tenant || undefined,
      agentId: searchForm.agentId || undefined,
      agent: searchForm.agent || undefined,
      merchantId: searchForm.merchantId || undefined,
      merchant: searchForm.merchant || undefined,
      userId: searchForm.userId || undefined,
      payerAccount: searchForm.payerAccount || undefined,
      payeeAccount: searchForm.payeeAccount || undefined,
      transactionSubType: searchForm.transactionSubType || undefined,
      purpose: searchForm.purpose || undefined,
      reason: searchForm.reason || undefined,
      refundDescription: searchForm.refundDescription || undefined,
      refundPath: searchForm.refundPath || undefined,
      feeBearer: searchForm.feeBearer || undefined,
      status: searchForm.status || undefined,
      reviewStatus: searchForm.reviewStatus || undefined,
      method: searchForm.method || undefined,
      channel: searchForm.channel || undefined
    }
    
    const result = await refundOrderAPI.getList(params)
    tableData.value = result.data
    total.value = result.total
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 状态文本映射
const getStatusText = (status) => {
  const map = {
    awaiting_refund: '待退款',
    awaiting_review: '待审核',
    refunding: '退款中',
    refund_success: '退款成功',
    refund_failed: '退款失败',
    refund_returned: '退款退回',
    refund_return_review: '退款退回审核'
  }
  return map[status] || status
}

// 状态标签类型映射
const getStatusType = (status) => {
  const map = {
    awaiting_refund: 'info',
    awaiting_review: 'warning',
    refunding: 'primary',
    refund_success: 'success',
    refund_failed: 'danger',
    refund_returned: 'info',
    refund_return_review: 'warning'
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

// 退款方式文本映射
const getMethodText = (method) => {
  const map = {
    original: '原路退回',
    bank: '银行转账',
    accounting: '记账'
  }
  return map[method] || method
}

// 退款方式标签类型映射
const getMethodType = (method) => {
  const map = {
    original: 'info',
    bank: 'primary',
    accounting: 'danger'
  }
  return map[method] || 'info'
}

// 退款路径标签类型映射
const getRefundPathType = (path) => {
  const map = {
    '原路退回': 'info',
    '退转付': 'primary',
    '记账': 'danger'
  };
  return map[path] || 'info';
}

// 手续费承担方标签类型映射
const getFeeBearerType = (bearer) => {
  const map = {
    '商户承担': 'info',
    '平台承担': 'primary',
    '用户承担': 'warning'
  };
  return map[bearer] || 'info';
}

// 获取关联交易单列表数据
const getRelatedTransactionListData = (transactionList) => {
  if (!transactionList || !Array.isArray(transactionList)) return [];
  
  return transactionList.map(item => ({
    transactionNumber: item
  }));
}

// 获取关联渠道单列表数据
const getRelatedChannelListData = (channelList) => {
  if (!channelList || !Array.isArray(channelList)) return [];
  
  return channelList.map(item => ({
    channelNumber: item
  }));
}

// 获取状态时间轴项目
const getStatusTimelineItems = (timeline, createTime) => {
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    return [];
  }
  
  // 定义状态类型映射
  const statusTypes = {
    '创建': 'info',
    '审核中': 'warning',
    '批准': 'primary',
    '执行中': 'primary',
    '失败': 'danger',
    '成功': 'success'
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

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.refundNumber = ''
  searchForm.relatedOrderNumber = ''
  searchForm.tenantId = ''
  searchForm.tenant = ''
  searchForm.agentId = ''
  searchForm.agent = ''
  searchForm.merchantId = ''
  searchForm.merchant = ''
  searchForm.userId = ''
  searchForm.payerAccount = ''
  searchForm.payeeAccount = ''
  searchForm.transactionSubType = ''
  searchForm.purpose = ''
  searchForm.reason = ''
  searchForm.refundDescription = ''
  searchForm.refundPath = ''
  searchForm.feeBearer = ''
  searchForm.status = ''
  searchForm.reviewStatus = ''
  searchForm.method = ''
  searchForm.channel = ''
  currentPage.value = 1
  fetchData()
}

// 添加
const handleAdd = () => {
  dialogTitle.value = '新增退款单'
  formModel.value = {
    id: null,
    refundNumber: `RFND${Date.now()}`,
    relatedOrderNumber: '',
    reason: '',
    amount: 0,
    method: '',
    status: 'awaiting_refund',
    reviewStatus: 'compliance_first_review',
    expectedArrivalTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
    actualArrivalTime: '',
    channel: '',
    createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑退款单'
  formModel.value = { ...row }
  dialogVisible.value = true
}

// 查看详情
const handleViewDetail = (row) => {
  currentRow.value = { ...row }
  detailDrawerVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除退款单号为 "${row.refundNumber}" 的退款单吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const success = await refundOrderAPI.delete(row.id)
      if (success) {
        ElMessage.success('删除成功')
        fetchData() // 重新获取数据
      } else {
        ElMessage.error('删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (formModel.value.id) {
          // 更新操作
          await refundOrderAPI.update(formModel.value.id, formModel.value)
          ElMessage.success('更新成功')
        } else {
          // 新增操作
          await refundOrderAPI.create(formModel.value)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchData() // 重新获取数据
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败')
      }
    }
  })
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

// 跳转到关联业务单详情
const goToRelatedOrder = (orderNumber) => {
  // 这里应该跳转到业务单详情页，暂时只显示消息
  ElMessage.info(`跳转到关联业务单: ${orderNumber}`)
  console.log('跳转到关联业务单详情页:', orderNumber)
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

.refund-order-list {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  min-height: 500px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.detail-content {
  padding: 20px 0;
}
</style>