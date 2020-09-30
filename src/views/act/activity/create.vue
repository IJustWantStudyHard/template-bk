<template>
  <div class="app-container">
    <el-card class="box-card">
      <template #header>
        <el-steps :active="activity.stepActive" finish-status="process" process-status="finish" simple style="margin-top: 20px">
          <el-step title="活动设置" />
          <el-step title="相关设置" />
          <el-step title="审核状态" />
        </el-steps>
      </template>
      <div class="content">
        <el-button
          v-if="activity.stepActive < 2"
          class="guide"
          size="small"
          type="success"
          icon="el-icon-question"
          @click.prevent.stop="startGuide"
        >引导</el-button>

        <template v-if="activity.stepActive === 0">
          <activity-base />
          <share />
        </template>
        <template v-else-if="activity.stepActive === 1">
          <red />
          <coupon v-if="showCoupon" />
          <else />
        </template>
        <success v-else />

        <div class="submit-btn">
          <el-button v-if="activity.stepActive === 1" type="primary" @click="lastStep">上一步</el-button>
          <el-button v-if="activity.stepActive < 2" type="primary" @click="nextStep">
            <span v-if="!activity.stepActive">下一步</span>
            <span v-else>提交审核</span>
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ActivityBase, Share, Red, Else, Coupon, Success } from '@/components/Form/Act/index'
import Bus from '@/utils/bus'
import { setActivityStorage, getActivityStorage, removeActivityStorage } from '@/utils/storage'
import { mapState, mapMutations, mapActions } from 'vuex'
// Driver Guide mapMutations
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css' // import driver.js css
import { stepFirst, stepSecond } from './guide/defineSteps'

export default {
  components: { ActivityBase, Share, Red, Else, Coupon, Success },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      activity: state => state.activity,
      form: state => state.activity.form,
      is_open_card: state => state.user.is_open_card
    }),
    showCoupon() {
      return !this.form.is_fans && (this.is_open_card || (this.form.is_card && this.form.cards.length > 0))
    }
  },
  watch: {
    'activity.form': {
      deep: true,
      handler() {
        setActivityStorage(this.activity.form)
      }
    }
  },
  created() {
    this.lastEditor()
    this.ACTIVITY_STATUS(0)
  },
  mounted() {
    this.getQnToken()
    this.driver = new Driver({
      allowClose: false, // 是否禁止外部点击关闭driver
      closeBtnText: '关闭',
      prevBtnText: '上一步',
      nextBtnText: '下一步',
      doneBtnText: '结束'
    })
    this.ACTIVITY_DISABLED(false)
  },
  destroyed() {
    this.INIT_FORM()
  },
  methods: {
    ...mapMutations('activity', [
      'STEP_ACTIVE',
      'ACTIVITY_DISABLED',
      'ACTIVITY_STATUS',
      'INIT_FORM'
    ]),
    ...mapActions('activity', [
      'CreateActivity'
    ]),
    // 打开引导
    startGuide() {
      const arr = [stepFirst, stepSecond]
      const step = this.activity.stepActive
      this.driver.defineSteps(arr[step])
      this.driver.start()
    },
    lastStep() {
      this.STEP_ACTIVE(0)
      this.scrollToTop()
    },
    nextStep() {
      const step = this.activity.stepActive
      if (step === 0) {
        this.validFirst()
        if (JSON.stringify(this.activity.formValid.first).indexOf('false') < 0) {
          this.STEP_ACTIVE(1)
        }
      }
      if (step === 1) {
        this.validSecond()
        if (JSON.stringify(this.activity.formValid.second).indexOf('false') < 0) {
          this.create()
        }
      }
      this.scrollToTop()
    },
    // 创建活动
    create() {
      this.$alert('确定提交此活动？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        showClose: false,
        callback: action => {
          if (action === 'confirm') {
            this.CreateActivity()
              .then(res => {
                if (res.data.status === 1) {
                  // TODO: 清除TinyMce的缓存
                  removeActivityStorage()
                  this.STEP_ACTIVE(2)
                } else {
                  this.$message({
                    type: 'warning',
                    message: res.message
                  })
                }
              })
          }
        }
      })
    },
    // 查询用户是否有未完成编辑
    lastEditor() {
      const form = getActivityStorage()
      if (form && JSON.stringify(form) !== JSON.stringify(this.activity.form)) {
        this.$alert('检测到上次编辑未完成，是否继续上次编辑？', '提示', {
          showClose: false,
          showCancelButton: true,
          cancelButtonText: '重新开始',
          confirmButtonText: '继续编辑',
          callback: action => {
            const obj = action === 'confirm' ? form : ''
            this.INIT_FORM(obj)
            setTimeout(() => {
              Bus.$emit('clearValidate')
            }, 500)
            this.STEP_ACTIVE(0)
            removeActivityStorage()
          }
        })
      }
    },
    // 提交表单，获取校验结果
    validFirst() {
      Bus.$emit('validFirst')
    },
    validSecond() {
      Bus.$emit('validSecond')
    },
    // 返回顶部
    scrollToTop() {
      document.getElementsByClassName('app-main')[0].scrollTop = 0
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
.el-steps {
  margin-top: 20px;
}
.guide {
  position: absolute;
  top: 160px;
  right: 60px;
  z-index: 1;
}
/deep/ .tip-font {
  margin-left: 251px;
}
@media screen and (max-width: 1000px) {
    /deep/ .tip-font{
      margin-left: 0;
    }
}
.submit-btn {
  margin-left: 251px;
}
</style>
