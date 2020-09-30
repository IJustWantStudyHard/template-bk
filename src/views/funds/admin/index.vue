<template>
  <div class="app-container">
    <complex-table
      :page-name="'账户金额统计'"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getList"
    >
      <!-- 搜索框 -->
      <template v-slot:search>
        <el-input
          v-model="otherSearch.uid"
          placeholder="请输入完整的用户id"
          clearable
          class="search-item"
          @keyup.native.enter="search"
          @clear="search"
        />
        <!-- 选取时间 -->
        <DatePicker
          :value="formSearch.time"
          :has-shortcuts="true"
          value-format="timestamp"
          @changeTime="changeTime"
        />
        <el-select v-model="formSearch.type" placeholder="请选择" clearable>
          <el-option
            v-for="(item,index) in typeOption"
            :key="index"
            :label="item"
            :value="index"
          />
        </el-select>
        <el-button type="primary" icon="el-icon-search" class="search-item" @click="search">搜索</el-button>
      </template>
      <template v-slot:time="props">
        <span>{{ props.scope.row.time | parseTime() }}</span>
      </template>
      <template v-slot:type="props">
        <span>{{ typeOption[props.scope.row.type] }}</span>
      </template>
      <template v-slot:user="props">
        <span>{{ props.scope.row.username }}({{ props.scope.row.uid }})</span>
      </template>
      <template v-slot:money="props">
        <span>{{ typeTip[props.scope.row.type] }}{{ props.scope.row.money }}</span>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'
import { apiBtn } from '@/api/default'

export default {
  name: 'LogPic',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      formSearch: {
        time: [],
        type: ''
      },
      otherSearch: {
        uid: ''
      },
      tableHeader: [
        { label: '日期', prop: 'time', sortable: true, width: 160, isCustomize: true },
        { label: '用户', prop: 'user', isCustomize: true },
        { label: '类型', prop: 'type', isCustomize: true },
        { label: '操作金额', prop: 'money', width: 110, isCustomize: true },
        { label: '余额', prop: 'balance' }
      ],
      //  1=活动充值 2=创建活动 3=账户充值  4=提现 5=活动结算归还 6=人工充值',
      typeOption: {
        1: '活动充值',
        3: '账户充值',
        4: '提现',
        5: '活动结算归还',
        6: '人工充值'
      },
      typeTip: {
        1: '-',
        3: '+',
        4: '-',
        5: '+',
        6: '+'
      },
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
        ...this.formSearch,
        ...this.otherSearch
      }
      delete searchObj.total
      apiBtn('AdminIndex', searchObj).then((res) => {
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
