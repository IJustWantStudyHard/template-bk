<template>
  <el-form ref="form" :rules="rulesForm" :model="form" :label-position="$store.state.app.labelPosition" label-width="251px">
    <tip title="修改密码" />
    <el-form-item label="当前密码" prop="cupassword">
      <el-input
        v-model="form.cupassword"
        autocomplete="off"
        type="password"
        show-password
        placeholder="密码长度8-16位包含数字和字母"
      />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input
        v-model="form.password"
        autocomplete="off"
        type="password"
        show-password
        placeholder="新密码和当前密码不能相同"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="repassword">
      <el-input
        v-model="form.repassword"
        autocomplete="off"
        type="password"
        show-password
        placeholder="确认密码和新密码保存一致"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { validatPwdEasy } from '@/utils/validate.js'
export default {
  props: {
    form: {
      type: Object,
      default() {
        return {
          cupassword: '',
          password: '',
          repassword: ''
        }
      }
    }
  },
  data() {
    var validatCupassword = (rule, value, callback) => {
      if (value === this.form.password) {
        callback(
          new Error('新密码和当前密码不能相同')
        )
      } else {
        callback()
      }
    }
    var validatPassword = (rule, value, callback) => {
      if (value === this.form.cupassword) {
        callback(
          new Error('新密码和当前密码不能相同')
        )
      } else if (!validatPwdEasy(value)) {
        callback(
          new Error('密码至少包含字母，数字，且不少于8位')
        )
      } else {
        if (this.form.repassword !== '') {
          this.$refs.form.validateField('repassword')
        }
        callback()
      }
    }

    var validatRepassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(
          new Error('两次输入密码不一致')
        )
      } else {
        callback()
      }
    }
    return {
      rulesForm: {
        cupassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
          { validator: validatCupassword, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatPassword, trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatRepassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validateForm: function() {
      var result = false
      this.$refs['form'].validate(valid => {
        result = valid
      })
      return result
    },
    clearValidate: function() {
      this.$refs.form.clearValidate()
    }
  }
}
</script>
