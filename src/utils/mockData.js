// 模拟数据存储
let businessOrders = [];
let transactionOrders = [];
let refundOrders = []; // 新增退款单数据

// 关联映射存储
let relationMap = {
  // 业务单 -> 交易单 映射
  businessToTransaction: new Map(),
  // 交易单 -> 业务单 映射
  transactionToBusiness: new Map(),
  // 交易单 -> 退款单 映射
  transactionToRefund: new Map(),
  // 退款单 -> 交易单 映射
  refundToTransaction: new Map(),
  // 业务单 -> 退款单 映射
  businessToRefund: new Map(),
  // 退款单 -> 业务单 映射
  refundToBusiness: new Map()
};

// 初始化关联映射
const initializeRelationMap = (businessOrders, transactionOrders, refundOrders) => {
  // 清空现有映射
  Object.values(relationMap).forEach(map => map.clear());

  // 构建业务单 -> 交易单 映射
  transactionOrders.forEach(txn => {
    if (txn.relatedOrderNumber) {
      // 尝试匹配业务单号
      const businessOrder = businessOrders.find(biz => 
        biz.orderNumber === txn.relatedOrderNumber || 
        biz.platformOrderNumber === txn.relatedOrderNumber ||
        biz.merchantOrderNumber === txn.relatedOrderNumber
      );
      if (businessOrder) {
        if (!relationMap.businessToTransaction.has(businessOrder.id)) {
          relationMap.businessToTransaction.set(businessOrder.id, []);
        }
        relationMap.businessToTransaction.get(businessOrder.id).push(txn.id);
        relationMap.transactionToBusiness.set(txn.id, businessOrder.id);
      }
    }
  });

  // 构建交易单 -> 退款单 映射
  refundOrders.forEach(refund => {
    if (refund.relatedOrderNumber) {
      // 尝试匹配交易单号
      const transactionOrder = transactionOrders.find(txn => 
        txn.orderNumber === refund.relatedOrderNumber
      );
      if (transactionOrder) {
        if (!relationMap.transactionToRefund.has(transactionOrder.id)) {
          relationMap.transactionToRefund.set(transactionOrder.id, []);
        }
        relationMap.transactionToRefund.get(transactionOrder.id).push(refund.id);
        relationMap.refundToTransaction.set(refund.id, transactionOrder.id);
      } else {
        // 如果没找到交易单，尝试匹配业务单
        const businessOrder = businessOrders.find(biz => 
          biz.orderNumber === refund.relatedOrderNumber ||
          biz.platformOrderNumber === refund.relatedOrderNumber ||
          biz.merchantOrderNumber === refund.relatedOrderNumber
        );
        if (businessOrder) {
          if (!relationMap.businessToRefund.has(businessOrder.id)) {
            relationMap.businessToRefund.set(businessOrder.id, []);
          }
          relationMap.businessToRefund.get(businessOrder.id).push(refund.id);
          relationMap.refundToBusiness.set(refund.id, businessOrder.id);
        }
      }
    }
  });

  console.log('关联映射初始化完成');
  console.log('业务单->交易单映射数量:', relationMap.businessToTransaction.size);
  console.log('交易单->退款单映射数量:', relationMap.transactionToRefund.size);
  console.log('业务单->退款单映射数量:', relationMap.businessToRefund.size);
};

// 根据业务单ID获取关联的交易单IDs
const getTransactionsByBusinessId = (businessId) => {
  return relationMap.businessToTransaction.get(businessId) || [];
};

// 根据交易单ID获取关联的业务单ID
const getBusinessByTransactionId = (transactionId) => {
  return relationMap.transactionToBusiness.get(transactionId) || null;
};

// 根据交易单ID获取关联的退款单IDs
const getRefundsByTransactionId = (transactionId) => {
  return relationMap.transactionToRefund.get(transactionId) || [];
};

// 根据退款单ID获取关联的交易单ID
const getTransactionByRefundId = (refundId) => {
  return relationMap.refundToTransaction.get(refundId) || null;
};

// 根据业务单ID获取关联的退款单IDs
const getRefundsByBusinessId = (businessId) => {
  return relationMap.businessToRefund.get(businessId) || [];
};

// 根据退款单ID获取关联的业务单ID
const getBusinessByRefundId = (refundId) => {
  return relationMap.refundToBusiness.get(refundId) || null;
};

// 获取完整的关联关系（业务单 -> 交易单 -> 退款单）
const getFullRelationChain = (businessId, transactionId, refundId) => {
  let result = {
    businessOrder: null,
    transactionOrders: [],
    refundOrders: []
  };

  // 如果提供了业务单ID
  if (businessId) {
    result.transactionOrders = getTransactionsByBusinessId(businessId);
    result.refundOrders = getRefundsByBusinessId(businessId);
  }

  // 如果提供了交易单ID
  if (transactionId) {
    const relatedBusinessId = getBusinessByTransactionId(transactionId);
    if (relatedBusinessId && !businessId) {
      result.transactionOrders = getTransactionsByBusinessId(relatedBusinessId);
      result.refundOrders = getRefundsByBusinessId(relatedBusinessId);
    }
    
    result.refundOrders = result.refundOrders.concat(getRefundsByTransactionId(transactionId));
  }

  // 如果提供了退款单ID
  if (refundId) {
    const relatedBusinessId = getBusinessByRefundId(refundId);
    const relatedTransactionId = getTransactionByRefundId(refundId);
    
    if (relatedBusinessId && !businessId) {
      result.transactionOrders = getTransactionsByBusinessId(relatedBusinessId);
      result.refundOrders = getRefundsByBusinessId(relatedBusinessId);
    }
    
    if (relatedTransactionId && !transactionId) {
      result.refundOrders = result.refundOrders.concat([refundId]);
    }
  }

  return result;
};

// 初始化业务单模拟数据
const initBusinessOrders = () => {
  const statuses = ['pending', 'processed', 'completed', 'cancelled', 'unknown', 'failed'];
  const operators = ['张三', '李四', '王五', '赵六', '钱七'];
  const channels = ['支付宝', '微信支付', '银联', '云闪付', '京东支付'];
  const tenants = ['租户A', '租户B', '租户C', '租户D'];
  const tenantIds = ['Tenant_A', 'Tenant_B', 'Tenant_C', 'Tenant_D'];
  const agents = ['代理商1', '代理商2', '代理商3', '代理商4'];
  const agentIds = ['Agent_01', 'Agent_02', 'Agent_03', 'Agent_04'];
  const merchants = ['商户A', '商户B', '商户C', '商户D', '商户E'];
  const merchantIds = ['Merchant_ZhangSan', 'Merchant_LiSi', 'Merchant_WangWu', 'Merchant_ZhaoLiu', 'Merchant_QianQi'];
  const userIds = ['User_123', 'User_456', 'User_789', 'User_101', 'User_102'];
  const types = ['支付', '退款', '代扣', '充值', '提现'];
  const feeMethods = ['实时扣减', '延时扣减', '按月结算', '按笔结算'];
  const businessLines = ['b2b_collection', 'vcc_collection', 'crypto_recharge', 'fiat_exchange'];
  const transactionTypes = ['vcc_opening', 'vcc_collection', 'crypto_withdrawal', 'fiat_exchange'];
  const transactionSubTypes = ['人民币充值USDT', '美元兑换欧元', '数字资产购买', '跨境汇款', '虚拟商品支付'];
  const paymentMethods = ['swift', 'sepa', 'ach', 'paypal', 'stripe'];
  const payerAccounts = ['payer1@example.com', 'payer2@example.com', 'payer3@example.com', 'payer4@example.com', 'payer5@example.com'];
  const payeeAccounts = ['payee1@example.com', 'payee2@example.com', 'payee3@example.com', 'payee4@example.com', 'payee5@example.com'];
  const purposes = ['数字资产购买', '商品购买', '服务支付', '税费缴纳', '投资理财'];
  const orderStatuses = ['pending', 'processed', 'completed', 'cancelled', 'unknown', 'failed'];
  const reviewStatuses = ['compliance_first_review', 'principal_confirmation', 'fee_confirmation', 'approved', 'compliance_second_review'];
  
  for (let i = 1; i <= 30; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const originalAmount = parseFloat((Math.random() * 1000).toFixed(2));
    const actualPaidAmount = parseFloat((originalAmount - Math.random() * 10).toFixed(2));
    const hasRefund = Math.random() > 0.7; // 30%的概率有关联退款
    
    businessOrders.push({
      id: i,
      platformOrderNumber: `P${String(i).padStart(10, '0')}`, // 平台订单号
      merchantOrderNumber: `MCHNT${String(i).padStart(9, '0')}`, // 商户订单号
      businessLine: businessLines[Math.floor(Math.random() * businessLines.length)], // 业务线
      transactionType: transactionTypes[Math.floor(Math.random() * transactionTypes.length)], // 交易类型
      transactionSubType: transactionSubTypes[Math.floor(Math.random() * transactionSubTypes.length)], // 交易子类型
      paymentMethod: ['渠道支付', '余额记账'][Math.floor(Math.random() * 2)], // 支付方式
      payerAccount: payerAccounts[Math.floor(Math.random() * payerAccounts.length)], // 付款人账号
      payeeAccount: payeeAccounts[Math.floor(Math.random() * payeeAccounts.length)], // 收款人账号
      purpose: purposes[Math.floor(Math.random() * purposes.length)], // 交易附言/用途
      originalAmount: originalAmount, // 金额（原币）
      actualPaidAmount: actualPaidAmount, // 实付金额
      feeDetails: `渠道费:¥${(Math.random() * 5).toFixed(2)},平台费:¥${(Math.random() * 2).toFixed(2)}`, // 手续费明细
      exchangeRate: parseFloat((1 + Math.random() * 0.1).toFixed(4)), // 汇率
      orderStatus: orderStatuses[Math.floor(Math.random() * orderStatuses.length)], // 订单状态
      reviewStatus: reviewStatuses[Math.floor(Math.random() * reviewStatuses.length)], // 审核状态
      executedChannel: channels[Math.floor(Math.random() * channels.length)], // 最终执行渠道
      hasRefund: hasRefund, // 是否关联退款
      refundOrderNumber: hasRefund ? `R${String(i).padStart(10, '0')}` : null, // 关联退款单号
      orderNumber: `ORDER${String(i).padStart(6, '0')}`,
      relatedTransaction: `TXN${String(i).padStart(8, '0')}`,
      channel: channels[Math.floor(Math.random() * channels.length)],
      tenant: tenants[Math.floor(Math.random() * tenants.length)],
      tenantId: tenantIds[Math.floor(Math.random() * tenantIds.length)], // 平台租户ID
      agent: agents[Math.floor(Math.random() * agents.length)],
      agentId: agentIds[Math.floor(Math.random() * agentIds.length)], // 代理商ID
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      merchantId: merchantIds[Math.floor(Math.random() * merchantIds.length)], // 商户ID
      userId: userIds[Math.floor(Math.random() * userIds.length)], // 商户用户ID
      type: types[Math.floor(Math.random() * types.length)],
      status: status,
      feeDescription: `费用描述${i} (¥${(Math.random() * 10).toFixed(2)})`,
      feeDeductionMethod: ['内扣', '外扣'][Math.floor(Math.random() * 2)], // 手续费扣除方式
      createTime: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 19).replace('T', ' '),
      updateTime: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 19).replace('T', ' '),
      operator: operators[Math.floor(Math.random() * operators.length)],
      remark: `这是第 ${i} 条业务单的备注信息`,
      // 详情页面额外字段
      channelCostSnapshot: { cost: (0.5 + Math.random() * 0.5).toFixed(2), quoteTime: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 19).replace('T', ' ') }, // 渠道成本快照
      orderSubStatus: '已完成', // 订单子状态/响应码
      accountOpeningStatus: ['pending', 'processing', 'completed', 'failed'][Math.floor(Math.random() * 4)], // 开户状态
      accountFundingStatus: ['pending', 'processing', 'completed', 'failed'][Math.floor(Math.random() * 4)], // 账户充值状态
      reviewOperator: `Admin${String(i).padStart(2, '0')}`, // 审核操作人
      reviewTime: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 19).replace('T', ' '), // 审核时间
      statusTimeline: ['创建', '风控中', '审核中', '执行中', status === 'failed' ? '失败' : '完成'], // 完整状态时间轴
      relatedTransactionNumbers: [`T${String(i).padStart(9, '0')}`, `T${String(i+100).padStart(9, '0')}`], // 关联交易单号
      relatedTransactionStatuses: ['已完成', '失败原因: 1021-付款账户余额不足'], // 关联交易单状态
      relatedChannelNumber: `C${String(i).padStart(9, '0')}`, // 关联渠道单号
      riskScore: Math.floor(50 + Math.random() * 30), // 风控评分
      riskLabel: ['低风险', '中等风险', '高风险'][Math.floor(Math.random() * 3)], // 风控标签
      riskRemark: '大额交易，已核实凭证', // 风控审核备注
      complianceNumber: `CAS${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(i).padStart(4, '0')}` // 合规流水号
    });
  }
};

// 初始化交易单模拟数据
const initTransactionOrders = () => {
  const paymentStatuses = ['unpaid', 'paid', 'failed', 'refunding', 'refunded'];
  const users = ['用户A', '用户B', '用户C', '用户D', '用户E', '用户F'];
  const merchants = ['商户A', '商户B', '商户C', '商户D', '商户E'];
  const transactionTypes = ['payment', 'refund', 'collection', 'payment_out', 'exchange', 'conversion', 'crypto_recharge', 'crypto_withdrawal', 'fiat_recharge', 'fiat_withdrawal', 'wallet_transaction'];
  const tenants = ['租户A', '租户B', '租户C', '租户D'];
  const agents = ['代理商1', '代理商2', '代理商3', '代理商4'];
  const banks = ['中国银行', '工商银行', '建设银行', '招商银行', '交通银行'];
  const accounts = ['6222 **** **** 1111', '6222 **** **** 2222', '6222 **** **** 3333', '6222 **** **** 4444', '6222 **** **** 5555'];
  
  for (let i = 1; i <= 30; i++) {
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const originalAmount = parseFloat((Math.random() * 10000).toFixed(2));
    const targetAmount = parseFloat((originalAmount * (0.95 + Math.random() * 0.1)).toFixed(2));
    const exchangeRate = parseFloat((targetAmount / originalAmount).toFixed(4));
    const createTime = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 19).replace('T', ' ');
    const updateTime = new Date(new Date(createTime).getTime() + Math.random() * 1000 * 60 * 60 * 24).toISOString().slice(0, 19).replace('T', ' ');
    
    transactionOrders.push({
      id: i,
      orderNumber: `TXN${String(i).padStart(8, '0')}`, // 交易唯一号
      merchantOrderNumber: `MCHNT${String(i).padStart(10, '0')}`, // 关联的商户订单
      channelOrderNumber: `CHNL${String(i).padStart(12, '0')}`, // 关联的渠道订单
      tenant: tenants[Math.floor(Math.random() * tenants.length)], // 租户
      agent: agents[Math.floor(Math.random() * agents.length)], // 代理商
      merchant: merchants[Math.floor(Math.random() * merchants.length)], // 商户
      initiatorId: `INIT${String(i).padStart(8, '0')}`, // 发起方ID
      initiatorName: users[Math.floor(Math.random() * users.length)], // 发起方名称
      receiverId: `RECV${String(i).padStart(8, '0')}`, // 收款方ID
      receiverName: users[Math.floor(Math.random() * users.length)], // 收款方名称
      counterpartyBank: banks[Math.floor(Math.random() * banks.length)], // 对手方银行
      counterpartyAccount: accounts[Math.floor(Math.random() * accounts.length)], // 对手方账号
      platformMerchantId: `PLFM${String(i).padStart(8, '0')}`, // 平台商户ID
      transactionType: transactionTypes[Math.floor(Math.random() * transactionTypes.length)], // 交易类型
      originalCurrency: ['CNY', 'USD', 'EUR', 'GBP', 'JPY'][Math.floor(Math.random() * 5)], // 原币种
      originalAmount: originalAmount, // 原金额
      targetCurrency: ['CNY', 'USD', 'EUR', 'GBP', 'JPY'][Math.floor(Math.random() * 5)], // 目标币种
      targetAmount: targetAmount, // 目标金额
      exchangeRate: exchangeRate, // 汇率
      requestTime: createTime, // 请求时间
      expiryTime: new Date(new Date(createTime).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '), // 过期时间
      ownBank: banks[Math.floor(Math.random() * banks.length)], // 本方银行
      ownAccount: accounts[Math.floor(Math.random() * accounts.length)], // 本方账号
      amount: originalAmount, // 金额
      currency: 'CNY', // 币种
      purpose: ['货款', '服务费', '投资款', '还款', '其他'][Math.floor(Math.random() * 5)], // 用途
      businessScenario: ['电商货款', '服务费', '跨境支付', '退款', '代扣'][Math.floor(Math.random() * 5)], // 业务场景
      paymentStatus: paymentStatus,
      user: users[Math.floor(Math.random() * users.length)],
      createTime: createTime,
      updateTime: updateTime,
      productType: ['VCC卡', '外贸收款', '跨境电商', '供应链金融'][Math.floor(Math.random() * 4)], // 产品类型
      tradeAttribute: ['货物贸易', '服装贸易', '电子贸易', '食品贸易'][Math.floor(Math.random() * 4)], // 交易属性
      paymentType: ['Local', 'SWIFT'][Math.floor(Math.random() * 2)], // 支付类型
      feeBearer: ['OUR', 'SHA', 'BEN'][Math.floor(Math.random() * 3)], // 费用承担方
      commissionRule: `RULE${String(i).padStart(6, '0')}`, // 分佣规则ID
      commissionType: ['固定费率', '阶梯费率', '固定金额'][Math.floor(Math.random() * 3)], // 分佣类型
      agentCommissionRate: parseFloat((0.5 + Math.random() * 2.0).toFixed(2)), // 代理商分佣比例
      platformBaseRate: parseFloat((1.0 + Math.random() * 3.0).toFixed(2)), // 平台底价
      isOffset: Math.random() > 0.7, // 是否回冲
      offsetOrder: Math.random() > 0.7 ? {
        refundType: ['original_path', 'alternative_path', 'balance'][Math.floor(Math.random() * 3)], // 退款类型
        refundAmount: parseFloat((originalAmount * (0.8 + Math.random() * 0.2)).toFixed(2)), // 退款金额
        refundCurrency: ['USD', 'EUR', 'GBP', 'CNY'][Math.floor(Math.random() * 4)], // 退款币种
        refundReasonCode: `R${String(i).padStart(4, '0')}`, // 退款原因码
        refundReasonDesc: `退款原因描述-${i}`, // 退款原因描述
        refundStatus: ['awaiting_refund', 'awaiting_review', 'refunding', 'refund_success', 'refund_failed', 'refund_returned', 'refund_return_review', 'pending', 'submitted', 'success', 'failed', 'partial_success'][Math.floor(Math.random() * 12)], // 退款状态
        submitTime: new Date(new Date(createTime).getTime() + 3600000).toISOString().slice(0, 19).replace('T', ' ') // 退款请求提交至渠道的时间
      } : null, // 回冲订单信息
      paymentMethod: ['channel_payment', 'balance_accounting'][Math.floor(Math.random() * 2)], // 支付方式
      feeDeductionMethod: ['内扣', '外扣'][Math.floor(Math.random() * 2)], // 手续费扣除方式
      remark: `这是第 ${i} 条交易单的备注信息`
    });
  }
};

// 初始化退款单模拟数据
const initRefundOrders = () => {
  const reasons = ['商品质量问题', '客户不满意', '发货错误', '重复下单', '价格异议', '服务问题', '其他'];
  const methods = ['original', 'bank', 'accounting'];
  const statuses = ['awaiting_refund', 'awaiting_review', 'refunding', 'refund_success', 'refund_failed', 'refund_returned', 'refund_return_review'];
  const reviewStatuses = ['compliance_first_review', 'principal_confirmation', 'fee_confirmation', 'approved', 'compliance_second_review'];
  const channels = ['alipay', 'wechat', 'unionpay', 'bank'];
  const tenants = ['租户A', '租户B', '租户C', '租户D'];
  const tenantIds = ['Tenant_A', 'Tenant_B', 'Tenant_C', 'Tenant_D'];
  const agents = ['代理商1', '代理商2', '代理商3', '代理商4'];
  const agentIds = ['Agent_01', 'Agent_02', 'Agent_03', 'Agent_04'];
  const merchants = ['商户A', '商户B', '商户C', '商户D', '商户E'];
  const merchantIds = ['Merchant_ZhangSan', 'Merchant_LiSi', 'Merchant_WangWu', 'Merchant_ZhaoLiu', 'Merchant_QianQi'];
  const userIds = ['User_123', 'User_456', 'User_789', 'User_101', 'User_102'];
  const transactionSubTypes = ['人民币充值USDT', '美元兑换欧元', '数字资产购买', '跨境汇款', '虚拟商品支付'];
  const purposes = ['数字资产购买', '商品购买', '服务支付', '税费缴纳', '投资理财'];
  const payerAccounts = ['payer1@example.com', 'payer2@example.com', 'payer3@example.com', 'payer4@example.com', 'payer5@example.com'];
  const payeeAccounts = ['payee1@example.com', 'payee2@example.com', 'payee3@example.com', 'payee4@example.com', 'payee5@example.com'];
  
  for (let i = 1; i <= 20; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = parseFloat((Math.random() * 1000).toFixed(2));
    const createTime = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 15).toISOString().slice(0, 19).replace('T', ' ');
    const updateTime = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 19).replace('T', ' ');
    const expectedArrivalTime = new Date(new Date(createTime).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
    const actualArrivalTime = status === 'refunded' ? 
      new Date(new Date(expectedArrivalTime).getTime() + Math.random() * 1000 * 60 * 60 * 6).toISOString().slice(0, 19).replace('T', ' ') : '';
    
    refundOrders.push({
      id: i,
      refundNumber: `RFND${String(i).padStart(8, '0')}`,
      relatedOrderNumber: `ORDER${String(i).padStart(6, '0')}`,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      amount: amount,
      method: methods[Math.floor(Math.random() * methods.length)],
      status: status,
      reviewStatus: reviewStatuses[Math.floor(Math.random() * reviewStatuses.length)],
      expectedArrivalTime: expectedArrivalTime,
      actualArrivalTime: actualArrivalTime,
      channel: channels[Math.floor(Math.random() * channels.length)],
      createTime: createTime,
      updateTime: updateTime,
      remark: `这是第 ${i} 条退款单的备注信息`,
      // 新增字段
      tenant: tenants[Math.floor(Math.random() * tenants.length)], // 平台租户名称
      tenantId: tenantIds[Math.floor(Math.random() * tenantIds.length)], // 平台租户ID
      agent: agents[Math.floor(Math.random() * agents.length)], // 代理商名称
      agentId: agentIds[Math.floor(Math.random() * agentIds.length)], // 代理商ID
      merchant: merchants[Math.floor(Math.random() * merchants.length)], // 商户名称
      merchantId: merchantIds[Math.floor(Math.random() * merchantIds.length)], // 商户ID
      userId: userIds[Math.floor(Math.random() * userIds.length)], // 商户用户ID
      payerAccount: payerAccounts[Math.floor(Math.random() * payerAccounts.length)], // 付款人账号
      payeeAccount: payeeAccounts[Math.floor(Math.random() * payeeAccounts.length)], // 收款人账号
      transactionSubType: transactionSubTypes[Math.floor(Math.random() * transactionSubTypes.length)], // 交易子类型
      purpose: purposes[Math.floor(Math.random() * purposes.length)], // 交易附言/用途
      refundDescription: `订单号: ORDER_${String(i).padStart(3, '0')}， 商品已退回`, // 退款说明
      refundPath: ['原路退回', '退转付', '记账'][Math.floor(Math.random() * 3)], // 退款路径
      feeBearer: ['商户承担', '平台承担', '用户承担'][Math.floor(Math.random() * 3)], // 手续费承担方
      // 详情页字段
      refundRoutingStrategy: { strategy: '原路优先，失败后转余额' }, // 退款路由策略快照
      relatedTransactionList: [`T-REFUND${String(i).padStart(3, '0')}01`, `T-REFUND${String(i).padStart(3, '0')}02`], // 关联交易单列表
      relatedRefundChannelList: [`C-REFUND${String(i).padStart(3, '0')}01`, `C-REFUND${String(i).padStart(3, '0')}02`], // 关联的退款渠道单列表
      currentActiveTransaction: `T-REFUND${String(i).padStart(3, '0')}02`, // 当前生效交易单
      statusTimeline: ['创建', '待审核', '审核中', '批准', '退款中', status === 'refund_failed' ? '退款失败' : '退款成功'], // 状态时间轴
      reviewOperator: `Admin${String(i).padStart(2, '0')}`, // 审核操作人
      reviewTime: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 19).replace('T', ' '), // 审核时间
      originalPaymentChannelNumber: `C-PAY${String(i).padStart(7, '0')}1`, // 原始支付渠道单号
      originalPaymentInfo: { amount: (amount + 10).toFixed(2), time: new Date(new Date(createTime).getTime() - 86400000).toISOString().slice(0, 19).replace('T', ' ') }, // 原始支付交易信息
      refundRiskScore: Math.floor(Math.random() * 40), // 退款风控评分
      refundRiskResult: ['低风险', '中等风险', '高风险'][Math.floor(Math.random() * 3)], // 退款风控结果
      reviewRemark: '已核实退货物流单号', // 审核备注
      complianceNumber: `COMPLIANCE${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(i).padStart(4, '0')}` // 合规流水号
    });
  }
};

// 初始化数据
initBusinessOrders();
initTransactionOrders();
initRefundOrders(); // 初始化退款单数据

// 初始化关联映射
initializeRelationMap(businessOrders, transactionOrders, refundOrders);

// 交易单 API 模拟
export const transactionOrderAPI = {
  // 获取交易单列表
  getList(params = {}) {
    let result = [...transactionOrders];
    
    // 模拟搜索
    if (params.orderNumber) {
      result = result.filter(item => item.orderNumber.includes(params.orderNumber));
    }
    if (params.merchantOrderNumber) {
      result = result.filter(item => item.merchantOrderNumber.includes(params.merchantOrderNumber));
    }
    if (params.channelOrderNumber) {
      result = result.filter(item => item.channelOrderNumber.includes(params.channelOrderNumber));
    }
    if (params.tenant) {
      result = result.filter(item => item.tenant.includes(params.tenant));
    }
    if (params.agent) {
      result = result.filter(item => item.agent.includes(params.agent));
    }
    if (params.merchant) {
      result = result.filter(item => item.merchant.includes(params.merchant));
    }
    if (params.initiatorName) {
      result = result.filter(item => item.initiatorName.includes(params.initiatorName));
    }
    if (params.receiverName) {
      result = result.filter(item => item.receiverName.includes(params.receiverName));
    }
    if (params.transactionType) {
      result = result.filter(item => item.transactionType === params.transactionType);
    }
    if (params.originalCurrency) {
      result = result.filter(item => item.originalCurrency.includes(params.originalCurrency));
    }
    if (params.targetCurrency) {
      result = result.filter(item => item.targetCurrency.includes(params.targetCurrency));
    }
    if (params.paymentStatus) {
      result = result.filter(item => item.paymentStatus === params.paymentStatus);
    }
    if (params.productType) {
      result = result.filter(item => item.productType.includes(params.productType));
    }
    if (params.tradeAttribute) {
      result = result.filter(item => item.tradeAttribute.includes(params.tradeAttribute));
    }
    if (params.paymentType) {
      result = result.filter(item => item.paymentType.includes(params.paymentType));
    }
    if (params.feeBearer) {
      result = result.filter(item => item.feeBearer.includes(params.feeBearer));
    }
    if (params.paymentMethod) {
      result = result.filter(item => item.paymentMethod.includes(params.paymentMethod));
    }
    if (params.isOffset !== undefined && params.isOffset !== '') {
      result = result.filter(item => String(item.isOffset) === params.isOffset);
    }
    if (params.feeDeductionMethod) {
      result = result.filter(item => item.feeDeductionMethod.includes(params.feeDeductionMethod));
    }
    if (params.keyword) {
      result = result.filter(item => 
        item.orderNumber.includes(params.keyword) || 
        item.merchant.includes(params.keyword)
      );
    }
    
    // 模拟排序
    if (params.sortBy) {
      const order = params.sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        if (params.sortBy === 'amount') {
          return (a[params.sortBy] - b[params.sortBy]) * order;
        } else {
          if (a[params.sortBy] < b[params.sortBy]) return -1 * order;
          if (a[params.sortBy] > b[params.sortBy]) return 1 * order;
          return 0;
        }
      });
    }
    
    // 模拟分页
    const { page = 1, pageSize = 10 } = params;
    const start = (page - 1) * pageSize;
    const end = start + parseInt(pageSize);
    
    return {
      data: result.slice(start, end),
      total: result.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  },
  
  // 获取单个交易单
  getById(id) {
    return transactionOrders.find(item => item.id === parseInt(id));
  },
  
  // 创建交易单
  create(data) {
    const newOrder = {
      ...data,
      id: Math.max(...transactionOrders.map(o => o.id), 0) + 1,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    transactionOrders.push(newOrder);
    return newOrder;
  },
  
  // 更新交易单
  update(id, data) {
    const index = transactionOrders.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      transactionOrders[index] = { 
        ...data, 
        id: parseInt(id),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ') 
      };
      return transactionOrders[index];
    }
    return null;
  },
  
  // 删除交易单
  delete(id) {
    const index = transactionOrders.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      transactionOrders.splice(index, 1);
      return true;
    }
    return false;
  }
};

// 退款单 API 模拟
export const refundOrderAPI = {
  // 获取退款单列表
  getList(params = {}) {
    let result = [...refundOrders];
    
    // 模拟搜索
    if (params.refundNumber) {
      result = result.filter(item => item.refundNumber.includes(params.refundNumber));
    }
    if (params.relatedOrderNumber) {
      result = result.filter(item => item.relatedOrderNumber.includes(params.relatedOrderNumber));
    }
    if (params.tenantId) {
      result = result.filter(item => item.tenantId.includes(params.tenantId));
    }
    if (params.tenant) {
      result = result.filter(item => item.tenant.includes(params.tenant));
    }
    if (params.agentId) {
      result = result.filter(item => item.agentId.includes(params.agentId));
    }
    if (params.agent) {
      result = result.filter(item => item.agent.includes(params.agent));
    }
    if (params.merchantId) {
      result = result.filter(item => item.merchantId.includes(params.merchantId));
    }
    if (params.merchant) {
      result = result.filter(item => item.merchant.includes(params.merchant));
    }
    if (params.userId) {
      result = result.filter(item => item.userId.includes(params.userId));
    }
    if (params.payerAccount) {
      result = result.filter(item => item.payerAccount.includes(params.payerAccount));
    }
    if (params.payeeAccount) {
      result = result.filter(item => item.payeeAccount.includes(params.payeeAccount));
    }
    if (params.transactionSubType) {
      result = result.filter(item => item.transactionSubType.includes(params.transactionSubType));
    }
    if (params.purpose) {
      result = result.filter(item => item.purpose.includes(params.purpose));
    }
    if (params.reason) {
      result = result.filter(item => item.reason.includes(params.reason));
    }
    if (params.refundDescription) {
      result = result.filter(item => item.refundDescription.includes(params.refundDescription));
    }
    if (params.refundPath) {
      result = result.filter(item => item.refundPath.includes(params.refundPath));
    }
    if (params.feeBearer) {
      result = result.filter(item => item.feeBearer.includes(params.feeBearer));
    }
    if (params.status) {
      result = result.filter(item => item.status === params.status);
    }
    if (params.reviewStatus) {
      result = result.filter(item => item.reviewStatus === params.reviewStatus);
    }
    if (params.method) {
      result = result.filter(item => item.method === params.method);
    }
    if (params.channel) {
      result = result.filter(item => item.channel === params.channel);
    }
    
    // 模拟分页
    const { page = 1, pageSize = 10 } = params;
    const start = (page - 1) * pageSize;
    const end = start + parseInt(pageSize);
    
    return {
      data: result.slice(start, end),
      total: result.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  },
  
  // 获取单个退款单
  getById(id) {
    return refundOrders.find(item => item.id === parseInt(id));
  },
  
  // 创建退款单
  create(data) {
    const newOrder = {
      ...data,
      id: Math.max(...refundOrders.map(o => o.id), 0) + 1,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    refundOrders.push(newOrder);
    return newOrder;
  },
  
  // 更新退款单
  update(id, data) {
    const index = refundOrders.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      refundOrders[index] = { ...data, id: parseInt(id), updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ') };
      return refundOrders[index];
    }
    return null;
  },
  
  // 删除退款单
  delete(id) {
    const index = refundOrders.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      refundOrders.splice(index, 1);
      return true;
    }
    return false;
  }
};

// 导出关联映射功能
export {
  initializeRelationMap,
  getTransactionsByBusinessId,
  getBusinessByTransactionId,
  getRefundsByTransactionId,
  getTransactionByRefundId,
  getRefundsByBusinessId,
  getBusinessByRefundId,
  getFullRelationChain
};

// 业务单 API 模拟
export const businessOrderAPI = {
  // 获取业务单列表
  getList(params = {}) {
    let result = [...businessOrders];
    
    // 模拟搜索
    if (params.platformOrderNumber) {
      result = result.filter(item => item.platformOrderNumber.includes(params.platformOrderNumber));
    }
    if (params.merchantOrderNumber) {
      result = result.filter(item => item.merchantOrderNumber.includes(params.merchantOrderNumber));
    }
    if (params.businessLine) {
      result = result.filter(item => item.businessLine === params.businessLine);
    }
    if (params.transactionType) {
      result = result.filter(item => item.transactionType === params.transactionType);
    }
    if (params.paymentMethod) {
      result = result.filter(item => item.paymentMethod === params.paymentMethod);
    }
    if (params.tenantId) {
      result = result.filter(item => item.tenantId.includes(params.tenantId));
    }
    if (params.agentId) {
      result = result.filter(item => item.agentId.includes(params.agentId));
    }
    if (params.merchantId) {
      result = result.filter(item => item.merchantId.includes(params.merchantId));
    }
    if (params.userId) {
      result = result.filter(item => item.userId.includes(params.userId));
    }
    if (params.transactionSubType) {
      result = result.filter(item => item.transactionSubType.includes(params.transactionSubType));
    }
    if (params.orderStatus) {
      result = result.filter(item => item.orderStatus === params.orderStatus);
    }
    if (params.reviewStatus) {
      result = result.filter(item => item.reviewStatus === params.reviewStatus);
    }
    if (params.executedChannel) {
      result = result.filter(item => item.executedChannel.includes(params.executedChannel));
    }
    if (params.keyword) {
      result = result.filter(item => 
        item.orderNumber.includes(params.keyword) || 
        item.merchant.includes(params.keyword) ||
        item.platformOrderNumber.includes(params.keyword) ||
        item.merchantOrderNumber.includes(params.keyword)
      );
    }
    if (params.orderNumber) {
      // 为了兼容旧的orderNumber参数
      result = result.filter(item => 
        item.orderNumber.includes(params.orderNumber) || 
        item.platformOrderNumber.includes(params.orderNumber) ||
        item.merchantOrderNumber.includes(params.orderNumber)
      );
    }
    if (params.status) {
      // 为了兼容旧的status参数
      result = result.filter(item => item.status === params.status);
    }
    if (params.tenant) {
      // 为了兼容旧的tenant参数
      result = result.filter(item => item.tenant.includes(params.tenant));
    }
    if (params.agent) {
      // 为了兼容旧的agent参数
      result = result.filter(item => item.agent.includes(params.agent));
    }
    
    // 模拟排序
    if (params.sortBy) {
      const order = params.sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        if (a[params.sortBy] < b[params.sortBy]) return -1 * order;
        if (a[params.sortBy] > b[params.sortBy]) return 1 * order;
        return 0;
      });
    }
    
    // 模拟分页
    const { page = 1, pageSize = 10 } = params;
    const start = (page - 1) * pageSize;
    const end = start + parseInt(pageSize);
    
    return {
      data: result.slice(start, end),
      total: result.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  },
  
  // 获取单个业务单
  getById(id) {
    return businessOrders.find(item => item.id === parseInt(id));
  },
  
  // 创建业务单
  create(data) {
    const newOrder = {
      ...data,
      id: Math.max(...businessOrders.map(o => o.id), 0) + 1,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    businessOrders.push(newOrder);
    return newOrder;
  },
  
  // 更新业务单
  update(id, data) {
    const index = businessOrders.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      businessOrders[index] = { ...data, id: parseInt(id) };
      return businessOrders[index];
    }
    return null;
  },
  
  // 删除业务单
  delete(id) {
    const index = businessOrders.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      businessOrders.splice(index, 1);
      return true;
    }
    return false;
  }
};
