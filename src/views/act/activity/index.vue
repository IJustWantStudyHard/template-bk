<template>
  <div class="app-container">
    <ComplexTable :table-header="tableHeader" :table-data="tableData" :pagination="pagination" :page-name="'活动列表'" @refreshTable="getList">
      <!-- 搜索 -->
      <template v-slot:search>
        <el-select v-model="formSearch.status" clearable placeholder="请选择活动状态">
          <el-option v-for="item in optionStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model="otherSearch.keywords" clearable placeholder="请输入活动ID|标题|分享标题" @keyup.native.enter="searchActivity" @clear="getList" />
        <el-input v-model="otherSearch.store" clearable placeholder="请输入用户名|备注" @keyup.native.enter="searchActivity" @clear="getList" />
        <el-input v-if="[1,5].includes(roles[0])" v-model="otherSearch.agent" clearable placeholder="请输入代理商ID,查其及门店活动" @keyup.native.enter="searchActivity" @clear="getList" />
        <el-select v-model="formSearch.view_fake" clearable placeholder="请选择活动浏览量顺序">
          <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="formSearch.exposure_fake" clearable placeholder="请选择活动分享量顺序">
          <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button icon="el-icon-search" type="primary" @click="searchActivity">搜索</el-button>
      </template>
      <!-- 创建活动 -->
      <template v-slot:btn>
        <el-button v-has="'ActivityStore'" type="primary" icon="el-icon-plus" @click="navigate('ActivityStore', null)">创建活动</el-button>
      </template>

      <!-- 标题 -->
      <template v-slot:title="props">
        <el-tooltip :enterable="false" class="title" placement="top-start" effect="light">
          <template #content>
            <div>
              <!-- v-if="showDetail(props.scope.row.status)" -->
              <canvas :id="props.scope.row.id + props.scope.row.title" />
              <!-- <span v-else>{{ props.scope.row[props.scope.column.property] }}</span> -->
            </div>
          </template>
          <span @mouseover="getQrcode(props.scope.row)">
            {{ props.scope.row[props.scope.column.property] }}
            <img v-if="props.scope.row.video_link" class="icon_ba" src="@/assets/activity/icon_baping.png">
          </span>
        </el-tooltip>
      </template>
      <!-- 用户（地区/备注） -->
      <template v-slot:store="props">
        <span>{{ props.scope.row.store }}</span>
        <span v-if="props.scope.row.area && props.scope.row.remark">{{ '（' + props.scope.row.area + '/' + props.scope.row.remark + '）' }}</span>
        <span v-else-if="!props.scope.row.area">{{ '（' + props.scope.row.remark + '）' }}</span>
        <span v-else-if="!props.scope.row.remark">{{ '（' + props.scope.row.area + '）' }}</span>
      </template>
      <!-- 活动状态 -->
      <template v-slot:status="props">
        <span :class="'point '+ activityStatusColor(props.scope.row[props.scope.column.property])" />
        <span>{{ props.scope.row[props.scope.column.property] | activityStatus }}</span>
      </template>
      <!-- 活动数据 -->
      <template v-slot:data="props">
        <div v-if="showDetail(props.scope.row.status)" class="dataInfo">
          <div v-for="(item,index) in dataOption" :key="'data'+index">{{ item.label }}:<span :style="item.color?('color:'+item.color):''">{{ item.type||'' }}{{ props.scope.row[item.prop] }}</span></div>
        </div>
        <span v-else class="noData">暂无活动数据</span>
      </template>

      <!-- 活动暂停功能 -->
      <template v-slot:switch="props">
        <el-tooltip :content="props.scope.row.status === 2 ? '当前状态：开启' : '当前状态：暂停'" placement="top">
          <el-switch
            v-model="props.scope.row.switch"
            :disabled="showPause(props.scope.row.status)"
            :active-value="2"
            :inactive-value="4"
            @change="changeSwitch('ActivityPause', props.scope.row)"
          />
        </el-tooltip>
      </template>
      <template v-slot:activity_type="props">
        {{ optionType[props.scope.row.activity_type] }}
      </template>
      <!-- 操作按钮 -->
      <template v-slot:operation="props">
        <div class="btn-box">
          <el-button v-show="reviewStatus(props.scope.row.status)" v-has="'ActivityPatch'" type="warning" size="small" @click="navigate('ActivityPatch', props.scope.row)">审核</el-button>

          <el-button v-show="showEdit(props.scope.row.status)" v-has="'ActivityUpdate'" type="primary" size="small" @click="navigate('ActivityUpdate', props.scope.row)">编辑</el-button>
          <el-button v-show="!showEdit(props.scope.row.status) && !reviewStatus(props.scope.row.status)" v-has="'ActivityUpdate'" type="primary" size="small" @click="navigate('ActivityUpdate', props.scope.row)">查看</el-button>
          <el-button v-show="showAccount(props.scope.row)" v-has="'ActivityAccount'" type="danger" size="small" @click="closeAccount('ActivityAccount', props.scope.row)">结算</el-button>

          <el-button v-show="showDel(props.scope.row.status)" v-has="'ActivityDestroy'" type="danger" size="small" @click="del('ActivityDestroy', props.scope.row)">删除</el-button>

          <el-button v-show="showDetail(props.scope.row.status)&&'1'.indexOf($store.getters.roles[0]) >= 0" v-has="'ActuserIndex'" size="small" @click="navigate('ActivityActuser', props.scope.row)">访问用户</el-button>
          <el-button v-show="showDetail(props.scope.row.status)" v-has="'RedIndex'" size="small" @click="navigate('ActivityRed', props.scope.row)">领取记录</el-button>
          <el-button v-show="'24'.indexOf(props.scope.row.status) >= 0" v-has="'PrestoredIndex'" size="small" @click="navigate('ActivityPrestored', props.scope.row)">充值</el-button>
          <!-- <el-button v-show="showDetail(props.scope.row.status)" v-has="'AppendIndex'" size="small" @click="navigate('ActivityAppend', props.scope.row)">追加</el-button> -->
          <el-button v-if="showDetail(props.scope.row.status)" v-has="'CardlogIndex'" size="small" @click="navigate('CardLog',props.scope.row)">卡劵</el-button>
          <el-button v-show="showDetail(props.scope.row.status)" v-has="'MessageIndex'" size="small" @click="navigate('ActivityMessage', props.scope.row)">留言</el-button>
          <!-- <el-button v-show="showDetail(props.scope.row.status)" v-has="'ComplaintIndex'" size="small" @click="navigate('ActivityComplaint', props.scope.row)">投诉</el-button> -->

          <el-button v-if="showDetail(props.scope.row.status)" v-clipboard:copy="props.scope.row.link" v-clipboard:success="onCopy" v-clipboard:error="onError" size="small">复制链接</el-button>

          <el-button v-if="showVideo(props.scope.row)" v-has="'ActivityVideo'" size="small" @click="makeVideo(props.scope.row)">霸屏广告</el-button>

        </div>
      </template>
    </ComplexTable>
    <div class="tip-font"><p>注：活动只有暂停状态下才能结算</p></div>

    <video-dialog :row="checkedRow" :is-visible="isVisible" @close="closeDialog" @success="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ComplexTable from '@/components/Table/ComplexTable.vue'
import { apiBtn } from '@/api/default'
import { toRedirect, defalultConfirm, deleteArrayById } from '@/utils/index'
import QRCode from 'qrcode'
import VideoDialog from '@/components/Dialog/VideoDialog'

export default {
  filters: {
    // 活动状态
    activityStatus: function(val) {
      const obj = {
        1: '待审核',
        2: '运行中',
        3: '审核驳回',
        4: '已暂停',
        5: '已返还'
      }
      return obj[val]
    }
  },
  components: { ComplexTable, VideoDialog },
  data() {
    return {
      isInit: true, // 防止初始化搜索数据重复请求
      isVisible: false,
      formSearch: {
        status: 0,
        view_fake: '', // 浏览量 正序倒序
        exposure_fake: ''// 分享量 正序倒序
      },
      otherSearch: {
        keywords: '',
        store: '',
        agent: ''
      },
      optionStatus: [
        { value: 0, label: '请选择活动状态' },
        { value: 1, label: '待审核' },
        { value: 2, label: '运行中' },
        { value: 3, label: '审核驳回' },
        { value: 4, label: '已暂停' },
        { value: 5, label: '已返还' }
      ],
      orderStatus: [
        { value: 'desc', label: '正序' },
        { value: 'asc', label: '倒序' }
      ],
      // 1分享朋友圈赚钱 2 分享好友赚钱（推广赚钱） 3 1+2
      optionType: {
        1: '分享朋友圈',
        2: '分享好友',
        3: '分享朋友圈+分享好友'
      },
      tableHeader: [
        { prop: 'id', label: 'ID', width: 80 },
        { prop: 'title', label: '标题', width: 220, isCustomize: true },
        { prop: 'store', label: '用户（地区/备注）', width: 300, isCustomize: true },
        { prop: 'data', label: '活动数据', width: 180, isCustomize: true, align: 'left' },
        { prop: 'switch', label: '活动开关', isCustomize: true },
        { prop: 'status', label: '活动状态', isCustomize: true },
        { prop: 'activity_type', label: '活动类型', isCustomize: true },
        { prop: 'operation', label: '操作', width: 270, isCustomize: true }
      ],
      dataOption: [
        { prop: 'surplus', label: '红包剩余金额', type: '￥', color: '#FF5353' },
        { prop: 'payment_money', label: '红包已发放金额', type: '￥', color: '#0FBC3A' },
        { prop: 'num', label: '红包领取人数' },
        { prop: 'views', label: '活动浏览量' },
        { prop: 'share_views', label: '活动分享量' }
      ],
      tableData: [],
      pagination: {
        total: 0, // 总条数
        size: 10, // 每页显示条目个数
        page: 1 // 当前页数
      },
      checkedRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  watch: {
    formSearch: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.isInit) return
        this.getList()
        this.$store.commit('SearchUpdate', { name: 'activity', key: 'formSearch', value: newVal })
      }
    },
    otherSearch: {
      deep: true,
      handler(newVal, oldVal) {
        this.$store.commit('SearchUpdate', { name: 'activity', key: 'otherSearch', value: newVal })
      }
    },
    pagination: {
      deep: true,
      handler(newVal, oldVal) {
        this.$store.commit('SearchUpdate', { name: 'activity', key: 'pagination', value: newVal })
      }
    }
  },
  created() {
    this.initSearch()
  },
  methods: {
    // 初始化搜索
    initSearch() {
      this.formSearch = { ...this.$store.state.search.activity.formSearch }
      this.otherSearch = { ...this.$store.state.search.activity.otherSearch }
      this.getList(this.$store.state.search.activity.pagination)
    },
    // 活动状态
    activityStatusColor: function(val) {
      const obj = {
        1: 'warning',
        2: 'success',
        3: 'danger',
        4: 'default',
        5: 'info'
      }
      return 'point-' + obj[val]
    },
    // 搜索活动
    searchActivity() {
      this.getList()
    },
    // 跳转页面
    navigate(name, row) {
      toRedirect(name, row ? { id: row.id } : '')
    },
    // 获取活动列表
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      const params = {
        ...this.formSearch,
        ...this.otherSearch,
        status: this.formSearch.status || 0,
        size: this.pagination.size,
        page: this.pagination.page
      }
      apiBtn('ActivityIndex', params)
        .then(res => {
          const list = res.data.list
          for (const item of list) {
            item.switch = item.status
          }
          this.tableData = list
          this.pagination.total = res.data.total
          if (this.isInit) this.isInit = false
        })
    },
    // 开关控制 码上拓客没有活动暂停
    changeSwitch(name, row) {
      const msg = (row.status === 2 ? '将要暂停' : '将要开启') + '活动“' + row.title + '(' + row.id + ')”,是否继续？'
      const params = {
        id: row.id,
        status: row.status === 2 ? 4 : 2
      }
      const catchBack = () => {
        this.$set(row, 'switch', row.switch = row.status)
      }
      const callBack = () => {
        apiBtn(name, params)
          .then(res => {
            this.$set(row, 'status', row.status === 2 ? 4 : 2)
            if (row.status === 2 && row.card_probability < 100 && row.total_money < 0.3) {
              this.$message('红包金额不足，请充值')
              this.navigate('ActivityPrestored', row)
            }
          })
          .catch(res => {
            catchBack()
          })
      }
      defalultConfirm(msg, callBack, catchBack)
    },
    // 结算
    closeAccount(name, row) {
      // 渲染函数 JSX  https://cn.vuejs.org/v2/guide/render-function.html
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        type: 'warning',
        showCancelButton: true,
        message: h('p', null, [
          h('span', { style: 'color: red' }, '请再次确认是否结算？（注：活动结算后将无法修改和再次开启）')
        ])
      }).then(() => {
        apiBtn(name, { id: row.id, close_account: 1 })
          .then(res => {
            this.$set(row, 'status', 4)
            this.$set(row, 'close_account', row.close_account ? 0 : 1)
          })
      }).catch(err => {
        if (err !== 'cancel') console.log(err)
      })
    },
    del(name, row) {
      const msg = '将要删除活动“' + row.title + '”,是否继续？'
      const params = {
        id: row.id
      }
      const callBack = () => {
        apiBtn(name, params)
          .then(res => {
            deleteArrayById(this.tableData, row.id)
          })
      }
      defalultConfirm(msg, callBack)
    },
    // 审核按钮
    reviewStatus(val) {
      return '1'.indexOf(val) >= 0
    },
    // 编辑按钮
    showEdit(val) {
      return '234'.indexOf(val) >= 0
    },
    // 结算按钮 只有活动暂停才能结算
    showAccount(row) {
      return !row.close_account && '4'.indexOf(row.status) > -1 && (this.$store.getters.userId === row.create_admin_id || '15'.indexOf(this.$store.getters.roles[0]) >= 0)
    },
    // 开始暂停按钮
    showPause(val) {
      return !('24'.indexOf(val) >= 0 && this.$_has('ActivityPause'))
    },
    showDel(val) {
      return '3'.indexOf(val) >= 0
    },
    // 用户、红包、链接按钮、充值
    showDetail(val) {
      return '245'.indexOf(val) >= 0
    },
    /**
     * 霸屏广告按钮 逻辑
     * 若为管理员和运营角色不可编辑
     * 若为代理商角色 若代理商开启了霸屏广告 ，a自己的活动,可编辑
     *              若门店未开启霸屏广告 不可编辑
     * 若为其他角色（门店）开启即可编辑
     * */
    showVideo(row) {
      var role = this.$store.state.user.roles[0]
      var isOpen = this.$store.state.user.customer_video
      if ([1, 5].includes(role)) return false
      else if ([7, 8].includes(role)) {
        if (isOpen && row.create_admin_id === this.$store.state.user.userId) return true
        else return false
      } else return isOpen
    },
    // 复制活动链接
    onCopy(e) {
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    onError(e) {
      this.$message({
        type: 'error',
        message: '该浏览器不支持自动复制'
      })
    },
    // 生成二维码
    getQrcode(item) {
      setTimeout(() => {
        var canvas = document.getElementById(item.id + item.title)
        QRCode.toCanvas(canvas, item.link, (error) => {
          if (error) console.error(error)
        })
      }, 10)
    },
    // 霸屏广告
    makeVideo(row) {
      this.checkedRow = row
      this.isVisible = true
    },
    closeDialog() {
      this.isVisible = false
      this.checkedRow = {}
    },
    initPagination() {
      this.pagination = {
        page: 1,
        size: 10,
        total: 0
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.el-table {
  .activity-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .title {
    color: #00aaed;
    cursor: pointer;
  }
  .btn-box {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    .el-button {
      margin: 0 0 5px 5px;
    }
  }
  .icon_ba{
    position: absolute;
    left: 10px;
    top: 10px;
    width: 100px;
    height: 100px;
    z-index: 0;
    opacity: 0.3;
  }
}
.dataInfo{
  line-height: 22px;
  letter-spacing: .2px;
}
.noData{
  letter-spacing: .2px;
  color: #909399;
}
.search-card .el-input{
  width: 250px;
}
</style>
