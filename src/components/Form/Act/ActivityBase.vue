<template>
  <div id="base">
    <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
      <!-- TODO:开启driver.js后，使用clearable会使该el-form-item消失 -->
      <tip title="活动内容设置" />
      <template>
        <el-form-item label="活动名称" prop="name" class="activity-name">
          <el-input v-model="form.name" type="textarea" :disabled="disabled" maxlength="20" show-word-limit clearable @change="updateForm('name', $event)" />
        </el-form-item>
        <div class="tip-font">字数在20个以内</div>
      </template>

      <!-- <template>
        <el-form-item label="活动时间" prop="time" class="activity-time">
          <DatePicker
            v-model="form.time"
            :type="'datetimerange'"
            :disabled-type="0"
            :disabled="disabled"
            @changeTime="updateForm('time', $event)"
          />
        </el-form-item>
        <div class="tip-font">活动有效期</div>
      </template> -->

      <el-form-item label="开启留言" class="activity-is_message">
        <el-switch
          v-model="form.is_message"
          :disabled="disabled"
          @change="updateForm('is_message', $event)"
        />
      </el-form-item>

      <!-- <template>
        <el-form-item label="活动类型" prop="type" class="activity-type">
          <el-radio-group v-model="form.type" :disabled="disabled" @change="updateForm('type', $event)">
            <el-radio :label="1">文章</el-radio>
            <el-radio :label="2">易企秀</el-radio>
          </el-radio-group>
        </el-form-item>
      </template> -->

      <!-- v-show="form.type===1" -->
      <el-form-item label="活动详情" prop="detail" class="activity-detail">
        <Tinymce :html="form.detail" :disabled="disabled" @change="updateForm('detail', $event)" />
      </el-form-item>

      <!-- <el-form-item v-show="form.type===2" label="易企秀链接" prop="link">
        <el-input v-model="form.link" :disabled="disabled" clearable @change="updateForm('link', $event)" />
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
// import DatePicker from '@/components/Tool/DatePicker'
import Bus from '@/utils/bus'
import { mapState, mapMutations } from 'vuex'
import Tinymce from '@/components/Tinymce/index'
import { validateEdit } from '@/utils/validate'

export default {
  components: { Tinymce },
  data() {
    const validateName = (rule, val, callback) => {
      const name = this.form.name
      if (name && name.length <= 20) {
        callback()
      } else {
        callback(new Error('请设置正确的活动名称'))
      }
    }
    // const validateTime = (rule, val, callback) => {
    //   const time = this.form.time
    //   if (!time || time.length < 2) {
    //     callback(new Error('请设置活动时间'))
    //   } else {
    //     callback()
    //   }
    // }

    const validateDetail = (rule, val, callback) => {
      if (this.form.type === 1 && !this.form.detail) {
        callback(new Error('请设置活动详情'))
      } else if (validateEdit(val))callback(new Error('活动详情中严禁出现“红包”、“转发”、“分享”、“朋友圈”等敏感词汇'))
      else {
        callback()
      }
    }

    // const validateLink = (rule, val, callback) => {
    //   if (this.form.type === 2 && !this.form.link) {
    //     callback(new Error('请设置易企秀链接'))
    //   } else {
    //     callback()
    //   }
    // }

    return {
      name: '',
      dialogVisible: false,
      qr_code: {},
      formRules: {
        name: [{ required: true, trigger: 'change', validator: validateName }],
        // time: [{ required: true, trigger: 'change', validator: validateTime }],
        type: [{ required: true, trigger: 'change', message: '请选择活动类型' }],
        detail: [{ required: true, trigger: 'change', validator: validateDetail }]
        // link: [{ required: true, trigger: 'change', validator: validateLink }]
      }
    }
  },
  computed: {
    ...mapState({
      form: state => state.activity.form,
      disabled: state => state.activity.disabled
    })
  },
  watch: {
    dialogVisible(newV, oldV) {
      if (newV === false) this.$refs.form.validateField('address')
    },
    form: {
      deep: true,
      handler() {
        if (this.form.detail) this.$refs.form.validateField('detail')
      }
    }
  },
  mounted() {
    // 表单校验
    Bus.$on('validFirst', () => {
      if (this.$refs.form) {
        this.$refs.form.validate(valid => {
          const obj = {
            key: 'base',
            value: valid
          }
          this.VALID_FIRST(obj)
        })
      }
    })
    // 清除校验
    Bus.$on('clearValidate', () => {
      this.$refs.form.clearValidate(['name', 'detail', 'type', 'link'])
    })
    Bus.$on('resetFields', () => {
      this.$refs.form.resetFields()
    })
  },
  methods: {
    ...mapMutations('activity', [
      'VALID_FIRST',
      'ACTIVITY_FORM'
    ]),
    updateForm(key, val, type) {
      this.ACTIVITY_FORM({ key, val, type })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form {
  z-index: 1000;
  .cascader-wrapper {
    width: 300px;
  }
}
.el-dialog__body{
  padding-top: 0;
}
/deep/ {
  .el-input input{
    text-align: left;
  }
  .el-textarea{
    max-width: 500px;
  }
}

</style>
