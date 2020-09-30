<template>
  <div class="app-container">
    <ComplexTable :has-selection="hasSelection" :table-header="tableHeader" :table-data="tableData" :pagination="pagination" page-name="客户管理" @refreshTable="getList" @changeMultipleSelection="handleSelectionChange">
      <!-- 搜索框 -->
      <template v-slot:search>
        <el-select v-if="'156'.indexOf($store.state.user.roles) > -1" v-model="formSearch.role_id" placeholder="请选择角色" clearable @change="roleChange">
          <el-option v-for="item in roleList" :key="item.label" :label="item.name" :value="item.id" />
        </el-select>

        <el-select v-model="formSearch.status" placeholder="请选择用户状态" clearable>
          <el-option v-for="item in statuOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-select v-if="'156'.indexOf($store.state.user.roles) > -1" v-model="formSearch.review" placeholder="请选择审核状态" clearable>
          <el-option v-for="item in reviewOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-input v-model="otherSearch.keywords" placeholder="请输入ID|用户名|备注" clearable @keyup.native.enter="search" @clear="getList" />

        <DatePicker
          v-if="'156'.indexOf($store.state.user.roles) > -1"
          :value="formSearch.inputtime"
          :has-shortcuts="true"
          value-format="timestamp"
          @changeTime="changeTime"
        />

        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </template>

      <!-- 选择代理、添加按钮 -->
      <template v-slot:btn>
        <div class="select-box">
          <el-cascader v-if="isAgent && formSearch.role_id === 9" v-model="agentSelect" :options="selectList" :props="selectProps" filterable clearable placeholder="请选择代理">
            <template slot-scope="{ node, data }">
              <span>{{ data.username }}</span>
              <span v-if="data.remark"> ({{ data.remark }}) </span>
            </template>
          </el-cascader>

          <el-button v-has="'AgentExport'" icon="el-icon-download" @click="exportToExcel()">导出</el-button>

          <el-button v-if="hasSelection" v-has="'AgentMigrate'" type="primary" icon="el-icon-connection" @click="moveStore">转移用户</el-button>

          <el-button v-has="'AgentStore'" icon="el-icon-plus" @click="goUserForm('AgentStore')">添加用户</el-button>
        </div>
      </template>

      <!-- 角色 -->
      <template v-slot:role="props">
        <span>{{ props.scope.row[props.scope.column.property].name }}</span>
      </template>

      <!-- 地区 -->
      <template v-slot:area="props">
        <span>{{ props.scope.row[props.scope.column.property] | areaFilter }}</span>
      </template>

      <!-- 备注 -->
      <template v-slot:remark="props">
        <el-input
          v-if="props.scope.row.isRemark"
          v-model="props.scope.row.remark"
          v-focus="props.scope.row.isRemark"
          style="width:100%;"
          placeholder="最多输入10个字符"
          maxlength="10"
          @blur="blurRemark(props.scope.row)"
          @change="changeRemark(props.scope.row)"
        />
        <el-tooltip v-else :content="props.scope.row[props.scope.column.property]" placement="top-start">
          <span class="ellipsis" @dblclick="focusRemark(props.scope.row)" @touchend="focusRemark(props.scope.row)">
            {{ props.scope.row[props.scope.column.property] }}
          </span>
        </el-tooltip>
      </template>

      <!-- 状态 -->
      <template v-slot:status="props">
        <el-tooltip :content="'当前状态: ' + (props.scope.row.status === 1 ? '正常' : '禁用')" placement="top">
          <el-switch
            v-model="props.scope.row.status"
            :disabled="statusDisabled"
            :active-value="1"
            :inactive-value="2"
            @change="changeStatus(props.scope.row)"
          />
        </el-tooltip>
      </template>

      <!-- 代理商信息是否展示 1不展示 0展示 -->
      <template v-slot:agent="props">
        <el-tooltip v-show="props.scope.row.role.id===9" :content="'当前状态: ' + (props.scope.row.close_agent_info === 1 ? '不展示代理商信息' : '展示代理商信息')" placement="top">
          <el-switch
            v-model="props.scope.row.close_agent_info"
            :active-value="0"
            :inactive-value="1"
            @change="changeAgent(props.scope.row)"
          />
        </el-tooltip>
      </template>

      <!-- 有效期 -->
      <template v-slot:date="props">
        <span v-if="props.scope.row.start_time > 0">{{ props.scope.row.start_time | parseTime('{y}-{m}-{d}') }}</span><span v-if="props.scope.row.end_time > 0">~{{ props.scope.row.end_time | parseTime('{y}-{m}-{d}') }}</span>
      </template>

      <!-- 门店 -->
      <template v-slot:store="props">
        <div :class="[7, 8].includes(props.scope.row.role.id)?'store':''" @click="storeHandler(props.scope.row)">{{ props.scope.row.store }}</div>
      </template>

      <!-- 操作 -->
      <template v-slot:operation="props">
        <div class="btn-box">
          <el-button v-has="'AgentLabourStore'" type="success" size="small" @click="labour('AgentLabourStore', props.scope.row)">充值</el-button>
          <el-button v-has="'AgentUpdate'" type="primary" size="small" @click="goUserForm('AgentUpdate', props.scope.row)">编辑</el-button>
          <el-button v-show="showCheck(props.scope.row)" v-has="'AgentCheck'" type="warning" size="small" @click="goUserForm('AgentCheck', props.scope.row)">审核</el-button>
          <el-button v-show="showDetail(props.scope.row)" v-has="'AgentShow'" type="info" size="small" @click="goUserForm('AgentCheck', props.scope.row)">详情</el-button>
          <el-button v-has="'AgentDestroy'" type="danger" size="small" @click="deleteUser('AgentDestroy', props.scope.row)">删除</el-button>
        </div>
      </template>
    </ComplexTable>

    <laboure-dialog :is-visible="isVisible" :user="laboureUser" @close="isVisible=false" @success="handlerSuccess" />

    <agent-change-dialog :is-visible="isVisibleAgent" :store="selectedStore" @close="isVisibleAgent=false" @success="getList" />
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import LaboureDialog from '@/components/Dialog/LaboureDialog'
import AgentChangeDialog from '@/components/Dialog/AgentChangeDialog'

import DatePicker from '@/components/Tool/DatePicker'
import { apiBtn } from '@/api/default'
import { defalultConfirm, toRedirect } from '@/utils/index'
import { getCity } from '@/utils/area'

export default {
  components: { ComplexTable, DatePicker, LaboureDialog, AgentChangeDialog },
  filters: {
    areaFilter: function(val) {
      if (val === 0) return '全国'
      const nameList = getCity(val, true)
      let name = ''
      for (const item of nameList) {
        name = name + item.name
      }
      return name
    }
  },
  data() {
    return {
      isInit: true, // 防止初始化搜索数据重复请求
      formSearch: {
        role_id: '',
        status: '',
        review: '',
        inputtime: [],
        agent_id: 0
      },
      otherSearch: {
        keywords: '',
        user_id: ''
      },
      statuOptions: [
        { label: '正常', value: 1 },
        { label: '禁用', value: 2 }
      ],
      reviewOptions: [
        { label: '待审核', value: 1 },
        { label: '已审核', value: 2 },
        { label: '已驳回', value: 3 },
        { label: '未填写', value: 4 }
      ],
      agentSelect: [], // 下拉选择框、代理
      selectList: [
        { id: 7, username: '代理商', children: [] },
        { id: 8, username: '品牌代理', children: [] }
      ],
      selectProps: {
        value: 'id',
        label: 'username',
        multiple: false
      },
      tableData: [],
      pagination: {
        page: 1, // 当前页数
        size: 10, // 每页显示条目个数
        total: 0
      },
      oldRemark: '', // 修改前的备注
      isVisible: false,
      isVisibleAgent: false, // 转移门店的弹窗
      laboureUser: {}, // 充值用户
      selectedStore: []
    }
  },
  computed: {
    hasSelection: function() {
      return this.formSearch.role_id === 9
    },
    roleList: function() {
      return this.$store.state.config.roleList
    },
    isAgent: function() { // 筛选权限：156可以筛选某个代理下的所有门店
      // 1管理员 5运营 6会计 7代理商 8品牌代理 9门店
      const userRole = this.$store.state.user.roles
      const whiteRole = '156'
      if (whiteRole.indexOf(userRole[0]) >= 0) { // 是否展示
        return true
      } else {
        return false
      }
    },
    statusDisabled: function() {
      return !this.$_has('AgentPatch')
    },
    tableHeader: function() {
      const header = [
        { prop: 'id', label: 'ID', width: 70, sortable: true },
        { prop: 'username', label: '用户', width: 120 },
        { prop: 'remark', label: '备注', isCustomize: true },
        { prop: 'area', label: '地区', isCustomize: true },
        { prop: 'role', label: '角色', width: 100, isCustomize: true },
        { prop: 'status', label: '状态', width: 80, isCustomize: true },
        { prop: 'date', label: '有效期', width: 200, isCustomize: true, sortable: true },
        { prop: 'money', label: '余额', width: 100 },
        { prop: 'operation', label: '操作', width: 210, isCustomize: true }
      ]
      const userRole = this.$store.state.user.roles
      const whiteRole = '1578'
      if (whiteRole.indexOf(userRole[0]) >= 0) header.splice(6, 0, { prop: 'agent', label: '展示代理商信息', width: 80, isCustomize: true })

      const whiteRoleStore = '156'
      if (whiteRoleStore.indexOf(userRole[0]) >= 0) header.splice(9, 0, { prop: 'store', label: '门店', width: 80, sortable: true, isCustomize: true })

      return header
    }
  },
  watch: {
    formSearch: {
      deep: true,
      handler(newVal) {
        if (this.isInit) return
        this.getList()
        this.$store.commit('SearchUpdate', { name: 'agent', key: 'formSearch', value: newVal })
      }
    },
    otherSearch: {
      deep: true,
      handler(newVal, oldVal) {
        this.$store.commit('SearchUpdate', { name: 'agent', key: 'otherSearch', value: newVal })
      }
    },
    pagination: {
      deep: true,
      handler(newVal, oldVal) {
        this.$store.commit('SearchUpdate', { name: 'agent', key: 'pagination', value: newVal })
      }
    },
    agentSelect: function(newVal) {
      if (this.isInit) return
      this.formSearch.agent_id = newVal[newVal.length - 1] || 0
      this.$store.commit('SearchUpdate', { name: 'agent', key: 'agentSelect', value: newVal })
    }
  },
  created() {
    this.getSelectList()
    this.$store.dispatch('config/GetRoleList')
      .then(res => {
        this.$store.dispatch('area/GetArea')
          .then(res => {
            this.initSearch()
          })
      })
  },
  methods: {
    // 初始化搜索
    initSearch() {
      this.formSearch = { ...this.$store.state.search.agent.formSearch }
      this.otherSearch = { ...this.$store.state.search.agent.otherSearch }
      this.agentSelect = [...this.$store.state.search.agent.agentSelect]
      this.getList(this.$store.state.search.agent.pagination)
    },
    // 增加、编辑用户
    goUserForm(name, user) {
      if (user) {
        toRedirect(name, { id: user.id })
      } else {
        toRedirect(name)
      }
    },
    // 备注：切换input与span
    focusRemark(row) {
      // 代理商创建门店时，可填写备注，不能修改备注
      const user = this.$store.state.user.roles[0]
      if (!this.statusDisabled && '15'.indexOf(user) >= 0) {
        this.oldRemark = row.remark
        this.$set(row, 'isRemark', true)
      }
    },
    blurRemark(row) {
      if (row.remark) this.$set(row, 'isRemark', false)
    },
    // 修改备注
    changeRemark(row) {
      const msg = '修改该' + row.username + '的备注为：' + row.remark
      const params = {
        id: row.id,
        remark: row.remark
      }
      const catchBack = () => {
        this.$set(row, 'remark', this.oldRemark)
        this.blurRemark(row)
      }
      this.patchUser(row, msg, params, catchBack)
    },
    // 修改状态
    changeStatus(row) {
      const msg = '修改' + row.username + '的状态为' + (row.status === 1 ? '正常' : '禁用')
      const params = {
        id: row.id,
        status: row.status
      }
      const catchBack = () => {
        this.resetStatus(row)
      }
      this.patchUser('', msg, params, catchBack)
    },
    // 重置状态
    resetStatus(row) {
      this.$set(row, 'status', row.status === 1 ? 2 : 1)
    },
    // 展示代理商信息
    changeAgent(row) {
      const msg = '修改' + row.username + (row.close_agent_info ? '不展示代理商信息' : '展示代理商信息')
      const params = {
        id: row.id,
        close_agent_info: row.close_agent_info
      }
      const catchBack = () => {
        this.resetAgent(row)
      }
      this.patchUser('', msg, params, catchBack)
    },
    // 重置代理商信息展示状态
    resetAgent(row) {
      this.$set(row, 'close_agent_info', row.close_agent_info ? 0 : 1)
    },
    // patch请求
    patchUser(row, msg, params, catchBack) {
      const callBack = () => {
        apiBtn('AgentPatch', params)
          .then(res => {
            if (row) this.blurRemark(row)
          })
          .catch(res => {
            catchBack()
          })
      }
      defalultConfirm(msg, callBack, catchBack)
    },
    // 删除
    deleteUser(name, row) {
      const msg = '此操作将永久删除' + row.username
      const callBack = () => {
        apiBtn(name, { id: row.id })
          .then(res => {
            this.tableData.splice(this.tableData.indexOf(row), 1)
          })
      }
      defalultConfirm(msg, callBack)
    },
    // 普通查找
    search() {
      this.getList()
    },
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      const params = {
        ...this.formSearch,
        ...this.otherSearch,
        page: this.pagination.page,
        size: this.pagination.size
      }
      if (!params.agent_id) delete params.agent_id
      apiBtn('AgentIndex', params).then(res => {
        // 增加字段isRemark：是否修改备注
        for (var item of res.data.list) {
          item['isRemark'] = false
        }
        this.tableData = res.data.list
        this.pagination.total = res.data.total
        if (this.isInit) this.isInit = false
      })
    },
    // 获取下拉选择框中的代理商列表
    getSelectList() {
      if (this.isAgent) {
        for (const item of this.selectList) {
          const params = {
            role_id: item.id,
            size: 100,
            page: 1
          }
          if (!item.children.length) {
            apiBtn('AgentIndex', params).then(res => {
              item.children = res.data.list
            })
          }
        }
      }
    },
    // 是否显示审核按钮
    showCheck(row) {
      const user = this.$store.state.user.roles[0]
      const roleRow = row.role.id
      const review = row.review
      if ('15'.indexOf(user) >= 0 && '156'.indexOf(roleRow) < 0 && review === 1) {
        return true
      } else {
        return false
      }
    },
    showDetail(row) {
      const user = this.$store.state.user.roles[0]
      const roleRow = row.role.id
      const review = row.review
      if ('15'.indexOf(user) >= 0 && '156'.indexOf(roleRow) < 0 && '23'.includes(review)) {
        return true
      } else {
        return false
      }
    },
    initPagination() {
      this.pagination = {
        page: 1,
        size: 10,
        total: 0
      }
    },
    changeTime(val) {
      this.formSearch.inputtime = val
    },
    // 充值
    labour(name, row) {
      this.laboureUser = row
      this.isVisible = true
    },
    // 充值成功
    handlerSuccess(balance) {
      this.laboureUser.money = balance
    },
    // 多选
    handleSelectionChange(obj) {
      this.selectedStore = obj
    },
    // 转移用户
    moveStore() {
      if (this.selectedStore.length === 0) {
        this.$message('请先选择需要转移的门店')
      } else this.isVisibleAgent = true
    },
    // 导出Excel
    exportToExcel() {
      const params = {
        ...this.formSearch,
        ...this.otherSearch
      }
      apiBtn('AgentExport', params)
        .then(res => {
          // excel数据导出
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require('@/excel/Export2Excel')
            const tHeader = ['ID', '用户', '角色', '地区', '备注', '开始时间', '到期时间', '门店数量', '操作客服', '运营客服']
            const filterVal = ['id', 'username', 'role', 'area', 'remark', 'start_time', 'end_time', 'store', 'operator_service', 'market_service']
            const list = res.data.list
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '客户列表')
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 门店查询
    storeHandler(row) {
      if ([7, 8].includes(row.role.id)) {
        this.setAgentSelect([row.role.id, row.id])
        this.formSearch.role_id = 9
      }
    },
    // 修改选中代理商
    setAgentSelect(arr) {
      this.agentSelect = arr
      this.formSearch.agent_id = arr[arr.length - 1] || 0
      this.initPagination()
    },
    // 角色选择框修改
    roleChange(newVal) {
      if (newVal !== 9) this.setAgentSelect([])
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.select-box {
  display: flex;
  /deep/ .el-input {
    width: 200px;
    margin-right: 10px;
  }
}
.btn-box {
  .el-button {
    margin: 5px 2px;
  }
}
.store{
  color: #409EFF;
  cursor: pointer;
}
</style>
