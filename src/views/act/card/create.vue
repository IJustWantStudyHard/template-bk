<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <div>
            <el-steps
              :active="active"
              finish-status="process"
              process-status="finish"
              simple
              style="margin-top: 20px"
            >
              <el-step title="卡劵商户信息" />
              <el-step title="卡劵基础信息" />
              <!-- <el-step title="卡券高级信息(非必填)" /> -->
            </el-steps>
            <div class="form-step">
              <div v-show="active===0" class="form-step0">
                <merchant-form
                  ref="merchantChild"
                  :merchant-info="card"
                  @updateLogoURLParent="updateLogoURLParent"
                />
              </div>
              <div v-show="active===1" class="form-step1">
                <card-sample ref="cardSample" :data="card" @changeTime="changeTime" />
                <else-form ref="elseChild" :advanced-info="card" />
              </div>
              <div v-show="active===2" class="form-step3">
                <el-row class="success-msg">
                  <i class="el-icon-success" />&nbsp;&nbsp;卡劵已提交
                </el-row>
              </div>
              <div v-show="active!==2" class="step-action">
                <el-button v-show="active!==0" @click="prev">上一步</el-button>
                <el-button type="primary" :disabled="disabledBtn" @click="next">{{ active!==1?'下一步':'提交' }}</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { MerchantForm, CardSample, elseForm } from '@/components/Form/Card/index.js'

export default {
  // 组件被渲染前
  name: 'CardCreate',
  components: {
    MerchantForm, CardSample, elseForm
  },
  data() {
    return {
      active: 0,
      card: {
        logo_local_url: '',
        // 卡券的商户logo，建议像素为300*300
        logo_url: '',
        // 商户名字（填写直接提供服务的商户名 ，第三方商户名填写在source字段）
        brand_name: '',
        // 必填 卡劵名称
        title: '',
        // 必填 卡劵背景颜色
        color: '',
        // 必填 卡券使用说明，字数上限为1024个汉字。
        description: '',
        timestamp: [],
        // 必填 起用时间
        begin_timestamp: '',
        // 必填 表示 ， 建议设置为截止日期的23:59:59过期 。
        end_timestamp: '',
        // 客服电话。
        service_phone: '',
        // 能否与其他优惠券共享 0-不能，1-可以
        can_use_with_other_discount: 1,
        // 商家服务类型
        business_service: [],
        // 优惠券专用，填写优惠详情。
        default_detail: '',

        // 卡券类型,1-团购券，2-代金券，3-折扣券，4-兑换券，5-优惠券
        type: 5,
        // 使用时间的类型,1-固定时间，2-几天后生效
        date_type: 1,
        // 每人可领券的数量限制,不填写默认为50
        get_limit: 10,
        // 是否加入微信卡包，0：不加入，1：加入
        is_wx_card: 1
      },
      disabledBtn: false
    }
  },
  methods: {
    prev() {
      if (this.active > 0) this.active--
    },
    next() {
      this.disabledBtn = true
      switch (this.active) {
        case 0:
          // 判断图片是否上传
          if (this.$refs.merchantChild.validateForm()) this.active++
          this.disabledBtn = false
          break
        case 1:
          // 判断基础字段是否填写完整
          if (this.$refs.cardSample.validateForm() & this.$refs.cardSample.validateForm()) {
            this.card.begin_timestamp = this.card.timestamp[0]
            this.card.end_timestamp = this.card.timestamp[1]
            this.apiBtn('CardStore', this.card)
              .then((res) => {
                this.active = 2
                setTimeout(() => {
                  this.$router.push({ path: '/act/card' })
                }, 1000)
              }).catch(() => {
                this.disabledBtn = false
              })
          } else this.disabledBtn = false
          break
      }
    },
    updateLogoURLParent(data) {
      this.card.logo_url = data.url
      this.card.logo_local_url = data.path
    },
    changeTime(val) {
      this.card.timestamp = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "@/styles/variables.scss";
.box-card {
  margin-bottom: 30px;
  padding: 15px 20px;
  .form-step {
    margin: 20px 0;
    .form-step0 {
      text-align: center;
    }
    .form-step3 {
      margin: 50px;
      text-align: center;
      .success-msg {
        font-weight: bold;
        color: $ColorSuccess;
        font-size: $fontSizeExtraLarge;
        line-height: 40px;
        letter-spacing: 1px;
      }
    }
    .step-action {
      text-align: center;
      margin-top: 20px;
    }
  }
  .title-border {
    border-left: 5px solid $mainColor;
    padding-left: 10px;
  }
  .el-collapse-item__arrow {
    line-height: 28px;
  }
  .el-collapse-item__header {
    line-height: 28px;
    padding: 10px 0;
  }
  .el-step__head.is-success,
  .el-step__title.is-success {
    color: $mainColor;
    border-color: $mainColor;
  }
}
</style>
