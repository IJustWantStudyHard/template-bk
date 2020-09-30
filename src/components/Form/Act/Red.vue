<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
      <tip id="redDetail" title="红包配置" />

      <el-form-item label="红包领取模式" prop="activity_type" class="activity-activity_type">
        <el-radio-group v-model="form.activity_type" :disabled="disabledType" @change="updateForm('activity_type', $event)">
          <el-radio :label="1">分享朋友圈直接到账</el-radio>
          <el-radio :label="2">推广赚钱（分享好友赚钱）</el-radio>
          <el-radio v-show="form.activity_type===3" :label="3">分享朋友圈赚钱+推广赚钱（分享好友赚钱）</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="tip-font">红包领取模式在审核成功后将不能修改。</div>

      <div v-show="form.activity_type !=1">
        <el-form-item label="分享单个好友获得金额" prop="share_money" class="activity-share_money">
          <el-input-number v-model="form.share_money" :step="1" :min="0.1" :precision="2" :max="1" :disabled="disabled" :controls="false" clearable style="width:100%" @change="updateForm('share_num', $event)" />
        </el-form-item>
        <div class="tip-font">1.用户通过推广赚钱参与同一活动，赚取金额上限：系统默认为10元。2.分享单个好友获得金额:0.1~1。</div>
      </div>

      <el-form-item v-if="isAuth" label="是否吸粉" prop="is_fans" class="activity-is_fans">
        <el-switch
          v-model="form.is_fans"
          :disabled="disabled||!is_authorization"
          :active-value="1"
          :inactive-value="0"
          @change="updateForm('is_fans', $event)"
        />
      </el-form-item>
      <div v-if="isAuth" class="tip-font">
        1.开启后，用户分享朋友圈后需要先关注公众号才可以领取到红包。
        2.开启后，不可使用卡劵功能。
        <span v-show="!is_authorization">3. 用户开启授权成功后才可以使用吸粉功能。<el-button type="text" @click="toRedirect('UserInfo')">去授权</el-button></span>
      </div>

      <div v-show="form.activity_type!=2">
        <el-form-item label="红包领取次数" prop="get_type" class="activity-get_type">
          <el-radio-group v-model="form.get_type" :disabled="disabled" @change="updateForm('get_type', $event)">
            <el-radio :label="1">每人只能领一次</el-radio>
            <el-radio :label="2">每人每天领取一次</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="form.get_type === 2" label="红包领取次数上限" prop="get_type" class="activity-get_type">
          <el-input-number v-model="form.get_limit" :precision="0" :step="0.1" :min="1" :max="5" :disabled="disabled" :controls="false" clearable style="width:100%" @change="updateForm('get_limit', $event)" />
        </el-form-item>

        <el-form-item label="红包模式" prop="redpacket_type" class="activity-redpacket_type">
          <el-radio-group v-model="form.redpacket_type" :disabled="disabled" @change="updateForm('redpacket_type', $event)">
            <el-radio :label="1">随机模式</el-radio>
            <el-radio :label="2">等额模式</el-radio>
          </el-radio-group>
          <el-button v-if="showActionBtn" v-show="form.redpacket_type===2" type="primary" icon="el-icon-plus" class="icon-add" circle @click="addSingle" />
        </el-form-item>

        <el-form-item v-show="form.redpacket_type===1" label="随机最小金额" prop="min_redpacket">
          <el-input-number v-model="form.min_redpacket" :precision="2" :step="0.1" :min="0.3" :max="5" :disabled="disabled" :controls="false" clearable @change="updateForm('min_redpacket', $event)" />
        </el-form-item>

        <el-form-item v-show="form.redpacket_type===1" label="随机最大金额" prop="max_redpacket">
          <el-input-number v-model="form.max_redpacket" :precision="2" :step="0.1" :min="0.3" :max="5" :disabled="disabled" :controls="false" clearable @change="updateForm('max_redpacket', $event)" />
        </el-form-item>

        <el-form-item v-for="(item,index) in form.single_money" v-show="form.redpacket_type===2" :key="'single_money'+index" :label="`等额模式${index+1}: `" class="single_money" required>
          <el-col class="line text-center" :span="2">金额</el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input-number v-model="form.single_money[index].money" :precision="2" :step="0.1" :min="0.3" :max="5" :disabled="disabled" :controls="false" clearable style="width:100%" @change="updateForm('min_redpacket', $event)" />
            </el-form-item>
          </el-col>
          <el-col class="line text-center" :span="2">概率</el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input-number v-model="form.single_money[index].rate" :step="1" step-strictly :min="1" :max="100" :disabled="disabled" :controls="false" clearable style="width:100%" @change="updateForm('min_redpacket', $event)" />
            </el-form-item>
          </el-col>
          <el-col class="line text-center" :span="2"><el-button v-if="showActionBtn" type="danger" icon="el-icon-delete" circle @click="delSingle(index)" /></el-col>
        </el-form-item>
        <!-- 仅用于校验single_money-->
        <el-form-item v-if="form.redpacket_type===2" prop="single_money" />

        <el-form-item label="是否开启点击赚钱" prop="is_click" class="activity-is_music">
          <el-switch
            v-model="form.is_click"
            :disabled="disabled"
            :active-value="1"
            :inactive-value="0"
            @change="updateForm('is_click', $event)"
          />
        </el-form-item>
        <div class="tip-font">开启后，好友每次点击获得0.1元，最高10元</div>
      </div>

      <!-- <el-form-item label="红包领取流程" prop="redpacket_process" class="activity-redpacket_process">
        <el-radio-group v-model="form.redpacket_process" :disabled="disabled" @change="updateForm('redpacket_process', $event)">
          <el-radio :label="1">分享朋友圈直接到账</el-radio>
          <el-radio :label="2">分享朋友圈再点击文章到账</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <!-- <el-form-item label="预计红包总额" class="activity-total_money">
        <el-input v-model="total_money" :disabled="true" clearable placeholder="预计红包总金额" />
      </el-form-item> -->
      <!-- <el-form-item label="红包数量" prop="num" class="activity-num">
        <el-input-number v-model="form.num" :min="1" :max="5000" :step="1" step-strictly :disabled="!('03'.indexOf(status) >= 0)" :controls="false" clearable placeholder="请填写红包数量" @change="updateForm('num', $event)" />
      </el-form-item> -->

      <!-- <el-form-item v-show="form.redpacket_type===2" label="金额（￥）" prop="single_money">
        <el-select
          v-model="form.single_money"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择金额或输入金额后按回车"
          @change="singleHandle"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->

      <template>
        <el-form-item label="地区选择类型" prop="area_type" class="activity-area_type">
          <el-radio-group v-model="form.area_type" :disabled="disabled" @change="updateForm('area_type', $event)">
            <el-radio :label="1">指定地区</el-radio>
            <el-radio :label="2">指定范围（针对商圈）</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="form.area_type===1">
          <el-form-item v-if="$store.state.user.is_national" label="开启快速选择地区" prop="is_fast" class="activity-is_fast">
            <el-switch
              v-model="form.is_fast"
              :disabled="disabled"
              @change="updateForm('is_fast', $event)"
            />
          </el-form-item>
          <el-form-item v-if="form.is_fast" label="快速选择地区" prop="area" class="activity-area">
            <el-radio-group v-model="form.area" :disabled="disabled" @change="updateForm('area', $event)">
              <el-radio :label="0">全国</el-radio>
              <el-radio :label="2">全省</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-else>
            <el-form-item label="精确选择地区" prop="area" class="activity-area">
              <el-cascader
                v-model="areaLimit"
                :options="areaList"
                :props="areaProps"
                :disabled="disabled"
                :show-all-levels="false"
                placeholder="指定地区内的用户可参与活动"
                filterable
                clearable
              />
            </el-form-item>
            <el-form-item label="领取IP精准限制" prop="is_open_province" class="activity-is_open_province">
              <el-radio-group v-model="form.is_open_province" :disabled="disabled" @change="updateForm('is_open_province', $event)">
                <el-radio :label="1">省级</el-radio>
                <el-radio :label="2">市级</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </template>

        <el-form-item v-show="form.area_type === 2" label="红包领取范围中心" prop="location" class="activity-location">
          <el-input :value="form.location?'已获取红包领取范围中心':'请点击定位按钮选择红包领取范围中心'" :disabled="true" clearable placeholder="请点击定位按钮选择红包领取范围中心" />
          <el-button :disabled="disabled" type="primary" @click="dialogVisible = true">定位</el-button>
        </el-form-item>

        <el-form-item v-show="form.area_type === 2" label="红包领取地区范围(km)" prop="location_range" class="activity-location_range">
          <el-input-number v-model="form.location_range" :precision="2" :step="0.1" :min="1" :max="100" :disabled="disabled" :controls="false" clearable style="width:100%" @change="updateForm('location_range', $event)" />
        </el-form-item>
      </template>

      <!-- <div class="tip-font">
        <p>1.红包分为随机模式和等额模式，只能选择一种红包发放模式</p>
        <p>2.随机模式下，后台会根据最大金额与最小金额为用户随机生成红包</p>
        <p>3.等额模式下，后台会随机抽取金额中任一金额为用户生成红包</p>
        <p>4.微信发放红包最小为0.3，故红包金额不得小于0.3</p>
        <p>5.红包金额在0.3~5之间</p>
      </div> -->

      <!-- <template>
        <el-form-item label="顶部背景图" class="activity-banner">
          <FileManager :value="form.banner" :page-size="8" :disabled="disabled" :type="2" :size="1024" @change="changeBanner" />
        </el-form-item>
        <div class="tip-font">1.图片尺寸宽750px，高任意，底部留白区域为40px；2.图片大小必须小于1M</div>
      </template>

      <el-form-item label="背景色" prop="bg_color" class="activity-bg_color">
        <el-color-picker
          v-model="form.bg_color"
          :predefine="predefineColors"
          :disabled="disabled"
          color-format="hex"
          @active-change="updateForm('bg_color', $event)"
        />
      </el-form-item> -->
      <template v-if="form.activity_type!==2">
        <tip id="redRule" title="红包提示信息" />
        <el-form-item label="是否上传背景音乐" prop="is_music" class="activity-is_music">
          <el-switch
            v-model="form.is_music"
            :disabled="disabled"
            @change="updateForm('is_music', $event)"
          />
        </el-form-item>
        <template v-if="form.is_music">
          <el-form-item label="背景音乐" prop="bg_music" class="activity-bg_music">
            <FileManager :value="form.bg_music" :page-size="16" :size="1024 * 5" :type="1" :disabled="disabled" @change="changeMusic" />
          </el-form-item>
          <div class="tip-font">1.文件格式为mp3；2.文件大小必须小于5M；3.不传则播放默认红包提示音乐</div>
        </template>
        <el-form-item label="红包领取倒计时" prop="bg_time" class="activity-bg_time">
          <el-input-number v-model="form.bg_time" :min="0" :max="60" :step="1" step-strictly :disabled="disabled" :controls="false" clearable placeholder="请填写红包领取倒计时时长" @change="updateForm('bg_time', $event)" />
        </el-form-item>
        <div class="tip-font">倒计时为0则，不出现倒计时且不播放背景音乐。</div>
      </template>
    </el-form>

    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="$store.state.app.device === 'mobile' ? true : false"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="7vh"
      title="红包领取范围中心"
      width="80%"
    >
      <Map :form="form" @hide="dialogVisible=false" @change="updateLocation" />
    </el-dialog>
  </div>
</template>

<script>
import Map from '@/components/Tool/Map'
import FileManager from '@/components/FileManager/index'
import { mapState, mapMutations } from 'vuex'
import { getAreaStorage } from '@/utils/storage'
import { getCity } from '@/utils/area'
import Bus from '@/utils/bus'

export default {
  components: { FileManager, Map },
  data() {
    const validatSingle = (rule, val, callback) => {
      if (this.form.redpacket_type === 2) {
        if (val.length === 0) callback(new Error('请设置金额'))
        if (this.single_money_duplicates.length > 0) callback(new Error('等额模式下金额不能重复'))
        if (this.single_rate_total !== 100) callback(new Error('等额模式下所有概率之和应该为100'))
        else callback()
      } else callback()
    }

    const validateRedpacketMin = (rule, val, callback) => {
      if (this.form.redpacket_type === 1) {
        var min = val - 0
        var max = this.form.max_redpacket - 0
        if (!min) callback(new Error('请填写最小随机金额'))
        else if (min < 0.3) callback(new Error('不能小于0.3'))
        else if (max && max >= 0.3 && max <= min) callback(new Error('最小值应比最大值小'))
        else callback()
        // this.$refs['form'].validateField('max_redpacket')
      } else callback()
    }

    const validateRedpacketMax = (rule, val, callback) => {
      if (this.form.redpacket_type === 1) {
        var max = val - 0
        var min = this.form.min_redpacket - 0
        if (!max) callback(new Error('请填写最大随机金额'))
        else if (max < 0.3) callback(new Error('不能小于0.3'))
        else if (min && min >= 0.3 && max <= min) callback(new Error('最大值应比最小值大'))
        else callback()
        // this.$refs['form'].validateField('min_redpacket')
      } else callback()
    }
    var validatArea = (rule, val, callback) => {
      if (this.form.area_type === 1 && ![0, 2].includes(val) && val.length === 0) callback('请选择领取地区')
      else callback()
    }

    var validatLocation = (rule, val, callback) => {
      if (this.form.area_type === 2 && (!val || !val.lat || !val.lng)) callback('请选择红包领取范围中心')
      else callback()
    }
    var validatLocationRange = (rule, val, callback) => {
      if (this.form.area_type === 2 && !val) callback('请选择范围大小')
      else callback()
    }

    var validatShare = (rule, val, callback) => {
      if (this.form.activity_type !== 1 && !val) callback('请填写分享单个好友获得金额')
      else callback()
    }
    var validatProvince = (rule, val, callback) => {
      if (!val) callback('请选择领取IP精准限制模式')
      else callback()
    }

    return {
      dialogVisible: false,
      options: [{
        value: 0.3,
        label: '0.30'
      }, {
        value: 0.5,
        label: '0.50'
      }, {
        value: 1,
        label: '1.00'
      }],
      // predefineColors: [ // 预定义颜色
      //   '#ff0c00',
      //   '#20A1FF',
      //   '#FF6500',
      //   '#C044D9',
      //   '#E38E57',
      //   '#FB7792',
      //   '#3CC9B5'
      // ],
      formRules: {
        area_type: [{ required: true, trigger: 'change', message: '请选择地区选择类型' }],
        area: [{ trigger: 'change', validator: validatArea }],
        location: [{ trigger: 'change', validator: validatLocation }],
        location_range: [{ trigger: 'change', validator: validatLocationRange }],
        get_type: [{ required: true, trigger: 'change', message: '请选择领取次数' }],
        activity_type: [{ required: true, trigger: 'change', message: '请选择红包领取模式' }],
        // redpacket_process: [{ required: true, trigger: 'change', message: '请选择红包领取流程' }],
        // num: [{ required: true, trigger: 'change', message: '请填写红包数量' }],
        redpacket_type: [{ required: true, trigger: 'change', message: '请选择红包模式' }],
        min_redpacket: [{ required: true, trigger: 'change', validator: validateRedpacketMin }],
        max_redpacket: [{ required: true, trigger: 'change', validator: validateRedpacketMax }],
        single_money: [{ required: true, trigger: 'change', validator: validatSingle }],
        share_money: [{ required: true, trigger: 'change', validator: validatShare }],
        is_open_province: [{ required: true, trigger: 'change', validator: validatProvince }]
      },
      deep: 0,
      areaList: [],
      areaProps: {
        value: 'id',
        label: 'name',
        multiple: true,
        expandTrigger: 'hover'
      }
    }
  },
  computed: {
    ...mapState({
      status: state => state.activity.status,
      form: state => state.activity.form,
      disabled: state => state.activity.disabled,
      isAuth: state => state.user.is_open_authorization,
      is_authorization: state => state.user.is_authorization
    }),
    disabledType() {
      if (!this.status || this.status === 3) return false
      else return true
    },
    // 是否展示删除添加按钮
    showActionBtn() {
      return '0234'.indexOf(this.status) >= 0
    },
    // 动态计算活动金额范围
    // total_money: function() {
    //   let min = 0
    //   let max = 0
    //   const num = this.form.num || 0

    //   if (!num) return 0

    //   switch (this.form.redpacket_type) {
    //     case 1:
    //       // 随机模式
    //       min = this.form.min_redpacket || 0
    //       max = this.form.max_redpacket || 0
    //       break
    //     case 2:
    //       // 等额模式
    //       var arr = this.single_money_arr
    //       if (arr.length === 0) break
    //       min = arr[0]
    //       max = arr[arr.length - 1]
    //       break
    //   }
    //   if (min === max) return min
    //   else return Number(min * num).toFixed(2) + '~' + Number(max * num).toFixed(2)
    // },
    // 获取单个红包money数组并排序
    single_money_arr() {
      var arr = []
      for (const item of this.form.single_money) {
        if (item.money) arr.push(item.money)
      }
      arr.sort(function(a, b) {
        return a - b
      })
      return arr
    },
    // 单个红包的money重复元素
    single_money_duplicates() {
      return this.duplicates(this.single_money_arr)
    },
    // 获取单个红包rate数组并排序
    single_rate_arr() {
      var arr = []
      for (const item of this.form.single_money) {
        if (item.rate) arr.push(item.rate)
      }
      return arr
    },
    // 单个红包的rate之和
    single_rate_total() {
      var sum = 0
      for (const item of this.single_rate_arr) sum += item
      return sum
    },
    areaLimit: {
      set(val) { // 选择数组中的最后一级
        if (val && val.length) {
          var res = []
          for (const item of val) {
            res.push(item[item.length - 1])
            if (!this.deep) this.deep = item.length
          }
          this.updateForm('area', res)
        } else this.updateForm('area', [])
      },
      get() {
        if (this.form.area && this.form.area.length > 0) {
          var arr = []
          for (const item of this.form.area) {
            if (item) {
              var city = this.getDetailCity(item)
              arr.push(city.slice(this.deep * -1))
            }
          }
          return arr
        } else return []
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler() {
        // if (this.form.banner) this.$refs.form.validateField('banner')
        if (this.form.bg_music) this.$refs.form.validateField('bg_music')
        if (this.form.detail) this.$refs.form.validateField('detail')
      }
    }
  },
  created() {
    this.getArea()
  },
  mounted() {
    this.getQnToken()
    // 表单校验
    Bus.$on('validSecond', () => {
      if (this.$refs.form) {
        this.$refs.form.validate(valid => {
          const obj = {
            key: 'red',
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
    // changeBanner(val) {
    //   const obj = { id: val.id, path: val.path }
    //   this.updateForm('banner', obj)
    // },
    changeMusic(val) {
      const obj = { id: val.id, path: val.path, name: val.name }
      this.updateForm('bg_music', obj)
    },
    // 获取七牛token
    getQnToken() {
      const token = this.$store.state.config.token
      if (!token || !token.audio) {
        this.$store.dispatch('config/GetQiniuToken', { other: true })
      }
    },
    // 单个红包的下拉框
    // singleHandle(a) {
    //   var arr = []
    //   for (let item of a) {
    //     item = item - 0
    //     // 判断是否为数字
    //     if (typeof (item) === 'number' && item >= 0.3 && item <= 5) {
    //       // 保留两位小数
    //       item = item.toFixed(2)
    //       // 保证不重复
    //       if (arr.indexOf(item) === -1) arr.push(item)
    //     }
    //   }
    //   this.updateForm('single_money', arr)
    // },
    // 添加单个红包
    addSingle() {
      var arr = this.form.single_money
      if (arr.length < 5) {
        arr.push({ money: 0.3, rate: 1 })
        this.updateForm('single_money', arr)
        this.$refs.form.validateField('single_money')
      } else this.$message('等额模式下，最多配置五种等额模式')
    },
    // 删除单个红包
    delSingle(index) {
      var arr = this.form.single_money
      if (arr.length !== 1) {
        arr.splice(index, 1)
        this.updateForm('single_money', arr)
        this.$refs.form.validateField('single_money')
      } else this.$message('等额模式下，至少需要配置一种等额模式')
    },
    getArea() {
      /**
       * 获取用户地区（可用于码上拓客）
       * 全国，返回所有数据(不存在数据量大时，渲染速度慢的问题，可以直接获取全部)
       * 市级代理：返回当前市，包括children
       * 县级代理：返回市级地区，包括市的children
      */
      this.$store.dispatch('area/GetArea')
        .then(res => {
          const storage = getAreaStorage()
          const userArea = this.$store.state.user.area
          if (userArea === 0) { // 全国
            this.areaList = storage
            this.deep = 3
          } else if (userArea > 0) {
            const last = String(userArea).substr(-2)
            if (last === '00') { // 市级
              this.areaList = getCity(userArea)
              this.deep = 2
            } else { // 县级
              const id = String(userArea).substr(0, 4) + '00'
              this.areaList = getCity(id)
              this.deep = 2
            }
          } else {
            this.areaList = []
          }
        })
    },
    getDetailCity(area) {
      const arr = []
      const county = getCity(area)[0]
      arr.unshift(county.id)
      let city = 0
      let province = 0
      if (county.pid) {
        city = getCity(county.pid)[0]
        arr.unshift(city.id)
        if (city.pid) {
          province = getCity(city.pid)[0]
          arr.unshift(province.id)
        }
      }
      return arr
    },
    // 查重（排序后的数组）
    duplicates(newArr) {
      var result = []
      for (var i = 0; i < newArr.length; i++) {
        if (newArr[i] === newArr[i + 1] && newArr[i] !== newArr[i - 1]) {
          result.push(newArr[i])
        }
      }
      return result
    },
    // 更新地址
    updateLocation(key, val) {
      this.updateForm('location', val)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-input-number .el-input__inner{
    text-align: left;
  }

  .el-cascader,.el-cascader .el-input{
    width:100%;
  }
  .single_money .el-input{
    width:100%;
  }
}
.text-center{
  text-align: center;
}
.icon-add{
  margin-left: 60px;
}
</style>
