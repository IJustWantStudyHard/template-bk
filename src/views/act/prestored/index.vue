<template>
  <div class="app-container">
    <ComplexTable
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      :page-name="'红包充值日志'"
      @refreshTable="getList"
    >
      <!-- 搜索 -->
      <template v-slot:search>

        <tip size="big">账户余额：￥{{ $store.state.user.accountBalance }}</tip>
        <span>活动(id:{{ otherSearch.id }})</span>
        <span v-has="'PrestoredStore'">
          充值红包金额<el-input-number v-model="money" :controls="false" :min="0.3" :max="10000" :step="100" :precision="2" placeholder="追加红包金额" clearable />
          <el-button icon="el-icon-money" type="primary" @click="recharge">充值</el-button>
          <span class="tip-font">&nbsp;&nbsp;(充值金额：0.30~10000.00)</span>
        </span>
      </template>
      <template v-slot:btn>
        <el-button icon="el-icon-refresh" type="default" @click="search">刷新</el-button>
      </template>
      <!-- 操作时间 -->
      <template v-slot:add_time="props">
        <span>{{ props.scope.row.add_time|parseTime }}</span>
      </template>
    </ComplexTable>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import { apiBtn } from '@/api/default'

export default {
  components: { ComplexTable },
  data() {
    return {
      otherSearch: {
        id: ''
      },
      money: '',
      tableHeader: [{ prop: 'add_time', label: '充值时间', isCustomize: true },
        { prop: 'money', label: '充值金额(￥)' },
        { prop: 'balance', label: '余额(￥)' }
      ],
      tableData: [],
      pagination: {
        total: 0, // 总条数
        size: 10, // 每页显示条目个数
        page: 1 // 当前页数
      },
      selections: []
    }
  },
  created() {
    this.otherSearch.id = this.$route.query.id || ''
    this.getList()
    // 获取用户余额
    this.$store.dispatch('user/GetAccountBalance')
  },
  methods: {
    // 搜索活动
    search() {
      if (this.otherSearch.order || this.otherSearch.id) {
        this.getList()
      }
    },
    // 获取列表
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else {
        this.pagination = {
          page: 1,
          size: 10,
          total: 0
        }
      }
      const params = {
        ...this.otherSearch,
        size: this.pagination.size,
        page: this.pagination.page
      }
      apiBtn('PrestoredIndex', params)
        .then(res => {
          this.tableData = res.data.list
          this.pagination.total = res.data.total
        })
    },
    // 充值
    recharge() {
      if (!this.money) {
        this.$message('请先填写充值金额')
        return
      }
      apiBtn('PrestoredStore', { id: this.otherSearch.id, money: this.money })
        .then(res => {
          console.log(res)
          this.$store.commit('user/SET_MONEY', res.data.balance)
          this.getList()
        })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.user {
  color: #00aaed;
  cursor: pointer;
}
/deep/ {
  .tip-title{
    margin-bottom: 10px;
  }
  .search-card  .el-input-number{
    width: 200px;
    margin: 5px 10px;
    .el-input input{
      text-align: left;
    }
  }
}
</style>
