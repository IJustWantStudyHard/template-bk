<template>
  <div class="app-container">
    <complex-table
      :page-name="'提现记录'"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getList"
    >
      <!-- 搜索框 -->
      <template v-slot:search>
        <el-select v-model="formSearch.status" placeholder="请选择状态" clearable>
          <el-option v-for="(item,key) of statusOptions" :key="key" :label="item" :value="key" />
        </el-select>
        <!-- 选取时间 -->
        <DatePicker
          :value="formSearch.time"
          :has-shortcuts="true"
          value-format="timestamp"
          @changeTime="changeTime"
        />
        <el-input
          v-model="otherSearch.keywords"
          placeholder="ID|用户名|备注"
          clearable
          class="search-item"
          @keyup.native.enter="search"
          @clear="search"
        />
        <el-button type="primary" icon="el-icon-search" class="search-item" @click="search">搜索</el-button>
      </template>
      <!-- 按钮 -->
      <template v-slot:btn>
        <div>
          <el-button v-has="'CashExport'" size="medium" icon="el-icon-download" @click="exportToExcel()">导出</el-button>
          <el-button v-show="showAccount" v-has="'CashStore'" type="primary" size="medium" @click="handelRedirect('CashStore')">发起提现</el-button>
        </div>
      </template>
      <template v-slot:add_time="slotProps">{{ slotProps.scope.row.add_time|parseTime() }}</template>
      <template v-slot:type="slotProps">{{ typeOptions[slotProps.scope.row.type] }}</template>
      <!-- 提现状态 -->
      <template v-slot:status="slotProps">
        <span :class="'point point-'+statusColorOptions[slotProps.scope.row.status]" />
        {{ statusOptions[slotProps.scope.row.status] }}
      </template>
      <!-- 操作 -->
      <template v-slot:action="slotProps">
        <div class="action-box">
          <el-button
            v-has="'CashShow'"
            size="small"
            @click="handelRedirect('CashShow',{id:slotProps.scope.row.id})"
          >详情</el-button>
          <el-button
            v-show="(slotProps.scope.row.status===1)&&(slotProps.scope.row.admin_id==userId)"
            v-has="'CashPatch'"
            type="success"
            size="small"
            @click="rollBack(slotProps.scope.row)"
          >撤销</el-button>
          <el-button
            v-show="showReview(slotProps.scope.row.status)"
            v-has="'CashPatch'"
            type="warning"
            size="small"
            @click="review(slotProps.scope.row,2)"
          >通过</el-button>
          <el-button
            v-show="showReview(slotProps.scope.row.status)"
            v-has="'CashPatch'"
            type="danger"
            size="small"
            @click="review(slotProps.scope.row,3)"
          >驳回</el-button>

        </div>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'
import { defalultConfirm, toRedirect, removeProperty } from '@/utils'
import { apiBtn } from '@/api/default'
import { parseTime } from '@/utils'

export default {
  name: 'LogPic',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      formSearch: {
        time: [],
        status: ''
      },
      otherSearch: {
        keywords: ''
      },
      tableHeader: [
        { label: '申请时间', prop: 'add_time', isCustomize: true, sortable: true, width: 160 },
        { label: '姓名', prop: 'name' },
        { label: '联系电话', prop: 'phone', width: 110 },
        { label: '类型', prop: 'type', isCustomize: true },
        { label: '提现金额', prop: 'money' },
        { label: '到账金额', prop: 'cash_money' },
        { label: '订单', prop: 'out_trade_no', width: 150 },
        { label: '状态', prop: 'status', isCustomize: true },
        { label: '操作', prop: 'action', isCustomize: true, width: '160px' }
      ],
      pagination: {
        // 当前是第几页
        page: 1,
        // 一页几条
        size: 10,
        // 一共多少页
        total: 100
      },
      tableData: [],
      statusOptions: {
        // 0: '全部状态',
        1: '待审核',
        2: '已审核',
        3: '已驳回',
        4: '撤销',
        5: '失败'
      },
      statusColorOptions: {
        1: 'warning',
        2: 'success',
        3: 'danger',
        4: 'default',
        5: 'info'
      },
      typeOptions: {
        1: '微信提现'
      },
      userId: this.$store.getters.userId
    }
  },
  computed: {
    showAccount() {
      return !'156'.includes(this.$store.getters.roles[0])
    }
  },
  watch: {
    formSearch: {
      deep: true,
      handler() {
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 是否展示审核
    showReview(status) {
      return '16'.includes(this.$store.getters.roles[0]) && status === 1
    },
    // 搜索
    search() {
      this.getList()
    },
    // 用户列表
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      var searchObj = {
        ...this.pagination,
        ...this.formSearch,
        ...this.otherSearch
      }
      delete searchObj.total
      apiBtn('CashIndex', removeProperty({ ...searchObj })).then((res) => {
        this.tableData = res.data.list
        this.pagination.total = res.data.total
      })
    },
    // 审核
    review(row, status) {
      var obj = {
        2: '通过审核(通过审核后自动提现到微信零钱)',
        3: '驳回审核'
      }
      defalultConfirm(obj[status], () => {
        this.patch({ id: row.id, status }, row)
      })
    },
    // 撤回
    rollBack(row) {
      defalultConfirm('撤回提现申请', () => {
        this.patch({ id: row.id, status: 4 }, row)
      })
    },
    patch(data, row) {
      apiBtn('CashPatch', data)
        .then((res) => {
          row.status = res.data.status
        }).catch((res) => {
          if (res && res.data.status) row.status = res.data.status
        })
    },
    // 跳转页面
    handelRedirect: toRedirect,
    changeTime(val) {
      this.formSearch.time = val
    },
    initPagination() {
      this.pagination = {
        page: 1,
        size: 10,
        total: 0
      }
    },
    // 导出Excel
    exportToExcel() {
      if (this.pagination.total === 0) {
        this.$message('暂无数据，无法导出')
        return
      }
      const params = {
        ...this.formSearch,
        ...this.otherSearch
      }
      apiBtn('CashExport', params)
        .then(res => {
          // excel数据导出
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require('@/excel/Export2Excel')

            const tHeader = ['订单', '申请时间', '姓名', '联系电话', '提现金额', '到账金额', '状态']
            const filterVal = ['out_trade_no', 'add_time', 'name', 'phone', 'money', 'cash_money', 'status']
            const list = res.data.list
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '提现列表' + parseTime(new Date(), '{y}-{m}-{d}'))
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.el-date-editor {
  width: 380px;
}

.action-box .el-button{
  margin: 5px 2px;
}
</style>
