<template>
  <div class="app-container">
    <complex-table
      :page-name="'收支统计'"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getList"
    >
      <!-- 搜索框 -->
      <template v-slot:search>
        <!-- 选取时间 -->
        <DatePicker
          :value="formSearch.time"
          :has-shortcuts="true"
          value-format="timestamp"
          @changeTime="changeTime"
        />
        <el-button type="primary" icon="el-icon-search" class="search-item" @click="search">搜索</el-button>
      </template>
      <template v-slot:btn>
        <div>
          <el-button v-has="'CashExport'" size="medium" icon="el-icon-download" @click="exportToExcel()">导出</el-button>
        </div>
      </template>
      <template v-slot:time="props">
        <span>{{ props.scope.row.time | parseTime('{y}-{m}-{d}') }}</span>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'

export default {
  name: 'LogPic',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      formSearch: {
        time: []
      },
      tableHeader: [
        { label: '日期', prop: 'time', sortable: true, isCustomize: true },
        { label: '活动创建数量', prop: 'act_create_num' },
        { label: '活动充值金额', prop: 'act_recharge_num' },
        { label: '管理员账户充值金额', prop: 'account_recharge_num' },
        { label: '管理员提现金额', prop: 'account_withdraw' },
        { label: '人工充值金额', prop: 'labour_withdraw' },
        { label: '活动发放红包', prop: 'act_get_redpacket' },
        { label: '用户提现金额', prop: 'act_user_withdraw' },
        { label: '活动推广金额', prop: 'act_popularize' },
        { label: '活动转发红包份数', prop: 'act_redpacket_num' },
        { label: '推广红包发送份数', prop: 'act_popularize_num' },
        { label: '用户提现笔数', prop: 'user_cash_num' },
        { label: '总提现金额', prop: 'count_cash' }
      ],
      pagination: {
        // 当前是第几页
        page: 1,
        // 一页几条
        size: 10,
        // 一共多少页
        total: 100
      },
      tableData: []
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
        ...this.formSearch
      }
      delete searchObj.total
      this.apiBtn('CountIndex', searchObj).then((res) => {
        this.tableData = res.data.list
        this.pagination.total = res.data.total
      })
    },
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
        ...this.formSearch
      }
      this.apiBtn('CountExport', params)
        .then(res => {
          // excel数据导出
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require('@/excel/Export2Excel')

            const tHeader = ['日期', '活动创建数量', '活动充值金额', '管理员账户充值金额', '管理员提现金额', '人工充值金额', '活动发放红包', '用户提现金额', '活动推广金额', '活动转发红包份数', '推广红包发送份数', '用户提现笔数', '总提现金额']
            const filterVal = ['time', 'act_create_num', 'act_recharge_num', 'account_recharge_num', 'account_withdraw', 'labour_withdraw', 'act_get_redpacket', 'act_user_withdraw', 'act_popularize', 'act_redpacket_num', 'act_popularize_num', 'user_cash_num', 'count_cash']
            const list = res.data.list
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '收支统计' + this.parseTime(new Date(), '{y}-{m}-{d}'))
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
</style>
