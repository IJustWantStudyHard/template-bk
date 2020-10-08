<template>
  <div class="app-container">
    <complex-table
      :page-name="'交易日志'"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getLogList"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <el-form :inline="true" :model="formSearch" class="user-form-inline">
          <!-- 选取时间 -->
          <DatePicker
            :value="formSearch.time"
            :has-shortcuts="true"
            :disabled-type="2"
            value-format="timestamp"
            @changeTime="changeTime"
          />
          <el-select v-model="formSearch.type" placeholder="请选择资金类型" clearable>
            <el-option
              v-for="(item,index) in typeOption "
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="formSearch.user" clearable placeholder="请输入ID|用户名|备注" @keyup.native.enter="search" />

          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

        </el-form>
      </template>
      <!-- 时间 -->

      <template v-slot:time="slotProps">
        <span>{{ slotProps.scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <!-- 类型 -->
      <template v-slot:type="slotProps">
        <span>{{ slotProps.scope.row.type | typeFilter }}</span>
      </template>
      <!-- 金额详情 -->
      <template v-slot:amountDetails="slotProps">
        <span v-if="slotProps.scope.row.type === 3||slotProps.scope.row.type === 5">{{ '+' + slotProps.scope.row.amountDetails }}</span>
        <span v-else>{{ '-' + slotProps.scope.row.amountDetails }}</span>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'

export default {
  name: 'LogBusiness',
  components: { ComplexTable, DatePicker },
  filters: {
    typeFilter: function(val) {
      //  1=活动充值 2=创建活动 3=账户充值  4=提现 5=活动结算归还
      const obj = {
        1: '活动充值',
        2: '创建活动',
        3: '账户充值',
        4: '提现',
        5: '活动结算归还',
        6: '人工充值'
      }
      return obj[val]
    }
  },
  data() {
    return {
      formSearch: {
        type: '',
        time: [],
        user: ''
      },
      tableHeader: [
        { prop: 'time', label: '时间', width: 160, isCustomize: true },
        { prop: 'type', label: '类型', isCustomize: true },
        { prop: 'logdetails', label: '日志详情', width: 300 },
        { prop: 'amountDetails', label: '金额详情', isCustomize: true },
        { prop: 'balance', label: '剩余金额', width: 200 },
        { prop: 'userinfo', label: '用户信息' }
      ],
      pagination: {
        // 当前是第几页
        page: 1,
        // 一页几条
        size: 10,
        // 一共多少页
        total: 100
      },
      // state 0 未标记 1 已标记
      tableData: [
        {
          time: 123456,
          type: 0,
          logdetails: '',
          amountDetails: '',
          balance: 200,
          userinfo: ''
        }
      ],
      // 1=活动充值 2=创建活动 3=账户充值  4=提现 5=活动结算归还 6=人工充值
      typeOption: [
        {
          label: '活动充值',
          value: 1
        }, {
          label: '账户充值',
          value: 3
        }, {
          label: '提现',
          value: 4
        }, {
          label: '活动结算归还',
          value: 5
        }, {
          label: '人工充值',
          value: 6
        }
      ]
    }
  },
  watch: {
    'formSearch.type': {
      deep: true,
      handler() {
        this.getLogList()
      }
    },
    'formSearch.time': {
      deep: true,
      handler() {
        this.getLogList()
      }
    }
  },
  created() {
    this.getLogList()
  },
  methods: {
    search() {
      this.getLogList()
    },
    getLogList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else {
        this.pagination = {
          page: 1,
          size: 10,
          total: 0
        }
      }
      this.apiBtn('BusinessIndex', {
        page: this.pagination.page, size: this.pagination.size,
        ...this.formSearch
      }).then((res) => {
        this.tableData = res.data.list
        this.pagination.total = res.data.total
      })
    },

    changeTime(val) {
      this.formSearch.time = val
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin: 5px 0;
}
</style>

