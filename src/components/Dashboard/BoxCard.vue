<template>
  <el-card class="box-card">
    <div class="user">
      <img :src="avatar" class="avatar">
      <span class="name">{{ name }}</span>
    </div>

    <div v-if="showAccount || roles[0] === 7" class="account-box">
      <p v-if="showAccount">
        <span>{{ accountBalance }}</span>
        <span>余额（元）</span>
      </p>
      <p v-if="roles[0] === 7">
        <span>{{ $store.state.user.ready }}</span>
        <span>开通账号</span>
      </p>
      <p v-if="roles[0] === 7">
        <span>{{ $store.state.user.account - $store.state.user.ready }}</span>
        <span>剩余账号</span>
      </p>
    </div>
    <div class="action">
      <el-button v-has="'ActivityStore'" class="btn" type="primary" @click="toRedirect('ActivityStore')">创建活动</el-button>
      <el-button v-has="'PaymentOrder'" class="btn" type="primary" @click="toRedirect('PaymentStore')">充值</el-button>
      <el-button v-show="showAccount" v-has="'CashStore'" class="btn" type="primary" @click="toRedirect('CashStore')">提现</el-button>
    </div>
    <div class="time">上次登录时间：{{ lastLoginTime| parseTime() }}</div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'accountBalance',
      'lastLoginTime'
    ]),
    showAccount() {
      return !'156'.includes(this.roles[0])
    }
  },
  created() {
    // 更新用户信息
    if (this.showAccount) this.$store.dispatch('user/GetAccountBalance')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
/deep/ .el-card__body{
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px 32px;
}
.box-card {
  height: 290px;
  .user {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
    color: $mainColor;
    font-size: $fontSizeExtraLarge;

    .avatar {
      display: block;
      width: 50px;
      height: 50px;
      margin-right: 12px;
      border-radius: 50%;
    }
  }

  .account-box {
    display: flex;
    justify-content: space-around;
    font-size: 14px;
    background-color: #f8f8f8;
    padding: 12px 0;

    p {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 8px 0;
      line-height: 25px;

      span {
        &:first-child{
          font-size: $fontSizeLarge;
          font-weight: 600;
        }
      }
    }
  }

  .action {
    margin: 15px 0;
    display: flex;
    justify-content: center;
    .btn {
      width: 50%;
      border-radius: 0px;
      padding: 13px 20px;
      margin: 0;
      letter-spacing: 1px;
      font-size: $fontSizeMedium;
      &:not(:first-child){
        margin-left: 5%;
      }
    }
  }
  .time {
    margin: 10px 0 0;
    text-align: center;
    font-size: 10px;
    color: $fontColorAide;
  }
}
</style>
