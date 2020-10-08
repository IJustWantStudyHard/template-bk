<template>
  <div class="app-container">
    <complex-table
      :page-name="'每日收支统计'"
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
        { label: '日期', prop: 'time', sortable: true, width: 160 },
        { label: '订单总金额', prop: 'order_money' },
        { label: '订单总笔数', prop: 'order_num', width: 110 },
        { label: '佣金总金额', prop: 'rebate_money', isCustomize: true },
        { label: '佣金总笔数', prop: 'rebate_num' },
        { label: '提现总金额', prop: 'cash_money' },
        { label: '提现总笔数', prop: 'cash_num', width: 150 },
        { label: '入账总额', prop: 'income', isCustomize: true },
        { label: '出账总额', prop: 'billing' }
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
        this.initPagination()
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
      var searchObj = {
        ...this.pagination,
        ...this.formSearch
      }
      delete searchObj.total
      this.apiBtn('SumIndex', searchObj).then((res) => {
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
