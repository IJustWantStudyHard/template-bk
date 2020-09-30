<template>
  <el-card class="box-card">
    <div>
      <div class="user">
        <img :src="agentInfo.avatar" class="avatar">
        <span class="name">{{ agentInfo.name }}</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="info">
            <div>
              <div>联系方式：</div>
              <div class="text">{{ agentInfo.phone }}</div>
            </div>
            <div>
              <div>联系地址：</div>
              <div class="text">{{ agentInfo.address }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <img :src="agentInfo.code" class="code">
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      // agentInfo: {
      //   name: '商州代理',
      //   phone: '404-41256478',
      //   code: 'http://img1.doubanio.com/view/note/large/public/p46201558.jpg',
      //   avatar: 'https://static.zwmstk.cn/WechatIMG690.png?imageView2/1/w/80/h/80',
      //   address: '河南省洛阳市西工区紫金城'
      // }
    }
  },
  computed: {
    ...mapState({
      agentInfo: state => state.user.agentInfo
    })
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
  .info{
    font-size: 16px;
    line-height: 25px;
    padding-left: 10px;
    .text{
      font-size: 18px;
      letter-spacing: 1px;
    }
    >div{
      margin-bottom: 15px;
    }
  }
  .code{
    width:100%;
    max-width: 150px;
  }
}
</style>
