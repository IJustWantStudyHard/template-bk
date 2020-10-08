<template>
  <div class="app-container">
    <el-card
      v-for="(value,key) in statusList"
      v-show="data.cash.status==key"
      :key="key"
      class="card-status"
    >
      <div class="cash-status">
        <svg-icon :icon-class="value.icon" :class="value.icon" />
        <div class="words" v-html="value.html" />
      </div>
      <el-button circle icon="el-icon-back" @click="goBack" />
    </el-card>
    <el-card>
      <div v-for="(list,i) in info" :key="i" class="cash-list">
        <div v-for="(item,j) in list" :key="j" class="cash-item">
          {{ item.label }}：
          <span :class="item.red?'red':''">{{ data[i?'user':'cash'][item.name] }}</span>
        </div>
      </div>
    </el-card>
    <div class="btn-box">
      <template v-has="'CashPatch'">
        <el-button v-show="showReview(data.cash.status)" type="primary" @click="review(2)">审核通过</el-button>
        <el-button v-show="showReview(data.cash.status)" type="danger" @click="review(3)">驳回审核</el-button>
      </template>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      data: {
        cash: {
          id: 1,
          status: 1,
          type: '微信提现',
          money: '',
          cash_money: '',
          service_charge: '',
          name: '',
          phone: '',
          wechat: '',
          add_time: '',
          out_trade_no: '',
          re_user_name: '',
          reason: ''
        },
        user: {
          id: 1,
          username: '',
          remark: '',
          balance: '',
          name: '',
          phone: '',
          two_name: '',
          two_phone: ''
        }
      },
      info: [
        [
          {
            label: '提现类型',
            name: 'type'
          },
          {
            label: '手机电话',
            name: 'phone'
          },
          {
            label: '真实姓名',
            name: 'name'
          },
          {
            label: '提现金额',
            name: 'money',
            red: true
          },
          {
            label: '提现费用',
            name: 'service_charge',
            red: true
          },
          {
            label: '预计到账',
            name: 'cash_money',
            red: true
          },
          {
            label: '微信号',
            name: 'wechat'
          },
          {
            label: '提交时间',
            name: 'add_time'
          }],
        [
          {
            label: '用户ID',
            name: 'id'
          },
          {
            label: '用户名',
            name: 'username'
          },
          {
            label: '用户备注',
            name: 'remark'
          },
          {
            label: '余额',
            name: 'balance'
          }],
        [
          {
            label: '负责人姓名',
            name: 'name'
          },
          {
            label: '负责人电话',
            name: 'phone'
          },
          {
            label: '紧急联系人姓名',
            name: 'two_name'
          },
          {
            label: '紧急联系人电话',
            name: 'two_phone'
          }]
      ],
      statusList: {
        '1': {
          icon: 'review',
          html: '审核中<div class="tip-font">审核时间：两个工作日，审核流程：审核员将会致电预留信息电话确认，审核通过后提现至绑定的微信号 ，审核员电话：0379-60201582</div>'
        },
        '2': {
          icon: 'success',
          html: '审核通过（订单号：）'
        },
        '3': {
          icon: 'reject',
          html: '已驳回'
        },
        '4': {
          icon: 'reject',
          html: '撤回'
        },
        '5': {
          icon: 'reject',
          html: '失败'
        }
      },
      typeOptions: {
        1: '微信提现'
      }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 是否展示审核
    showReview(status) {
      return '156'.includes(this.$store.getters.roles[0]) && status === 1
    },
    getInfo() {
      this.apiBtn('CashShow', { id: this.$route.query.id }).then((res) => {
        res.data.cash.type = this.typeOptions[res.data.cash.type]
        res.data.cash.add_time = this.parseTime(res.data.cash.add_time)
        this.data = res.data
        this.statusList[2].html = '审核通过（订单号：' + res.data.cash.out_trade_no + '）'
        if (this.data.cash.reason) this.statusList[5].html = '失败<div class="tip-font">（失败原因：' + res.data.cash.reason + '）</div>'
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    review(status) {
      var obj = {
        2: '通过审核(通过审核后自动提现到微信零钱)',
        3: '驳回审核'
      }
      this.defalultConfirm(obj[status], () => {
        this.apiBtn('CashPatch', { id: this.data.cash.id, status })
          .then((res) => {
            this.data.cash.status = res.data.status
          }).catch((res) => {
            if (res && res.data.status) this.data.cash.status = res.data.status
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/variables.scss";
.card-status {
  margin-bottom: 20px;
  .cash-status {
    display: flex;
    align-items: center;
    font-size: $fontSizeExtraLarge;
    font-weight: bold;
    .words {
      display: flex;
      align-items: center;
      /deep/ .tip-font {
        max-width: 72%;
        margin-bottom: 0;
        margin-left: 5px;
        color: $ColorDanger;
      }
      @media screen and (max-width: 1000px) {
          /deep/ .tip-font{
            margin-left: 0;
          }
      }
    }
    .svg-icon {
      margin-right: 5px;
    }
    .success,
    .reject {
      font-size: 40px;
      color: $ColorSuccess;
    }
    .reject{
      color: $ColorDanger;
    }
    .review {
      font-size: 40px;
      padding: 8px;
      background: $ColorWarning;
      border-radius: 50%;
      color: #fff;
    }
  }
  /deep/ .el-card__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.cash-list {
  display: flex;
  flex-wrap: wrap;
  line-height: 30px;
  font-size: $fontSizeExtraSmall;
  padding: 10px;
  &:not(:last-child) {
    border-bottom: 1px dashed #dcdfe6;
  }
  .cash-item {
    width: 33.3%;
    .red {
      color: $ColorDanger;
    }
  }
}

.btn-box {
  text-align: center;
  margin: 50px 0;
}
</style>
