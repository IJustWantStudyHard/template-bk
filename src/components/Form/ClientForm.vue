<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div>
          <span>{{ defaultForm.title }}</span>
        </div>
      </template>

      <el-form ref="userForm" :model="userInfo" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="userInfo.username" :disabled="formDisable.username" :placeholder="userInfo.username || '设置账号'" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <div class="pwd-box">
            <el-input v-model="userInfo.password" :disabled="formDisable.password" :placeholder="defaultForm.pwdPlaceholder" :type="pwdType">
              <template #append>
                <el-popover
                  placement="top-start"
                  title="提示"
                  content="生成8位数的密码，该密码包含大小写英文字母和数字"
                  width="200"
                  trigger="hover"
                >
                  <el-button slot="reference" @click="randomPwd">
                    <svg-icon icon-class="random" />
                  </el-button>
                </el-popover>
              </template>
            </el-input>
            <span class="show-pwd" @click="showPwd = !showPwd">
              <svg-icon v-if="showPwd" icon-class="eye" />
              <svg-icon v-else icon-class="eye-open" />
            </span>
          </div>
          <el-checkbox v-if="!id" v-model="agreePwd" :style="{ color: pwdColor }">用户成功创建后，平台将不再储存和显示该密码，请妥善保存密码！</el-checkbox>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userInfo.role" :disabled="formDisable.role" placeholder="请设置该用户角色" clearable>
            <el-option v-for="item in roleList" :key="item.name + item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isRequired.customer_video" label="开通霸屏广告" prop="customer_video">
          <el-switch v-model="userInfo.customer_video" :disabled="formDisable.customer_video" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-if="isRequired.account" label="账号数量" prop="account">
          <el-input-number v-model="userInfo.account" :controls="false" :disabled="formDisable.account" :min="0" :max="999999" placeholder="请输入该用户可开通账号数量" @change="handleChange" />
        </el-form-item>
        <el-form-item v-if="isRequired.area" label="地区" prop="area">
          <el-cascader
            v-model="userArea"
            :options="areaList"
            :props="areaProps"
            :disabled="formDisable.area"
            placeholder="请选择用户所在地区"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="isRequired.date" label="使用时间" prop="date">
          <DatePicker
            :value="userInfo.date || []"
            :type="'datetimerange'"
            :disabled-type="0"
            :has-shortcuts="true"
            :shortcuts="shortcuts"
            :disabled="formDisable.date"
            @changeTime="changeTime"
          />
        </el-form-item>
        <el-form-item v-if="isRequired.service" label="操作客服" prop="operator_service">
          <el-select v-model="userInfo.operator_service" :disabled="formDisable.service" placeholder="请设置该用户的操作客服" clearable>
            <el-option v-for="item in agentList" :key="'operator_service'+item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isRequired.service" label="市场客服" prop="market_service">
          <el-select v-model="userInfo.market_service" :disabled="formDisable.service" placeholder="请设置该用户的市场客服" clearable>
            <el-option v-for="item in agentList" :key="'market_service'+item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="userInfo.remark" :disabled="formDisable.remark" maxlength="10" clearable />
        </el-form-item>
        <el-form-item v-if="isRequired.is_national" label="是否创建全国活动" prop="is_national" class="activity-is_national">
          <el-switch v-model="userInfo.is_national" :disabled="formDisable.is_national" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-if="isRequired.is_open_authorization" label="是否开启吸粉功能" prop="is_open_authorization" class="activity-is_open_authorization">
          <el-switch v-model="userInfo.is_open_authorization" :disabled="formDisable.is_open_authorization" :active-value="1" :inactive-value="0" />
          <div v-if="isRequired.is_open_authorization" class="tip-font">注：开启吸粉功能后,用户需要先去个人信息页面点击【公众号授权】按钮授权成功后，才能在活动中正常使用吸粉功能（授权后，不可更改）</div>
        </el-form-item>
        <el-form-item v-if="isRequired.is_open_card" label="是否开启卡劵功能" prop="is_open_card" class="activity-is_open_card">
          <el-switch v-model="userInfo.is_open_card" :disabled="formDisable.is_open_card" :active-value="1" :inactive-value="0" />
          <div v-if="isRequired.is_open_card" class="tip-font">注：开启卡劵功能后用户才能使用卡劵功能</div>
        </el-form-item>
        <el-form-item label="是否禁用" prop="status">
          <el-radio-group v-model="userInfo.status" :disabled="formDisable.status">
            <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <service v-if="userInfo.role===5" ref="serviceChild" :form="userInfo" @change="updateForm" />

        <el-form-item>
          <el-button v-show="id" v-has="'AgentUpdate'" type="primary" @click="submit('AgentUpdate')">修改</el-button>
          <el-button v-show="!id" v-has="'AgentStore'" type="primary" @click="submit('AgentStore')">创建</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Service from '@/components/Form/Sys/Service'
import { apiBtn } from '@/api/default'
import { validatMixRegular, validatPwdEasy, validatePositiveInteger } from '@/utils/validate'
import { getCity } from '@/utils/area'
import DatePicker from '@/components/Tool/DatePicker'
import { getAreaStorage } from '@/utils/storage'

export default {
  components: { DatePicker, Service },
  data() {
    const validateUsername = (rule, val, callback) => {
      if (val && val.length >= 5 && val.length <= 16 && validatMixRegular(val)) {
        callback()
      } else {
        callback(new Error('用户名只能是数字或字母，长度为5-16位'))
      }
    }
    const validatePassword = (rule, val, callback) => {
      if (!val && this.id) { // 编辑
        callback()
      } else if (val && validatPwdEasy(val) && val.length >= 8 && val.length <= 16) {
        callback()
      } else {
        callback(new Error('密码由数字和字母组成，长度为8-16位'))
      }
    }
    const validateAccount = (rule, val, callback) => {
      const isRequired = this.isRequired.account
      const account = this.userInfo.account
      if (isRequired && account > 0 && validatePositiveInteger(account)) {
        callback()
      } else {
        callback(new Error('请设置用户可开通账号数量'))
      }
    }
    const validateArea = (rule, val, callback) => {
      const isRequired = this.isRequired.area
      const userArea = this.userArea
      if (!isRequired) callback()
      else {
        if (userArea.length === 0) callback(new Error('请设置用户所属区域'))
        else if (userArea.length === 1) callback(new Error('请设置正确的地区'))
        else callback()
      }
    }
    const validateDate = (rule, val, callback) => {
      const isRequired = this.isRequired.date
      if (isRequired && val.length) {
        callback()
      } else {
        callback(new Error('请设置使用时间'))
      }
    }
    // const validateService = (rule, val, callback) => {
    //   const isRequired = this.isRequired.service
    //   if (isRequired && val) {
    //     callback()
    //   } else {
    //     callback(new Error('请设置客服'))
    //   }
    // }
    const validateRemark = (rule, val, callback) => {
      if (val && val.length <= 10) {
        callback()
      } else {
        callback(new Error('请设置备注'))
      }
    }
    return {
      defaultForm: null,
      showPwd: false, // toggle input type
      agreePwd: false, // agree pwd protocol
      pwdColor: '',
      isRequired: {
        account: false,
        area: false,
        date: false,
        customer_video: false,
        service: false,
        is_national: false,
        is_open_authorization: false,
        is_open_card: false
      },
      areaList: [],
      areaProps: { // 级联选择器配置选项
        value: 'id',
        label: 'name',
        disabled: 'status',
        checkStrictly: true,
        expandTrigger: 'hover'
        // 使用懒加载编辑的赋值失败。解决方案：在编辑时需要提前加载所选地区内容。
        // lazy: true,
        // lazyLoad(node, resolve) {
        //   const { value } = node
        //   var findChildren = function(list) {
        //     let i = 0
        //     while (i < list.length) {
        //       const item = list[i]
        //       // 添加子地区
        //       if (item.id === Number(value)) {
        //         const nodes = item.children.map(i => ({
        //           id: i.id,
        //           name: i.name,
        //           status: i.status || false,
        //           leaf: !i.children
        //         })
        //         )
        //         resolve(nodes)
        //         break
        //       }
        //       if (item.children && item.children.length) {
        //         findChildren(item.children)
        //       }
        //       i++
        //     }
        //   }
        //   findChildren(getAreaStorage())
        // }
      },
      shortcuts: [ // 快速选择使用时间
        {
          text: '三天',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 3)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '一年',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            end.setFullYear(start.getFullYear() + 1)
            picker.$emit('pick', [start, end])
          }
        }
      ],
      statusOptions: [
        { label: '使用', value: 1 },
        { label: '禁用', value: 2 }
      ],
      id: this.$route.query.id || null,
      userArea: [], // 地区绑定数据
      userInfo: {
        userId: null,
        username: null,
        password: null,
        role: null,
        date: [],
        remark: null,
        status: 1,
        customer_video: 0,
        service_code: { path: '' },
        operator_service: 0, // 操作客服ID
        market_service: 0, // 市场客服ID
        is_national: 0, // 是否可以创建全国活动
        is_open_authorization: 0, // 是否开启吸粉功能
        is_open_card: 0// 是否开启卡劵功能
      },
      formRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: false, trigger: 'blur', validator: validatePassword }],
        role: [{ required: true, trigger: 'change', message: '请设置用户角色' }],
        account: [{ required: false, trigger: 'blur', validator: validateAccount }],
        area: [{ required: false, trigger: 'change', validator: validateArea }],
        date: [{ required: false, trigger: 'blur', validator: validateDate }],
        remark: [{ required: true, trigger: 'blur', validator: validateRemark }]
        // operator_service: [{ required: false, trigger: 'blur', validator: validateService }],
        // market_service: [{ required: false, trigger: 'blur', validator: validateService }]
      },
      agentList: []// 客服列表
    }
  },
  computed: {
    // 密码输入框
    pwdType: function() {
      return this.showPwd ? '' : 'password'
    },
    // 角色列表
    roleList: function() {
      const list = this.$store.state.config.roleList
      return list
    },
    /**
     * 禁止编辑
     * 1.编辑的内容属于自己时，除密码外，禁止编辑
     * 2.编辑他人
     * 3.代理商创建门店时，可填写备注，不能修改备注
     */
    formDisable: function() {
      const id = this.id
      const userId = this.$store.state.user.userId || ''
      const obj = {
        username: false,
        password: false,
        role: false,
        account: false,
        area: false,
        date: false,
        remark: false,
        status: false,
        customer_video: false,
        service: false
      }
      if (Number(userId) === id && (id > 0 || id === 0)) {
        for (const item in obj) {
          if (item !== 'password') {
            obj[item] = true
          }
        }
      }
      if (id > 0 || id === 0) {
        const adminUser = this.$store.state.user.roles[0]
        obj.username = true
        if ('158'.indexOf(adminUser) >= 0) {
          obj.remark = false
        } else {
          obj.remark = true
        }
      }
      return obj
    }
    // 地区数据
    // areaList: function() {
    //   return this.$store.state.area.list
    // }
  },
  watch: {
    'userInfo.role': function(newVal) { // 字段是否必填
      // 角色列表：1管理员 5运营 6会计 7代理商 8品牌代理 9门店
      const required = this.isRequired
      const userRole = this.$store.state.user.roles[0]
      // 1 账号数量
      const whiteAccount = [1, 5, 6, 9]
      const account = this.userInfo.account || null
      if (whiteAccount.includes(newVal)) {
        required.account = false
        this.userInfo.account = 0
      } else {
        required.account = true
        this.userInfo.account = account
      }

      // 2 地区
      // 不需要设置地区的角色
      const whiteArea = [1, 5, 6, 8]
      const area = this.userInfo.area || null
      // 拥有为其他角色赋地区权限的角色
      const whiteUser = [1, 5]
      // 2.1 根据当前用户的角色，是否可以为新用户设置地区
      if (whiteUser.includes(userRole)) {
        // 2.2 根据选择的角色， 是否需要设置地区
        if (whiteArea.includes(newVal)) {
          required.area = false
          delete this.userInfo.area
        } else {
          required.area = true
          this.userInfo.area = area
        }
      } else {
        required.area = false
        delete this.userInfo.area
      }

      // 3 时间
      const whiteDate = [1, 5, 6]
      const date = this.userInfo.date || []
      // 3.1 根据当前用户的角色
      if (whiteDate.includes(userRole)) {
        // 3.2 根据选择的角色
        if (whiteDate.includes(newVal)) {
          required.date = false
          this.userInfo.date = []
        } else {
          required.date = true
          this.userInfo.date = date
        }
      } else {
        required.date = false
        this.userInfo.date = null
      }

      // 霸屏广告
      const isOpen = this.$store.state.user.customer_video
      const whiteCustomer_video = [1, 5, 6, 7, 8]
      const customer_video = this.userInfo.customer_video || 0
      // 4.1 根据当前用户的角色
      if (whiteCustomer_video.includes(userRole)) {
        // 4.2 根据选择的角色
        if ([1, 5, 6].includes(newVal)) {
          required.customer_video = false
          this.userInfo.customer_video = 1
        } else if (!isOpen) {
          required.customer_video = false
          this.userInfo.customer_video = 0
        } else {
          required.customer_video = true
          this.userInfo.customer_video = customer_video
        }
      } else {
        required.customer_video = false
        this.userInfo.customer_video = 0
      }

      // 客服
      const whiteService = [1, 5]
      const operator_service = this.userInfo.operator_service || ''
      const market_service = this.userInfo.market_service || ''
      // 3.1 根据当前用户的角色
      if (whiteService.includes(userRole)) {
        // 3.2 根据选择的角色
        if ([1, 5, 6, 10].includes(newVal)) {
          required.service = false
          this.userInfo.operator_service = 0
          this.userInfo.market_service = 0
        } else {
          required.service = true
          this.userInfo.operator_service = operator_service
          this.userInfo.market_service = market_service
        }
      } else {
        required.service = false
        this.userInfo.operator_service = 0
        this.userInfo.market_service = 0
      }

      // 全国活动 is_national
      const isOpenNational = this.$store.state.user.is_national
      const whiteNational = [1, 5, 6, 7, 8]
      const is_national = this.userInfo.is_national || 0
      // 3.1 根据当前用户的角色
      if (whiteNational.includes(userRole)) {
        // 3.2 根据选择的角色
        if ([1, 5, 6].includes(newVal)) {
          required.is_national = false
          this.userInfo.is_national = 1
        } else if (!isOpenNational) {
          required.is_national = false
          this.userInfo.is_national = 0
        } else {
          required.is_national = true
          this.userInfo.is_national = is_national
        }
      } else {
        required.is_national = false
        this.userInfo.is_national = 0
      }

      // 吸粉功能 is_open_authorization
      const isOpenAuthorization = this.$store.state.user.is_open_authorization
      const whiteAuthorization = [1, 5, 6, 7, 8]
      const is_open_authorization = this.userInfo.is_open_authorization || 0
      // 3.1 根据当前用户的角色
      if (whiteAuthorization.includes(userRole)) {
        // 3.2 根据选择的角色
        if ([1, 5, 6].includes(newVal)) {
          required.is_open_authorization = false
          this.userInfo.is_open_authorization = 1
        } else if (!isOpenAuthorization) {
          required.is_open_authorization = false
          this.userInfo.is_open_authorization = 0
        } else {
          required.is_open_authorization = true
          this.userInfo.is_open_authorization = is_open_authorization
        }
      } else {
        required.is_open_authorization = false
        this.userInfo.is_open_authorization = 0
      }

      // 卡劵功能 is_open_card
      const isOpenCard = this.$store.state.user.is_open_card
      const whiteCard = [1, 5, 6, 7, 8]
      const is_open_card = this.userInfo.is_open_card || 0
      // 3.1 根据当前用户的角色
      if (whiteCard.includes(userRole)) {
        // 3.2 根据选择的角色
        if ([1, 5, 6].includes(newVal)) {
          required.is_open_card = false
          this.userInfo.is_open_card = 1
        } else if (!isOpenCard) {
          required.is_open_card = false
          this.userInfo.is_open_card = 0
        } else {
          required.is_open_card = true
          this.userInfo.is_open_card = is_open_card
        }
      } else {
        required.is_open_card = false
        this.userInfo.is_open_card = 0
      }
    },
    // 根据表单数据变化 修改组件绑定数据
    'userInfo.area': function() {
      if (this.userInfo.area > 0 || this.userInfo.area === 0) {
        const arr = getCity(this.userInfo.area, true)
        const area = []
        for (const item of arr) {
          area.push(item.id)
        }
        // 第一次获取数据时，省级地区没有children，手动添加
        // this.$store.dispatch('area/ToggleFold', area[0])
        this.userArea = area
      } else {
        this.userArea = []
      }
    },
    // 监听地区改变修改表单数据
    'userArea': function(newVal) {
      this.userInfo.area = newVal[newVal.length - 1]
    }
  },
  created() {
    this.getAgentList()
    this.initForm()
    this.$store.dispatch('config/GetRoleList', { route: 'agent' })
      .then(res => {
        this.$store.dispatch('area/GetArea')
          .then(res => {
            this.getUserInfo()
            // 获取地区列表
            this.areaList = getAreaStorage()
          })
      })
  },
  methods: {
    // 根据创建或编辑，初始化表单
    initForm() {
      const id = this.id || ''
      this.defaultForm = {
        title: id ? '编辑客户' : '创建客户',
        pwdPlaceholder: id ? '不修改密码则留空' : '设置密码',
        submit: id ? '修改' : '创建'
      }
    },
    // 获取客服列表
    getAgentList() {
      apiBtn('AgentIndex', { page: 1, size: 100, role_id: 5 }).then(res => {
        this.agentList = res.data.list
      })
    },
    // 1.获取用户信息；2.当用户为代理时，角色默认值为门店
    getUserInfo() {
      if (this.id) {
        apiBtn('AgentShow', { id: this.id })
          .then(res => {
            this.userInfo = res.data
            this.userInfo.service_code = {
              id: this.userInfo.service_code,
              path: this.userInfo.upload[this.userInfo.service_code]
            }
          })
      }
      if ('78'.indexOf(this.$store.state.user.roles[0]) >= 0) this.userInfo.role = 9
    },
    // 生成随机密码
    randomPwd() {
      this.showPwd = true
      var Random = /** @class */ (function() {
        function Random(length) {
          this.length = length
        }
        Random.prototype.init = function() {
          this.password = ''
          var $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789'
          var max = $chars.length
          for (var i = 0; i < this.length; i++) {
            this.password += $chars.charAt(Math.floor(Math.random() * max))
          }
          this.validate(this.password)
          return this.password
        }
        Random.prototype.validate = function(password) {
          var reg = /([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*/
          if (reg.test(password)) {
            return true
          } else {
            this.init()
          }
        }
        return Random
      }())
      var password
      password = new Random(8)
      this.$set(this.userInfo, 'password', password.init())
      // 重新校验密码
      this.$refs['userForm'].validateField('password')
    },
    // 校验表单
    validateForm() {
      let res
      this.$refs['userForm'].validate(valid => { res = valid })
      if (this.userInfo.role === 5) {
        const service = this.$refs.serviceChild.validateForm()
        res = res && service
      }
      return res
    },
    // 提交
    submit(name) {
      if (this.validateForm() && (this.id || (!this.id && this.agreePwd))) {
        var data = { ...this.userInfo }
        data.service_code = data.service_code.id
        apiBtn(name, data)
          .then(res => {
            this.cancel()
          })
      } else {
        this.pwdColor = '#F56C6C'
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    changeTime(val) {
      this.userInfo.date = val
    },
    handleChange(val) {
      this.userInfo.account = val
    },
    updateForm(key, val) {
      this.userInfo[key] = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
form {
  .pwd-box {
    position: relative;
    .show-pwd {
      position: absolute;
      left: 215px;
      top: 50%;
      font-size: 16px;
      cursor: pointer;
      user-select: none;
      transform: translateY(-50%);
    }
  }
}
/deep/ .el-input-number .el-input__inner{
  text-align: left;
}
</style>
