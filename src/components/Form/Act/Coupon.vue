<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
      <tip title="卡劵配置" />
      <el-form-item label="是否开启红包卡劵" prop="is_card" class="activity-is_card">
        <el-switch
          v-model="form.is_card"
          :disabled="disabled"
          @change="updateForm('is_card', $event)"
        />
      </el-form-item>
      <template v-if="form.is_card">
        <el-form-item label="红包卡劵比例" prop="card_probability" class="activity-card_probability">
          <el-input-number v-model="form.card_probability" :min="1" :max="100" :step="1" step-strictly :disabled="disabled" :controls="false" clearable placeholder="请填写卡劵比例" @change="updateForm('card_probability', $event)" />
          <el-button type="primary" icon="el-icon-plus" :disabled="disabled" @click="addCard">红包卡券</el-button>
        </el-form-item>
        <div class="tip-font">开启卡劵后需要填写卡劵比例并添加1-5种卡劵。比如，卡劵比例为10，则在100个用户中会有10个用户分享后获得卡劵。</div>

        <el-form-item v-for="(card,i) in form.cards" :key="'cards'+i" :label="`红包卡券${i+1}: `" class="activity-cards">
          <el-col class="line text-center" :span="2">名称</el-col>
          <el-col :span="4">
            <el-select v-model="card.card_id" :disabled="disabled" filterable :placeholder="couponList.length===0?'暂无数据，请先创建卡券':'请选择卡券'">
              <el-option
                v-for="(item) in couponList"
                :key="'coupon'+i+item.id"
                :label="item.title"
                :value="item.id"
              >
                <span>{{ item.title }}({{ item.id }})</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col class="line text-center" :span="2">数量</el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input-number v-model="card.num" :step="1" step-strictly :min="1" :max="10000" :disabled="disabled" :controls="false" clearable style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col class="line text-center" :span="2"><el-button :disabled="disabled" type="danger" icon="el-icon-delete" circle @click="delCard(i)" /></el-col>
        </el-form-item>
        <el-form-item prop="cards" />

      </template>

      <el-form-item label="是否开启文章卡劵" prop="is_article_card" class="activity-is_article_card">
        <el-switch
          v-model="form.is_article_card"
          :disabled="disabled"
          @change="updateForm('is_article_card', $event)"
        />
      </el-form-item>

      <template v-if="form.is_article_card">
        <el-form-item label="文章卡券: " class="activity-article_card">
          <el-col class="line text-center" :span="2">名称</el-col>
          <el-col :span="4">
            <el-select v-model="form.article_card.card_id" :disabled="disabled" filterable :placeholder="couponList.length===0?'暂无数据，请先创建卡券':'请选择卡券'">
              <el-option
                v-for="(item) in couponList"
                :key="'articleCoupon'+item.id"
                :label="item.title"
                :value="item.id"
              >
                <span>{{ item.title }}({{ item.id }})</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col class="line text-center" :span="2">数量</el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input-number v-model="form.article_card.num" :step="1" step-strictly :min="1" :max="10000" :disabled="disabled" :controls="false" clearable style="width:100%" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="article_card" />

      </template>

    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Bus from '@/utils/bus'
import { apiBtn } from '@/api/default.js'

export default {
  data() {
    const validateCoupon = (rule, val, callback) => {
      if (this.form.is_card) {
        if (this.form.cards.length === 0) {
          callback(new Error('请添加卡劵'))
        } else if (!this.checkCard()) {
          callback(new Error('请检查卡劵信息，卡劵不能为空，红包卡劵不能重复'))
        } else if (!this.checkArtivelCard()) {
          callback(new Error('请检查卡劵信息，文章卡劵与红包卡劵不能重复'))
        } else callback()
      } else callback()
    }

    const validateArticleCoupon = (rule, val, callback) => {
      if (this.form.is_article_card) {
        if (!this.form.article_card.card_id || !this.form.article_card.num) {
          callback(new Error('请选择卡劵并填写卡劵数量'))
        } else if (!this.checkArtivelCard()) {
          callback(new Error('请检查卡劵信息，文章卡劵与红包卡劵不能重复'))
        } else callback()
      } else callback()
    }

    return {
      couponList: [], // 卡劵列表
      formRules: {
        is_card: [{ required: true, trigger: 'change' }],
        cards: [{ require: true, trigger: 'change', validator: validateCoupon }],
        is_article_card: [{ required: true, trigger: 'change' }],
        article_card: [{ require: true, trigger: 'change', validator: validateArticleCoupon }]
      }
    }
  },
  computed: {
    ...mapState({
      status: state => state.activity.status,
      form: state => state.activity.form,
      disabled: state => state.activity.disabled
    })
  },
  watch: {
    'form.is_card'(newV, oldV) {
      if (newV && this.couponList.length === 0) this.getCardList()
    },
    'form.is_article_card'(newV, oldV) {
      if (newV && this.couponList.length === 0) this.getCardList()
    },
    'form.cards': {
      deep: true,
      handler(newV, oldV) {
        this.$refs.form.validateField('cards')
        this.$refs.form.validateField('article_card')
      }
    },
    'form.article_card': {
      deep: true,
      handler(newV, oldV) {
        this.$refs.form.validateField('cards')
        this.$refs.form.validateField('article_card')
      }
    }
  },
  created() {
    if (this.form.is_card) this.getCardList()
  },
  mounted() {
    // 表单校验
    Bus.$on('validSecond', () => {
      if (this.$refs.form) {
        this.$refs.form.validate(valid => {
          const obj = {
            key: 'coupon',
            value: valid
          }
          this.VALID_SECOND(obj)
        })
      }
    })
  },
  methods: {
    ...mapMutations('activity', [
      'VALID_SECOND',
      'ACTIVITY_FORM'
    ]),
    updateForm(key, val) {
      this.ACTIVITY_FORM({ key: key, val: val })
    },
    // 获取卡劵列表
    getCardList() {
      if (this.couponList.length > 0) return
      apiBtn('CardIndex', { page: 1, size: 10000, status: 3 })
        .then((res) => {
          this.couponList = res.data.list
        })
    },
    // 添加红包卡劵
    addCard() {
      const cards = this.form.cards
      if (cards.length < 5) {
        cards.push({ card_id: '', num: 0, type: 1 })
        this.updateForm('cards', cards)
      } else this.$message.error('卡券最多添加5个')
    },
    // 校验某个卡劵卡劵是否在红包卡劵中已选
    checkCardRepeat(id) {
      var num = 0
      var repeat = false
      this.form.cards.map(item => {
        if (item.card_id === id) num++
        if (num > 1) {
          repeat = true
          return
        }
      })
      return repeat
    },
    // 删除卡券
    delCard(index) {
      var arr = this.form.cards
      arr.splice(index, 1)
      this.updateForm('cards', arr)
    },
    // 校验卡劵是否重复 返回true通过检查 false没有通过检查
    checkCard() {
      var res = true
      this.form.cards.map(item => {
        if (!item.card_id || !item.num) res = false
        else if (this.checkCardRepeat(item.card_id)) res = false
      })
      return res
    },
    // 检查文章卡劵是否与红包卡劵重复 返回true通过检查 false没有通过检查
    checkArtivelCard() {
      if (!this.form.article_card.card_id) return true
      const card = this.form.cards.map((item) => { return item.card_id })
      return !card.includes(this.form.article_card.card_id)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
    display: flex;
    position: relative;
    width: 100%;
}
.el-input, .el-input-number {
    width: 300px;
}
/deep/.activity-cards .el-input-number .el-input,/deep/.activity-article_card .el-input-number .el-input {
  width: inherit;
}
.el-form {
  z-index: 1000;
  .cascader-wrapper {
    width: 300px;
  }
}
.text-center {
  text-align: center;
}
</style>
