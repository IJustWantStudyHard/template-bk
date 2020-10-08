<template>
  <div class="app-container">
    <tip-card :data="tip" />
    <panel-group v-if="showPanel" :data="panel" />

    <el-row :gutter="20">
      <el-col :xs="24" :sm="showReview?24:12" :md="showReview?8:12">
        <el-row :gutter="20">
          <el-col :span="24">
            <box-card />
          </el-col>
        </el-row>
      </el-col>

      <template v-if="showReview">
        <el-col v-for="item in review" :key="item.type" :xs="24" :sm="12" :md="8">
          <el-row :gutter="20">
            <el-col :span="24">
              <panel-review :type="item.type" :data="item.data" />
            </el-col>
          </el-row>
        </el-col>
      </template>

      <el-col v-if="this.$store.getters.roles[0]!==1" :xs="24" :sm="12" :md="8">
        <el-row :gutter="20">
          <el-col :span="24">
            <manage-info />
          </el-col>
        </el-row>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { TipCard, BoxCard, PanelGroup, PanelReview, ManageInfo } from '@/components/Dashboard/index'

export default {
  name: 'Dashboard',
  components: {
    TipCard,
    BoxCard,
    PanelGroup,
    PanelReview,
    ManageInfo
  },
  data() {
    return {
      hackReset: true,
      show1: true,
      show3: true,
      show4: true,
      tip: [],
      panel: [],
      transform: {
        type: 'fold',
        fields: ['区域代理总数', '代理客户数量', '剩余客户总数'],
        key: 'city',
        value: 'temperature'
      },
      review: [{}, {}]
    }
  },
  computed: {
    // 管理员 运营 代理商 品牌代理商 会计 展示审核 （具体审核内容由后台传）
    showReview() {
      return '15678'.includes(this.$store.getters.roles[0])
    },
    showPanel() {
      if ('6'.indexOf(this.$store.getters.roles[0]) >= 0) {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    this.apiBtn('Dashboard').then((res) => {
      // 系统公告列表
      this.tip = res.data.tip
      this.panel = { ...res.data.panel }
      if (this.showReview) {
        this.review = []
        var act_review = { type: 1, data: [] }
        var user_review = { type: 2, data: [] }
        var cash_review = { type: 3, data: [] }
        // 活动审核 （管理员，运营，代理商 审核）
        if (res.data.act_review) {
          act_review.data = res.data.act_review
          this.review.push(act_review)
        }
        // 用户审核 （管理员，运营 审核）
        if (res.data.user_review) {
          user_review.data = res.data.user_review
          this.review.push(user_review)
        }
        // 提现审核 （会计审核）
        if (res.data.cash_review) {
          cash_review.data = res.data.cash_review
          this.review.push(cash_review)
        }
      }
    })
  },
  mounted() {
    // 监听window的resize事件．用于组件强制重新加载，防止饼状图上文字位置错误
    window.onresize = () => {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 20px;
  }
  .el-card {
    margin-bottom: 20px;
  }
}
</style>
