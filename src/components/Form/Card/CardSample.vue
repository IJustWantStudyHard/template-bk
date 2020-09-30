<template>
  <el-form ref="data" :model="data" :rules="baseInfoRules" :label-position="$store.state.app.labelPosition" label-width="251px">
    <el-form-item label="卡劵名称" prop="title">
      <el-input v-model="data.title" :disabled="formType===1" class="form-input" placeholder="字数上限为9个汉字" clearable />
    </el-form-item>
    <p class="tip-font">注：卡劵名称字数上限为9个汉字，该字段提交后不可更改。</p>
    <el-form-item label="卡劵背景颜色" prop="color">
      <el-select v-model="data.color" placeholder="请选择code码形式" class="form-input">
        <el-option
          v-for="(value,key) in color_list_option"
          :key="key"
          :label="value"
          :value="key"
        >
          <span :style="{background:value}" class="colorBlock">{{ value }}</span></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="使用时间"
      prop="timestamp"
    >
      <DatePicker
        :value="data.timestamp"
        :type="'datetimerange'"
        :default-time="['00:00:00', '23:59:59']"
        @changeTime="changeTime"
      />
    </el-form-item>
    <el-form-item label="卡券使用说明" prop="description">
      <el-input v-model="data.description" type="textarea" placeholder="字数上限为1024个汉字" clearable />
    </el-form-item>
    <el-form-item label="优惠详情" prop="default_detail">
      <el-input v-model="data.default_detail" type="textarea" placeholder="字数上限为500个汉字" clearable />
    </el-form-item>
    <el-form-item label="客服电话" prop="service_phone">
      <el-input v-model="data.service_phone" class="form-input" maxlength="25" clearable placeholder="最多25个字符" />
    </el-form-item>
    <el-form-item label="与其他优惠共享" prop="can_use_with_other_discount">
      <el-switch v-model="data.can_use_with_other_discount" :active-value="1" :inactive-value="0" />
    </el-form-item>
    <p class="tip-font">注：默认打开，系统在使用须知里 拼写“可与其他优惠共享”。关闭时系统将在使用须知里 拼写“不可与其他优惠共享”。</p>
  </el-form>
</template>
<script>
import DatePicker from '@/components/Tool/DatePicker'
export default {
  name: 'BaseInfoNecessaryForm',
  components: { DatePicker },
  props: {
    data: {
      type: Object,
      default: function() {
        return {
        }
      }
    },
    formType: {
      type: Number,
      // 0 新增 1 编辑
      default: 0
    }
  },
  data() {
    return {
      baseInfoRules: {
        title: [
          { required: true, message: '请填写卡劵名称', trigger: 'blur' },
          { max: 9, message: '字数上限为9个汉字。(建议涵盖卡券属性、服务及金额)', trigger: 'blur' }
        ],
        color: [
          { required: true, message: '请选择卡劵背景颜色', trigger: 'change' }
        ],
        notice: [
          { required: true, message: '请填写卡券使用提醒', trigger: 'blur' },
          { max: 16, message: '字数上限为16个汉字', trigger: 'blur' }

        ],
        description: [
          { required: true, message: '请填写卡券使用说明', trigger: 'blur' },
          { max: 1024, message: '字数上限为1024个汉字', trigger: 'blur' }
        ],
        timestamp: [
          { required: true, message: '请选择卡劵使用时间', trigger: 'change' }
        ],
        service_phone: [
          { required: true, max: 25, message: '请输入正确的客服电话', trigger: 'blur' }
        ],
        default_detail: [
          { required: true, message: '请填写优惠详情', trigger: 'blur' },
          { max: 500, message: '字数上限为500个汉字', trigger: 'blur' }
        ]
      },
      code_type_list_option: this.$store.state.card.code_type_list,
      color_list_option: this.$store.state.card.color_list
    }
  },
  methods: {
    validateForm: function(callback) {
      var result = false
      this.$refs['data'].validate(valid => {
        result = valid
      })
      return result
    },
    changeTime: function(val) {
      this.$emit('changeTime', val)
    }
  }
}
</script>

<style scoped>
.tip-font{
  margin-left: 251px;
}
@media screen and (max-width: 1000px) {
    .tip-font{
      margin-left: 0;
    }
}
</style>
