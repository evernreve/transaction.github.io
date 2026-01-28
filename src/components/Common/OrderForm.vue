<template>
  <el-form
    :model="modelValue"
    :rules="formRules"
    ref="formRef"
    label-width="120px"
  >
    <el-form-item :label="orderType === 'business' ? '单号' : '订单号'" prop="orderNumber">
      <el-input
        v-model="modelValue.orderNumber"
        :disabled="!!modelValue.id"
        :placeholder="orderType === 'business' ? '请输入单号' : '请输入订单号'"
      />
    </el-form-item>
    
    <template v-if="orderType === 'transaction'">
      <el-form-item label="商户信息" prop="merchant">
        <el-input v-model="modelValue.merchant" placeholder="请输入商户信息" />
      </el-form-item>
      <el-form-item label="交易类型" prop="transactionType">
        <el-select v-model="modelValue.transactionType" placeholder="请选择交易类型">
          <el-option label="支付" value="payment" />
          <el-option label="退款" value="refund" />
          <el-option label="代扣" value="deduction" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户" prop="user">
        <el-input v-model="modelValue.user" placeholder="请输入用户" />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number
          v-model="modelValue.amount"
          :min="0"
          :precision="2"
          :step="1"
          placeholder="请输入金额"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="币种" prop="currency">
        <el-input v-model="modelValue.currency" placeholder="请输入币种" />
      </el-form-item>
    </template>
    
    <template v-else>
      <el-form-item label="关联交易单" prop="relatedTransaction">
        <el-input v-model="modelValue.relatedTransaction" placeholder="请输入关联交易单" />
      </el-form-item>
      <el-form-item label="渠道名称" prop="channel">
        <el-input v-model="modelValue.channel" placeholder="请输入渠道名称" />
      </el-form-item>
      <el-form-item label="租户" prop="tenant">
        <el-input v-model="modelValue.tenant" placeholder="请输入租户" />
      </el-form-item>
      <el-form-item label="代理商" prop="agent">
        <el-input v-model="modelValue.agent" placeholder="请输入代理商" />
      </el-form-item>
      <el-form-item label="商户" prop="merchant">
        <el-input v-model="modelValue.merchant" placeholder="请输入商户" />
      </el-form-item>
      <el-form-item label="业务单类型" prop="type">
        <el-select v-model="modelValue.type" placeholder="请选择业务单类型">
          <el-option label="支付" value="支付" />
          <el-option label="退款" value="退款" />
          <el-option label="代扣" value="代扣" />
          <el-option label="充值" value="充值" />
          <el-option label="提现" value="提现" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作人" prop="operator">
        <el-input v-model="modelValue.operator" placeholder="请输入操作人" />
      </el-form-item>
      <el-form-item label="费用说明" prop="feeDescription">
        <el-input v-model="modelValue.feeDescription" placeholder="请输入费用说明" />
      </el-form-item>
      <el-form-item label="费用扣减方式" prop="feeDeductionMethod">
        <el-select v-model="modelValue.feeDeductionMethod" placeholder="请选择费用扣减方式">
          <el-option label="实时扣减" value="实时扣减" />
          <el-option label="延时扣减" value="延时扣减" />
          <el-option label="按月结算" value="按月结算" />
          <el-option label="按笔结算" value="按笔结算" />
        </el-select>
      </el-form-item>
    </template>
    
    <el-form-item :label="orderType === 'business' ? '状态' : '支付状态'" prop="status">
      <el-select v-model="modelValue.status" :placeholder="orderType === 'business' ? '请选择状态' : '请选择支付状态'">
        <el-option
          v-for="option in statusOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    
    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="modelValue.remark"
        type="textarea"
        :rows="3"
        placeholder="请输入备注"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  orderType: {
    type: String,
    validator: value => ['business', 'transaction'],
    default: 'business'
  }
})

// 状态选项
const statusOptions = computed(() => {
  if (props.orderType === 'business') {
    return [
      { label: '待处理', value: 'pending' },
      { label: '已处理', value: 'processed' },
      { label: '已完成', value: 'completed' },
      { label: '已取消', value: 'cancelled' },
      { label: '未知', value: 'unknown' },
      { label: '失败', value: 'failed' }
    ]
  } else {
    return [
      { label: '未支付', value: 'unpaid' },
      { label: '已支付', value: 'paid' },
      { label: '支付失败', value: 'failed' },
      { label: '退款中', value: 'refunding' },
      { label: '已退款', value: 'refunded' }
    ]
  }
})

// 表单验证规则
const formRules = computed(() => {
  const rules = {
    orderNumber: [
      { required: true, message: props.orderType === 'business' ? '请输入单号' : '请输入订单号', trigger: 'blur' },
      { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
    ],
    status: [
      { required: true, message: props.orderType === 'business' ? '请选择状态' : '请选择支付状态', trigger: 'change' }
    ]
  }

  if (props.orderType === 'transaction') {
    Object.assign(rules, {
      merchant: [
        { required: true, message: '请输入商户信息', trigger: 'blur' }
      ],
      transactionType: [
        { required: true, message: '请选择交易类型', trigger: 'change' }
      ],
      user: [
        { required: true, message: '请输入用户', trigger: 'blur' }
      ],
      amount: [
        { required: true, message: '请输入金额', trigger: 'blur' },
        { type: 'number', min: 0, message: '金额必须大于等于0', trigger: 'blur' }
      ],
      currency: [
        { required: true, message: '请输入币种', trigger: 'blur' }
      ]
    })
  } else {
    Object.assign(rules, {
      relatedTransaction: [
        { required: true, message: '请输入关联交易单', trigger: 'blur' }
      ],
      channel: [
        { required: true, message: '请输入渠道名称', trigger: 'blur' }
      ],
      tenant: [
        { required: true, message: '请输入租户', trigger: 'blur' }
      ],
      agent: [
        { required: true, message: '请输入代理商', trigger: 'blur' }
      ],
      merchant: [
        { required: true, message: '请输入商户', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择业务单类型', trigger: 'change' }
      ],
      operator: [
        { required: true, message: '请输入操作人', trigger: 'blur' }
      ],
      feeDescription: [
        { required: true, message: '请输入费用说明', trigger: 'blur' }
      ],
      feeDeductionMethod: [
        { required: true, message: '请选择费用扣减方式', trigger: 'change' }
      ]
    })
  }

  return rules
})

// 创建一个表单引用
const formRef = ref(null)

// 暴露表单实例以便外部验证
defineExpose({
  validate: async (callback) => {
    if (formRef.value) {
      return formRef.value.validate(callback)
    }
  },
  validateField: async (props, callback) => {
    if (formRef.value) {
      return formRef.value.validateField(props, callback)
    }
  },
  resetFields: () => {
    if (formRef.value) {
      formRef.value.resetFields()
    }
  },
  clearValidate: (props) => {
    if (formRef.value) {
      formRef.value.clearValidate(props)
    }
  }
})
</script>

<style scoped>
/* 表单样式 */
</style>