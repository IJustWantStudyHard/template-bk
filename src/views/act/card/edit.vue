<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <tip title="编辑卡劵" />
          <el-form ref="card" :model="card" :rules="cardRule" :label-position="$store.state.app.labelPosition" label-width="251px">
            <el-form-item label="卡劵名称">
              <el-input v-model="card.title" :disabled="true" class="form-input" placeholder="字数上限为9个汉字" clearable />
            </el-form-item>
            <el-form-item label="启用时间" prop="begin_timestamp">
              <DatePicker :value="card.begin_timestamp" :type="'datetime'" :disabled="true" />
            </el-form-item>
            <el-form-item label="结束时间" prop="end_timestamp">
              <DatePicker
                :value="card.end_timestamp"
                :type="'datetime'"
                :dis-time="time"
                :disabled-type="6"
                :clearable="false"
                :default-time="'23:59:59'"
                @changeTime="changeTime"
                @focus="focusHandel"
              />
            </el-form-item>
            <div style="margin-left:251px;">
              <p class="tip-font">修改后的结束时间不得小于原结束时间</p>
            </div>
            <el-form-item label="客服电话" prop="service_phone">
              <el-input v-model="card.service_phone" class="form-input" maxlength="25" clearable placeholder="最多25个字符" />
            </el-form-item>
            <el-form-item>
              <el-button v-has="'CardUpdate'" type="primary" @click="submit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DatePicker from '@/components/Tool/DatePicker'

export default {
  components: { DatePicker },
  data() {
    return {
      time: '',
      card: {
        id: this.$route.query.id,
        title: '',
        // 必填 起用时间
        begin_timestamp: '',
        // 必填 表示 ， 建议设置为截止日期的23:59:59过期 。
        end_timestamp: '',
        service_phone: ''
      },
      cardRule: {
        end_timestamp: [
          { required: true, message: '请选择卡劵使用时间', trigger: 'blur' }
        ],
        service_phone: [
          { required: true, max: 25, message: '请输入正确的客服电话', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 初始化 根据卡劵id向后台请求数据 并格式化数据为指定格式
    this.apiBtn('CardShow', { id: this.$route.query.id })
      .then((res) => {
        this.card = res.data
        this.time = this.card.end_timestamp
      })
  },
  methods: {
    // 提交事件
    submit() {
      this.apiBtn('CardUpdate', { id: this.$route.query.id, type: 5, date_type: 1, end_timestamp: this.card.end_timestamp, service_phone: this.card.service_phone })
        .then((res) => {
          this.$router.push({ path: '/act/card' })
        })
    },
    // 修改时间
    changeTime(val) {
      this.card.end_timestamp = val
    },
    // 修复指定日期前不可选后，组件出现bug,若值为空则无法再赋值，故在focus时为空时强行赋值
    focusHandel(val) {
      if (!this.card.end_timestamp) this.card.end_timestamp = this.time
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
