<template>
  <div class="app-container">
    <el-alert v-if="form.reason&& status===3" :title="'驳回原因：' + form.reason" type="warning" center show-icon />
    <el-card class="box-card">
      <template #header>
        <div>{{ showReview ? '审核活动' : '编辑活动' }}</div>
      </template>
      <activity-base />
      <share />
      <red />
      <coupon v-if="showCoupon" />
      <else />

      <div class="btn-box">
        <template v-has="'ActivityPatch'">
          <el-button v-show="showReview" type="primary" @click="review(2)">审核通过</el-button>
          <el-button v-show="showReview" @click="review(3)">驳回审核</el-button>
        </template>
        <template v-has="'ActivityUpdate'">
          <el-button v-show="showEdit" type="primary" @click="editor">修改</el-button>
          <el-button v-show="!showReview" @click="cancel">取消</el-button>
        </template>
      </div>
    </el-card>
    <!-- 导航目录 -->
    <directory />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Bus from '@/utils/bus'

import { ActivityBase, Share, Red, Else, Directory, Coupon } from '@/components/Form/Act/index'

export default {
  components: { ActivityBase, Share, Red, Else, Directory, Coupon },
  data() {
    return {
      id: this.$route.query.id
    }
  },
  computed: {
    ...mapState({
      status: state => state.activity.status,
      form: state => state.activity.form,
      valid: state => state.activity.formValid,
      is_open_card: state => state.user.is_open_card
    }),
    // 是否是审核
    showReview: function() {
      return this.status === 1
    },
    showEdit() {
      return '234'.indexOf(this.status) >= 0
    },
    showCoupon() {
      return !this.form.is_fans && (this.is_open_card || (this.form.is_card && this.form.cards.length > 0))
    }
  },
  created() {
    this.INIT_FORM('') // 在请求未完成时，初始化表单
    this.getDetail()
  },
  mounted() {
    if (this.status === 1) this.getQnToken()
  },
  destroyed() {
    // 退出后重置store.activity数据，避免数据错误
    this.INIT_FORM()
  },
  methods: {
    ...mapMutations('activity', [
      'ACTIVITY_STATUS',
      'ACTIVITY_DISABLED',
      'INIT_FORM'
    ]),
    ...mapActions('activity', [
      'UpdateActivity'
    ]),
    // 获取活动详情
    getDetail() {
      this.apiBtn('ActivityShow', { id: this.id })
        .then(res => {
          this.INIT_FORM(res.data)
          this.ACTIVITY_STATUS(res.data.status)
          if (res.data.status === 1) this.ACTIVITY_DISABLED(true)
          else this.ACTIVITY_DISABLED(false)
        })
    },
    cancel() {
      this.$router.go(-1)
    },
    // 审核
    review(status) {
      const obj = {
        2: { topic: '确认要通过该活动吗？' },
        3: { topic: '确认要驳回该活动吗？' }
      }
      if (status === 2) {
        this.$confirm(obj[status].topic, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: this.id,
            status: status
          }
          this.reviewPatch(params)
        })
      } else {
        this.$prompt('请输入驳回原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4e00-\u9fffa-zA-Z]{5,20}$/,
          inputErrorMessage: '驳回原因不能为空，输入5-20个字符'
        }).then(({ value }) => {
          const params = {
            id: this.id,
            status: status,
            reason: value
          }
          this.reviewPatch(params)
        }).catch(err => { // 必须解决catch
          console.log(err)
        })
      }
    },
    reviewPatch(params) {
      this.apiBtn('ActivityPatch', params)
        .then(res => {
          if (!res.status) {
            this.$router.go(-1)
          }
        })
    },
    // 修改活动内容
    editor() {
      this.validFirst()
      this.validSecond()
      const first = JSON.stringify(this.valid.first)
      const second = JSON.stringify(this.valid.second)
      if (first.indexOf('false') < 0 && second.indexOf('false') < 0) {
        this.$confirm('确认修改该活动？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.UpdateActivity(this.id)
            .then(res => {
              this.$router.go(-1)
            })
        })
      } else {
        this.$message({
          type: 'error',
          message: '请检查是否有错误信息'
        })
        document.documentElement.scrollTop = 0
      }
    },
    // 提交表单，获取校验结果
    validFirst() {
      Bus.$emit('validFirst')
    },
    validSecond() {
      Bus.$emit('validSecond')
    },
    // 获取七牛token
    getQnToken() {
      const config = this.$store.state.config
      if (!config.imgToken || !config.audioToken) {
        this.$store.dispatch('config/GetQiniuToken', { other: true })
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.el-alert--warning {
  background-color: #fff;
  margin-bottom: 20px;
  /deep/ .el-alert__title {
    font-size: 15px;
    line-height: 35px;
  }
}
.btn-box{
  margin-left: 251px;
}
/deep/ .tip-font {
  margin-left: 251px;
}
@media screen and (max-width: 1000px) {
    /deep/ .tip-font{
      margin-left: 0;
    }
}
</style>
