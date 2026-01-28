<template>
  <div class="transaction-order-list">
    <!-- 顶部导航和筛选区域 -->
    <el-card class="filter-card">
      <div class="filter-header">
        <el-breadcrumb separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>交易单管理</el-breadcrumb-item>
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
        <el-form-item label="交易唯一号">
          <el-input 
            v-model="searchForm.orderNumber" 
            placeholder="请输入交易唯一号" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="关联商户订单">
          <el-input 
            v-model="searchForm.merchantOrderNumber" 
            placeholder="请输入关联商户订单" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="关联渠道订单">
          <el-input 
            v-model="searchForm.channelOrderNumber" 
            placeholder="请输入关联渠道订单" 
            clearable 
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="租户">
          <el-input 
            v-model="searchForm.tenant" 
            placeholder="请输入租户" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="代理商">
          <el-input 
            v-model="searchForm.agent" 
            placeholder="请输入代理商" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="商户">
          <el-input 
            v-model="searchForm.merchant" 
            placeholder="请输入商户" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="发起方">
          <el-input 
            v-model="searchForm.initiatorName" 
            placeholder="请输入发起方" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="收款方">
          <el-input 
            v-model="searchForm.receiverName" 
            placeholder="请输入收款方" 
            clearable 
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item label="交易类型">
          <el-select v-model="searchForm.transactionType" placeholder="请选择交易类型" clearable style="width: 150px;">
            <el-option label="支付" value="payment" />
            <el-option label="退款" value="refund" />
            <el-option label="收款" value="collection" />
            <el-option label="付款" value="payment_out" />
            <el-option label="结汇" value="exchange" />
            <el-option label="换汇" value="conversion" />
            <el-option label="数币充值" value="crypto_recharge" />
            <el-option label="数币提现" value="crypto_withdrawal" />
            <el-option label="法币充值" value="fiat_recharge" />
            <el-option label="法币提现" value="fiat_withdrawal" />
            <el-option label="钱包交易" value="wallet_transaction" />
            <el-option label="代扣" value="deduction" />
          </el-select>
        </el-form-item>
        <el-form-item label="原币种">
          <el-input 
            v-model="searchForm.originalCurrency" 
            placeholder="请输入原币种" 
            clearable 
            style="width: 100px;"
          />
        </el-form-item>
        <el-form-item label="目标币种">
          <el-input 
            v-model="searchForm.targetCurrency" 
            placeholder="请输入目标币种" 
            clearable 
            style="width: 100px;"
          />
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select v-model="searchForm.paymentStatus" placeholder="请选择支付状态" clearable style="width: 120px;">
            <el-option label="未支付" value="unpaid" />
            <el-option label="已支付" value="paid" />
            <el-option label="支付失败" value="failed" />
            <el-option label="退款中" value="refunding" />
            <el-option label="已退款" value="refunded" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select v-model="searchForm.productType" placeholder="请选择产品类型" clearable style="width: 120px;">
            <el-option label="标准支付" value="standard_payment" />
            <el-option label="跨境支付" value="cross_border_payment" />
            <el-option label="代收付" value="collection_payment" />
            <el-option label="钱包转账" value="wallet_transfer" />
            <el-option label="结算" value="settlement" />
          </el-select>
        </el-form-item>
        <el-form-item label="交易属性">
          <el-select v-model="searchForm.tradeAttribute" placeholder="请选择交易属性" clearable style="width: 120px;">
            <el-option label="实时" value="real_time" />
            <el-option label="延时" value="delayed" />
            <el-option label="批量" value="batch" />
            <el-option label="单笔" value="single" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付类型">
          <el-select v-model="searchForm.paymentType" placeholder="请选择支付类型" clearable style="width: 100px;">
            <el-option label="在线支付" value="online" />
            <el-option label="线下支付" value="offline" />
            <el-option label="扫码支付" value="scan" />
            <el-option label="刷卡支付" value="card" />
            <el-option label="网关支付" value="gateway" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用承担方">
          <el-select v-model="searchForm.feeBearer" placeholder="请选择费用承担方" clearable style="width: 120px;">
            <el-option label="商户承担" value="merchant" />
            <el-option label="平台承担" value="platform" />
            <el-option label="共同承担" value="shared" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="searchForm.paymentMethod" placeholder="请选择支付方式" clearable style="width: 120px;">
            <el-option label="渠道支付" value="channel_payment" />
            <el-option label="余额记账" value="balance_accounting" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否回冲">
          <el-select v-model="searchForm.isOffset" placeholder="请选择是否回冲" clearable style="width: 100px;">
            <el-option label="是" value="true" />
            <el-option label="否" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="手续费扣除方式">
          <el-select v-model="searchForm.feeDeductionMethod" placeholder="请选择手续费扣除方式" clearable style="width: 120px;">
            <el-option label="内扣" value="inner" />
            <el-option label="外扣" value="outer" />
          </el-select>
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
        <div class="table-title">交易单列表</div>
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
        <el-table-column prop="orderNumber" label="交易唯一号" width="200" sortable="custom" />
        <el-table-column prop="merchantOrderNumber" label="关联商户订单" width="180" show-overflow-tooltip />
        <el-table-column prop="channelOrderNumber" label="关联渠道订单" width="180" show-overflow-tooltip />
        <el-table-column prop="tenant" label="租户" width="120" show-overflow-tooltip />
        <el-table-column prop="agent" label="代理商" width="120" show-overflow-tooltip />
        <el-table-column prop="merchant" label="商户" width="120" show-overflow-tooltip />
        <el-table-column prop="initiatorName" label="发起方" width="120" show-overflow-tooltip />
        <el-table-column prop="receiverName" label="收款方" width="120" show-overflow-tooltip />
        <el-table-column prop="transactionType" label="交易类型" width="150">
          <template #default="{ row }">
            <el-tag :type="getTransactionTypeTag(row.transactionType)">
              {{ getTransactionTypeText(row.transactionType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="originalCurrency" label="原币种" width="100" />
        <el-table-column prop="originalAmount" label="原金额" width="120">
          <template #default="{ row }">
            {{ row.originalCurrency || 'CNY' }} {{ row.originalAmount?.toFixed(2) || row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="targetCurrency" label="目标币种" width="100" />
        <el-table-column prop="targetAmount" label="目标金额" width="120">
          <template #default="{ row }">
            {{ row.targetCurrency || 'CNY' }} {{ row.targetAmount?.toFixed(2) || row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="exchangeRate" label="汇率" width="100" />
        <el-table-column prop="requestTime" label="请求时间" width="180" />
        <el-table-column prop="expiryTime" label="过期时间" width="180" />
        <el-table-column prop="purpose" label="用途" width="100" />
        <el-table-column prop="businessScenario" label="业务场景" width="120" />
        <el-table-column prop="ownBank" label="本方银行" width="120" show-overflow-tooltip />
        <el-table-column prop="ownAccount" label="本方账号" width="180" show-overflow-tooltip />
        <el-table-column prop="counterpartyBank" label="对手方银行" width="120" show-overflow-tooltip />
        <el-table-column prop="counterpartyAccount" label="对手方账号" width="180" show-overflow-tooltip />
        <el-table-column prop="paymentStatus" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getPaymentStatusType(row.paymentStatus)">
              {{ getPaymentStatusText(row.paymentStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
        <el-table-column prop="productType" label="产品类型" width="120" />
        <el-table-column prop="tradeAttribute" label="交易属性" width="120" />
        <el-table-column prop="paymentType" label="支付类型" width="100" />
        <el-table-column prop="feeBearer" label="费用承担方" width="120" />
        <el-table-column prop="paymentMethod" label="支付方式" width="120">
          <template #default="{ row }">
            <el-tag :type="getPaymentMethodType(row.paymentMethod)">
              {{ getPaymentMethodText(row.paymentMethod) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isOffset" label="是否回冲" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isOffset ? 'danger' : 'success'">
              {{ row.isOffset ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="feeDeductionMethod" label="手续费扣除方式" width="120" />
        <el-table-column prop="updateTime" label="最后更新时间" width="180" />
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
      :title="`交易单详情 - ${currentRow?.orderNumber || ''}`"
      size="1200px"
      destroy-on-close
    >
      <div v-if="currentRow" class="detail-content">
        <el-tabs v-model="activeTab" type="border-card">
          <!-- Tab 1: 基础信息 -->
            <el-tab-pane label="基础信息" name="basic">
              <el-descriptions :column="1" border>
                <el-descriptions-item label="交易唯一号">{{ currentRow.orderNumber }}</el-descriptions-item>
                <el-descriptions-item label="关联商户订单">{{ currentRow.merchantOrderNumber || '-' }}</el-descriptions-item>
                <el-descriptions-item label="关联渠道订单">{{ currentRow.channelOrderNumber || '-' }}</el-descriptions-item>
                <el-descriptions-item label="租户">{{ currentRow.tenant || '-' }}</el-descriptions-item>
                <el-descriptions-item label="代理商">{{ currentRow.agent || '-' }}</el-descriptions-item>
                <el-descriptions-item label="商户">{{ currentRow.merchant }}</el-descriptions-item>
                <el-descriptions-item label="发起方ID">{{ currentRow.initiatorId || '-' }}</el-descriptions-item>
                <el-descriptions-item label="发起方名称">{{ currentRow.initiatorName || '-' }}</el-descriptions-item>
                <el-descriptions-item label="收款方ID">{{ currentRow.receiverId || '-' }}</el-descriptions-item>
                <el-descriptions-item label="收款方名称">{{ currentRow.receiverName || '-' }}</el-descriptions-item>
                <el-descriptions-item label="平台商户ID">{{ currentRow.platformMerchantId || '-' }}</el-descriptions-item>
                <el-descriptions-item label="交易类型">
                  <el-tag :type="getTransactionTypeTag(currentRow.transactionType)">
                    {{ getTransactionTypeText(currentRow.transactionType) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="原币种">{{ currentRow.originalCurrency || currentRow.currency || 'CNY' }}</el-descriptions-item>
                <el-descriptions-item label="原金额">{{ (currentRow.originalAmount || currentRow.amount)?.toFixed(2) }}</el-descriptions-item>
                <el-descriptions-item label="目标币种">{{ currentRow.targetCurrency || currentRow.currency || 'CNY' }}</el-descriptions-item>
                <el-descriptions-item label="目标金额">{{ (currentRow.targetAmount || currentRow.amount)?.toFixed(2) }}</el-descriptions-item>
                <el-descriptions-item label="汇率">{{ currentRow.exchangeRate || '1.0000' }}</el-descriptions-item>
                <el-descriptions-item label="请求时间">{{ currentRow.requestTime || currentRow.createTime }}</el-descriptions-item>
                <el-descriptions-item label="过期时间">{{ currentRow.expiryTime || '-' }}</el-descriptions-item>
                <el-descriptions-item label="用途">{{ currentRow.purpose || '-' }}</el-descriptions-item>
                <el-descriptions-item label="业务场景">{{ currentRow.businessScenario || '-' }}</el-descriptions-item>
                <el-descriptions-item label="本方银行">{{ currentRow.ownBank || '-' }}</el-descriptions-item>
                <el-descriptions-item label="本方账号">{{ currentRow.ownAccount || '-' }}</el-descriptions-item>
                <el-descriptions-item label="对手方银行">{{ currentRow.counterpartyBank || '-' }}</el-descriptions-item>
                <el-descriptions-item label="对手方账号">{{ currentRow.counterpartyAccount || '-' }}</el-descriptions-item>
                <el-descriptions-item label="支付状态">
                  <el-tag :type="getPaymentStatusType(currentRow.paymentStatus)">
                    {{ getPaymentStatusText(currentRow.paymentStatus) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ currentRow.createTime }}</el-descriptions-item>
                <el-descriptions-item label="最后更新时间">{{ currentRow.updateTime }}</el-descriptions-item>
                <el-descriptions-item label="产品类型">{{ currentRow.productType || '-' }}</el-descriptions-item>
                <el-descriptions-item label="交易属性">{{ currentRow.tradeAttribute || '-' }}</el-descriptions-item>
                <el-descriptions-item label="支付类型">{{ currentRow.paymentType || '-' }}</el-descriptions-item>
                <el-descriptions-item label="支付方式">
                  <el-tag :type="getPaymentMethodType(currentRow.paymentMethod)">
                    {{ getPaymentMethodText(currentRow.paymentMethod) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="费用承担方">{{ currentRow.feeBearer || '-' }}</el-descriptions-item>
                <el-descriptions-item label="是否回冲">
                  <el-tag :type="currentRow.isOffset ? 'danger' : 'success'">
                    {{ currentRow.isOffset ? '是' : '否' }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="手续费扣除方式">{{ currentRow.feeDeductionMethod || '-' }}</el-descriptions-item>
                <el-descriptions-item label="备注">{{ currentRow.remark }}</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>
          
          <!-- Tab 2: 费用明细 -->
          <el-tab-pane label="费用明细" name="fees">
            <div class="fees-section">
              <h4>分佣信息</h4>
              <el-descriptions :column="2" border style="margin-top: 10px;">
                <el-descriptions-item label="分佣规则ID">{{ currentRow.commissionRule || '-' }}</el-descriptions-item>
                <el-descriptions-item label="分佣类型">{{ currentRow.commissionType || '-' }}</el-descriptions-item>
                <el-descriptions-item label="代理商分佣比例">{{ currentRow.agentCommissionRate ? currentRow.agentCommissionRate + '%' : '-' }}</el-descriptions-item>
                <el-descriptions-item label="平台底价">¥{{ currentRow.platformBaseRate || '0.00' }}</el-descriptions-item>
              </el-descriptions>
              
              <h4 style="margin-top: 20px;">费用预估明细</h4>
              <el-table :data="currentRouteData?.feeEstimates || []" style="margin-top: 10px;">
                <el-table-column prop="feeName" label="费用名称" />
                <el-table-column prop="amount" label="金额" />
                <el-table-column prop="description" label="说明" />
              </el-table>
              
              <div class="net-amount" v-if="currentRouteData?.netAmount">
                <h4 style="margin-top: 20px;">应收/应付净值: <span class="amount-value">¥{{ currentRouteData.netAmount }}</span></h4>
              </div>
            </div>
          </el-tab-pane>
          
          <!-- Tab 3: 关联执行记录 -->
          <el-tab-pane label="关联执行记录" name="relatedTransaction">
            <div class="related-transaction-section">
              <h4>支付执行记录</h4>
              <el-table 
                :data="currentExecutionRecords.filter(record => record.recordType !== 'fee_deduction')" 
                style="margin-top: 10px;"
                @row-click="handleExecutionRecordClick"
              >
                <el-table-column prop="channelName" label="渠道名称" />
                <el-table-column prop="channelTraceNo" label="渠道流水号" />
                <el-table-column prop="channelStatus" label="渠道状态">
                  <template #default="{ row }">
                    <el-tag :type="getChannelStatusType(row.channelStatus)">
                      {{ getChannelStatusText(row.channelStatus) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="actualFee" label="实际执行费用" />
                <el-table-column prop="executeTime" label="执行时间" />
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button size="small" type="text" @click.stop="viewChannelDetail(row)">查看渠道详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <div v-if="currentRow.isOffset && currentRow.offsetOrder">
                <h4 style="margin-top: 20px;">退款执行记录</h4>
                <el-descriptions :column="2" border style="margin-top: 10px;">
                  <el-descriptions-item label="退款类型">
                    {{ getRefundTypeText(currentRow.offsetOrder.refundType) || '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="退款金额">
                    {{ currentRow.offsetOrder.refundCurrency || 'CNY' }} {{ currentRow.offsetOrder.refundAmount?.toFixed(2) || '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="退款币种">
                    {{ currentRow.offsetOrder.refundCurrency || '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="退款原因码">
                    {{ currentRow.offsetOrder.refundReasonCode || '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="退款原因描述">
                    {{ currentRow.offsetOrder.refundReasonDesc || '-' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="退款状态">
                    <el-tag :type="getRefundStatusType(currentRow.offsetOrder.refundStatus)">
                      {{ getRefundStatusText(currentRow.offsetOrder.refundStatus) || '-' }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="提交时间">
                    {{ currentRow.offsetOrder.submitTime || '-' }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
              
              <!-- 手续费扣减记录 -->
              <div v-if="currentExecutionRecords.some(record => record.recordType === 'fee_deduction')">
                <h4 style="margin-top: 20px;">手续费扣减记录</h4>
                <el-table 
                  :data="currentExecutionRecords.filter(record => record.recordType === 'fee_deduction')" 
                  style="margin-top: 10px;"
                  @row-click="handleExecutionRecordClick"
                >
                  <el-table-column prop="channelName" label="渠道名称" />
                  <el-table-column prop="channelTraceNo" label="渠道流水号" />
                  <el-table-column prop="channelStatus" label="渠道状态">
                    <template #default="{ row }">
                      <el-tag :type="getChannelStatusType(row.channelStatus)">
                        {{ getChannelStatusText(row.channelStatus) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="actualFee" label="实际执行费用" />
                  <el-table-column prop="executeTime" label="执行时间" />
                  <el-table-column label="操作">
                    <template #default="{ row }">
                      <el-button size="small" type="text" @click.stop="viewChannelDetail(row)">查看渠道详情</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
          
          <!-- Tab 4: 路由决策 -->
          <el-tab-pane label="路由决策" name="routing">
            <div class="routing-section">
              <h4>路由轨迹可视化</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in currentRouteData?.routeSteps || []"
                  :key="index"
                  :timestamp="item.timestamp"
                  :color="getRouteStepColor(item.status)"
                  :type="item.type"
                >
                  <p><strong>{{ item.stepName }}</strong></p>
                  <p>{{ item.description }}</p>
                  <p v-if="item.cost">费用预估: {{ item.cost }}</p>
                  <p v-if="item.reason">{{ item.reason }}</p>
                </el-timeline-item>
              </el-timeline>
              
              <h4 style="margin-top: 20px;">渠道PK结果</h4>
              <el-table 
                :data="currentRouteData?.channelComparison || []" 
                style="margin-top: 10px;"
                :row-class-name="getChannelRowClass"
              >
                <el-table-column prop="channelName" label="渠道名称" />
                <el-table-column prop="cost" label="费用" />
                <el-table-column prop="rate" label="成功率" />
                <el-table-column prop="time" label="预计耗时" />
                <el-table-column prop="reason" label="PK原因" />
                <el-table-column prop="selected" label="选中">
                  <template #default="{ row }">
                    <el-tag v-if="row.selected" type="success">选中</el-tag>
                    <el-tag v-else type="info">未选中</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          
          <!-- Tab 5: 状态与链路追踪 -->
          <el-tab-pane label="状态与链路追踪" name="tracking">
            <div class="tracking-section">
              <div class="timeline-controls">
                <el-button size="small" @click="expandAllTracking">展开全部</el-button>
                <el-button size="small" @click="collapseAllTracking">收起全部</el-button>
              </div>
              <el-timeline>
                <el-timeline-item
                  v-for="(log, index) in currentTrackingLogs"
                  :key="index"
                  :timestamp="log.timestamp"
                  :color="getStatusLogColor(log.status)"
                  :type="getStatusLogType(log.status)"
                >
                  <div class="log-content">
                    <p><strong>{{ log.nodeName }}</strong></p>
                    <p>状态: <el-tag :type="getStatusLogType(log.status)">{{ log.statusText }}</el-tag></p>
                    <p v-if="log.details">{{ log.details }}</p>
                    <p v-if="log.remark">备注: {{ log.remark }}</p>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>
          

        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { transactionOrderAPI } from '@/utils/mockData.js'
import { useRoute } from 'vue-router'

// 当前激活的标签页
const activeTab = ref('basic')

// 获取路由参数
const route = useRoute()

// 检查是否有传入的订单号参数
const initialOrderNumber = route.query.orderNumber

// 时间范围筛选
const timeRange = ref('') // 初始状态为空，表示不限制时间范围
const customTimeRange = ref([])

// 搜索表单
const searchForm = reactive({
  orderNumber: '',
  merchantOrderNumber: '',
  channelOrderNumber: '',
  tenant: '',
  agent: '',
  merchant: '',
  initiatorName: '',
  receiverName: '',
  transactionType: '',
  originalCurrency: '',
  targetCurrency: '',
  paymentStatus: '',
  productType: '',
  tradeAttribute: '',
  paymentType: '',
  feeBearer: '',
  paymentMethod: '',
  isOffset: '',
  feeDeductionMethod: ''
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

// 获取数据
const fetchData = async () => {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      orderNumber: searchForm.orderNumber || undefined,
      merchantOrderNumber: searchForm.merchantOrderNumber || undefined,
      channelOrderNumber: searchForm.channelOrderNumber || undefined,
      tenant: searchForm.tenant || undefined,
      agent: searchForm.agent || undefined,
      merchant: searchForm.merchant || undefined,
      initiatorName: searchForm.initiatorName || undefined,
      receiverName: searchForm.receiverName || undefined,
      transactionType: searchForm.transactionType || undefined,
      originalCurrency: searchForm.originalCurrency || undefined,
      targetCurrency: searchForm.targetCurrency || undefined,
      paymentStatus: searchForm.paymentStatus || undefined,
      productType: searchForm.productType || undefined,
      tradeAttribute: searchForm.tradeAttribute || undefined,
      paymentType: searchForm.paymentType || undefined,
      feeBearer: searchForm.feeBearer || undefined,
      paymentMethod: searchForm.paymentMethod || undefined,
      isOffset: searchForm.isOffset || undefined,
      feeDeductionMethod: searchForm.feeDeductionMethod || undefined,
      timeRange: timeRange.value || undefined,
      customTimeRange: timeRange.value === 'custom' ? customTimeRange.value : undefined,
      sortBy: sortParams.value.prop,
      sortOrder: sortParams.value.order
    }
    
    const result = await transactionOrderAPI.getList(params)
    tableData.value = result.data
    total.value = result.total
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 交易类型文本映射
const getTransactionTypeText = (type) => {
  const map = {
    payment: '支付',
    refund: '退款',
    collection: '收款',
    payment_out: '付款',
    exchange: '结汇',
    conversion: '换汇',
    crypto_recharge: '数币充值',
    crypto_withdrawal: '数币提现',
    fiat_recharge: '法币充值',
    fiat_withdrawal: '法币提现',
    wallet_transaction: '钱包交易',
    deduction: '代扣'
  }
  return map[type] || type
}

// 交易类型标签类型映射
const getTransactionTypeTag = (type) => {
  const map = {
    payment: 'success',
    refund: 'warning',
    collection: 'primary',
    payment_out: 'danger',
    exchange: 'info',
    conversion: 'info',
    crypto_recharge: 'warning',
    crypto_withdrawal: 'warning',
    fiat_recharge: 'primary',
    fiat_withdrawal: 'primary',
    wallet_transaction: 'info',
    deduction: 'info'
  }
  return map[type] || 'info'
}

// 支付状态文本映射
const getPaymentStatusText = (status) => {
  const map = {
    unpaid: '未支付',
    paid: '已支付',
    failed: '支付失败',
    refunding: '退款中',
    refunded: '已退款'
  }
  return map[status] || status
}

// 支付状态标签类型映射
const getPaymentStatusType = (status) => {
  const map = {
    unpaid: 'warning',
    paid: 'success',
    failed: 'danger',
    refunding: 'info',
    refunded: 'info'
  }
  return map[status] || 'info'
}

// 支付方式文本映射
const getPaymentMethodText = (method) => {
  const map = {
    channel_payment: '渠道支付',
    balance_accounting: '余额记账'
  };
  return map[method] || method;
};

// 支付方式标签类型映射
const getPaymentMethodType = (method) => {
  const map = {
    channel_payment: 'primary',
    balance_accounting: 'warning'
  };
  return map[method] || 'info';
};

// 退款类型文本映射
const getRefundTypeText = (type) => {
  const map = {
    original_path: '原路退回',
    alternative_path: '指定路径退回',
    balance: '余额记账'
  };
  return map[type] || type;
};

// 退款状态文本映射
const getRefundStatusText = (status) => {
  const map = {
    awaiting_refund: '待退款',
    awaiting_review: '待审核',
    refunding: '退款中',
    refund_success: '退款成功',
    refund_failed: '退款失败',
    refund_returned: '退款退回',
    refund_return_review: '退款退回审核',
    pending: '待处理',
    submitted: '已提交渠道',
    success: '成功',
    failed: '失败',
    partial_success: '部分成功'
  };
  return map[status] || status;
};

// 退款状态标签类型映射
const getRefundStatusType = (status) => {
  const map = {
    awaiting_refund: 'info',
    awaiting_review: 'warning',
    refunding: 'primary',
    refund_success: 'success',
    refund_failed: 'danger',
    refund_returned: 'info',
    refund_return_review: 'warning',
    pending: 'info',
    submitted: 'primary',
    success: 'success',
    failed: 'danger',
    partial_success: 'warning'
  };
  return map[status] || 'info';
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.orderNumber = ''
  searchForm.merchantOrderNumber = ''
  searchForm.channelOrderNumber = ''
  searchForm.tenant = ''
  searchForm.agent = ''
  searchForm.merchant = ''
  searchForm.initiatorName = ''
  searchForm.receiverName = ''
  searchForm.transactionType = ''
  searchForm.originalCurrency = ''
  searchForm.targetCurrency = ''
  searchForm.paymentStatus = ''
  searchForm.productType = ''
  searchForm.tradeAttribute = ''
  searchForm.paymentType = ''
  searchForm.feeBearer = ''
  searchForm.paymentMethod = ''
  searchForm.isOffset = ''
  searchForm.feeDeductionMethod = ''
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
        stepName: '交易开始',
        description: '接收交易请求',
        timestamp: row.createTime,
        status: 'info',
        type: 'primary'
      },
      {
        stepName: '路由输入',
        description: `金额: ¥${row.amount}, 币种: ${row.currency}`,
        timestamp: new Date(new Date(row.createTime).getTime() + 1000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'info',
        type: 'primary'
      },
      {
        stepName: '渠道A报价',
        description: '支付宝: ¥0.50',
        timestamp: new Date(new Date(row.createTime).getTime() + 2000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'info',
        type: 'primary'
      },
      {
        stepName: '渠道B报价',
        description: '微信支付: ¥0.60',
        timestamp: new Date(new Date(row.createTime).getTime() + 3000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'info',
        type: 'primary'
      },
      {
        stepName: '[PK结果] 选择渠道A',
        description: '选择支付宝(原因：成本最低)',
        timestamp: new Date(new Date(row.createTime).getTime() + 4000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'success',
        type: 'success',
        reason: '成本最低'
      },
      {
        stepName: '路由决策完成',
        description: '路由策略已确定',
        timestamp: new Date(new Date(row.createTime).getTime() + 5000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'success',
        type: 'success'
      }
    ],
    channelComparison: [
      { 
        channelName: '支付宝', 
        cost: '¥0.50', 
        rate: '99.9%', 
        time: '2秒', 
        selected: true,
        reason: '成本最低'
      },
      { 
        channelName: '微信支付', 
        cost: '¥0.60', 
        rate: '99.8%', 
        time: '3秒', 
        selected: false,
        reason: '成本较高'
      },
      { 
        channelName: '银联', 
        cost: '¥0.40', 
        rate: '99.5%', 
        time: '5秒', 
        selected: false,
        reason: '耗时较长'
      }
    ],
    feeEstimates: [
      { feeName: '渠道手续费', amount: '¥0.50', description: '支付宝渠道费用' },
      { feeName: '平台服务费', amount: '¥0.10', description: '平台技术服务费' },
      { feeName: '风险保证金', amount: '¥0.00', description: '风控费用' }
    ],
    netAmount: (row.amount + 0.60).toFixed(2) // 总金额 + 手续费
  }
  
  // 模拟跟踪日志
  currentTrackingLogs.value = [
    {
      nodeName: '交易创建',
      status: 'success',
      statusText: '成功',
      timestamp: row.createTime,
      details: '交易请求已接收',
      remark: '订单创建成功'
    },
    {
      nodeName: '路由完成',
      status: 'success',
      statusText: '成功',
      timestamp: new Date(new Date(row.createTime).getTime() + 5000).toISOString().slice(0, 19).replace('T', ' '),
      details: '路由决策完成，选择支付宝渠道',
      remark: '渠道选择成功'
    },
    {
      nodeName: '提交支付渠道',
      status: 'processing',
      statusText: '进行中',
      timestamp: new Date(new Date(row.createTime).getTime() + 8000).toISOString().slice(0, 19).replace('T', ' '),
      details: '已向支付宝渠道提交支付请求',
      remark: '等待渠道响应'
    },
    {
      nodeName: '风控审核中',
      status: 'processing',
      statusText: '进行中',
      timestamp: new Date(new Date(row.createTime).getTime() + 10000).toISOString().slice(0, 19).replace('T', ' '),
      details: '触发风控规则: 规则ID-FRAUD001',
      remark: '大额交易风险监控'
    },
    {
      nodeName: '支付成功',
      status: row.paymentStatus === 'paid' ? 'success' : 'failed',
      statusText: row.paymentStatus === 'paid' ? '成功' : '失败',
      timestamp: row.updateTime,
      details: row.paymentStatus === 'paid' ? '支付宝返回流水号: ALI2023123456789' : '支付失败，余额不足',
      remark: row.paymentStatus === 'paid' ? '交易完成' : '交易失败'
    }
  ]
  
  // 模拟执行记录
  currentExecutionRecords.value = [
    {
      id: 1,
      channelName: '支付宝',
      channelTraceNo: 'ALI2023123456789',
      channelStatus: row.paymentStatus === 'paid' ? 'success' : 'failed',
      actualFee: '¥0.50',
      executeTime: row.updateTime,
      recordType: 'normal'
    },
    ...(row.paymentStatus === 'failed' ? [{
      id: 2,
      channelName: '备用渠道-微信',
      channelTraceNo: 'WX2023987654321',
      channelStatus: 'failed',
      actualFee: '¥0.00',
      executeTime: new Date(new Date(row.updateTime).getTime() + 3000).toISOString().slice(0, 19).replace('T', ' '),
      recordType: 'normal'
    }] : []),
    ...(row.feeDeductionMethod === '外扣' ? [{
      id: row.paymentStatus === 'failed' ? 3 : 2,
      channelName: '手续费扣减渠道',
      channelTraceNo: `FEE${row.orderNumber.substring(2)}`,
      channelStatus: 'success',
      actualFee: '¥0.10',
      executeTime: new Date(new Date(row.updateTime).getTime() + 1000).toISOString().slice(0, 19).replace('T', ' '),
      recordType: 'fee_deduction'
    }] : [])
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

// 状态日志颜色
const getStatusLogColor = (status) => {
  const map = {
    success: '#67C23A',
    failed: '#F56C6C',
    processing: '#E6A23C',
    info: '#909399'
  }
  return map[status] || '#909399'
}

// 状态日志类型
const getStatusLogType = (status) => {
  const map = {
    success: 'success',
    failed: 'danger',
    processing: 'warning',
    info: 'info'
  }
  return map[status] || 'info'
}

// 渠道状态文本
const getChannelStatusText = (status) => {
  const map = {
    success: '成功',
    failed: '失败',
    processing: '处理中',
    pending: '待处理'
  }
  return map[status] || status
}

// 渠道状态类型
const getChannelStatusType = (status) => {
  const map = {
    success: 'success',
    failed: 'danger',
    processing: 'warning',
    pending: 'info'
  }
  return map[status] || 'info'
}

// 路由步骤颜色
const getRouteStepColor = (status) => {
  const map = {
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399',
    primary: '#409EFF'
  }
  return map[status] || '#909399'
}

// 获取渠道行样式
const getChannelRowClass = ({ row }) => {
  return row.selected ? 'selected-channel-row' : ''
}

// 展开全部跟踪记录
const expandAllTracking = () => {
  // 在实际应用中，这里会控制时间轴的展开状态
  ElMessage.info('已展开全部跟踪记录')
}

// 收起全部跟踪记录
const collapseAllTracking = () => {
  ElMessage.info('已收起全部跟踪记录')
}

// 点击执行记录
const handleExecutionRecordClick = (row) => {
  // 这里可以实现点击行的响应
  console.log('点击了执行记录', row)
}

// 查看渠道详情
const viewChannelDetail = (row) => {
  ElMessage.info(`查看渠道 ${row.channelName} 详情`)
  // 这里可以跳转到渠道交易流水管理页面
}

// 当前跟踪日志
const currentTrackingLogs = ref([])

// 当前执行记录
const currentExecutionRecords = ref([])

// 当前路由数据
const currentRouteData = ref(null)

onMounted(() => {
  // 检查是否有传入的订单号参数
  if (initialOrderNumber) {
    searchForm.orderNumber = initialOrderNumber
  }
  fetchData()
})
</script>

<style scoped>
.operation-cell {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.transaction-order-list {
  padding: 20px;
  background-color: #f0f9ff;
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

.routing-section, .tracking-section, .execution-section {
  padding: 10px 0;
}

.timeline-controls {
  margin-bottom: 15px;
  text-align: right;
}

.log-content p {
  margin: 5px 0;
}

.net-amount {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.amount-value {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

:deep(.selected-channel-row) {
  background-color: #f0f9ff;
}
</style>