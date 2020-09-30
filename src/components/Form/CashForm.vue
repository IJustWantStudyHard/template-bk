<template>
  <div>
    <el-form ref="form" :rules="rulesForm" :model="form" :label-position="$store.state.app.labelPosition" label-width="251px">
      <el-form-item label="剩余金额">{{ accountBalance }}元</el-form-item>
      <el-form-item label="提现金额" prop="money">
        <el-input-number
          v-model="form.money"
          :min="0"
          :max="accountBalance"
          :precision="2"
          :controls="false"
          placeholder="请输入提现金额"
        />
      </el-form-item>
      <div style="margin-left:251px;">
        <p class="tip-font">* 每笔提现金额最低1元，最高5000元，提现手续费为1%。（注：手续费会根据微信提现规则进行调整）</p>
      </div>
      <el-form-item label="提现方式" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">微信</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择微信号" prop="wx_id">
        <el-select v-model="form.wx_id" filterable default-first-option placeholder="请选择微信号">
          <el-option
            v-for="item in options"
            :key="item.id"
            :value="item.id"
            :label="item.nick_name"
            class="wechat-option"
          >
            <img :src="item.avatar" class="avatar" alt>
            {{ item.nick_name }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入微信认证姓名" />
      </el-form-item>
      <div style="margin-left:251px;">
        <p class="tip-font">* 请输入微信实名认证姓名。</p>
      </div>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" autocomplete="off" placeholder="电话" maxlength="11" />
      </el-form-item>
      <el-form-item label="微信号" prop="wechat">
        <el-input v-model="form.wechat" autocomplete="off" placeholder="微信号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handelClick">提交申请</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :fullscreen="$store.state.app.device === 'mobile' ? true : false" title="扫码授权" width="300px">
      <div class="code-box">
        <canvas id="code" />
        请扫描二维码进行微信授权,授权成功后重新发起提现申请。
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { validatePhone } from '@/utils/validate'
import { apiBtn } from '@/api/default'
import QRCode from 'qrcode'

export default {
  data() {
    const vPhone = (rule, value, callback) => {
      if (!validatePhone(value)) {
        callback(new Error('请输入正确的电话'))
      } else {
        callback()
      }
    }

    const vMoney = (rule, value, callback) => {
      if (value < 1 || value > 5000) {
        callback(new Error('提现金额最低1元，最高5000元每笔'))
      } else {
        callback()
      }
    }

    return {
      rulesForm: {
        money: [
          { required: true, message: '请填写提现金额', trigger: 'blur' },
          { validator: vMoney, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择提现方式', trigger: 'change' }
        ],
        wx_id: [
          { required: true, message: '请选择微信号', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: vPhone, trigger: 'blur' }
        ],
        wechat: [
          { required: true, message: '请输入微信号', trigger: 'blur' }
        ]
      },
      options: [{
        avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/X7xeLgJB1ZGhib6FGL8AT5TyGib6FKw4Cvty8v9VAKTooqJTAhDHlHUAMa2rYDvV8MrpPOpExbzf0VibkePM0Cia2Q/132',
        nick_name: '微信1',
        id: '123456'
      }],
      accountBalance: this.$store.getters.accountBalance - 0,
      form: {
        type: 1,
        money: '',
        name: '',
        phone: '',
        wechat: '',
        wx_id: ''
      },
      dialogVisible: false
    }
  },
  created() {
    this.getWxList()
    this.getBalance()
  },
  methods: {
    // 获取余额
    getBalance() {
      this.$store.dispatch('user/GetAccountBalance')
        .then(() => {
          this.form.money = this.accountBalance > 5000 ? 5000 : this.accountBalance
        })
    },
    getWxList() {
      apiBtn('WxCash')
        .then((res) => {
          if (res.data.length === 0) {
            this.$message('您还未绑定微信号，请先绑定微信号，再提现')
            this.$router.push('/user/wx')
          }
          this.options = res.data
        })
    },
    handelClick: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          apiBtn('CashStore', { ...this.form })
            .then((res) => {
              this.$router.go(-1)
              this.getBalance()
            }).catch(res => {
              // 用户未曾授权 需要手机登录授权
              if (res && res.code === 710002) {
                this.dialogVisible = true
                this.getQrcode(res.data.url)
              }
            })
        }
      })
    },
    clearValidate: function() {
      this.$refs.form.clearValidate()
    },
    // 生成二维码
    getQrcode(url) {
      setTimeout(() => {
        var canvas = document.getElementById('code')
        QRCode.toCanvas(canvas, url, (error) => {
          if (error) console.error(error)
        })
      }, 10)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left !important;
}
.wechat-option {
  display: flex;
  margin: 5px 0;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
.code-box {
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>

