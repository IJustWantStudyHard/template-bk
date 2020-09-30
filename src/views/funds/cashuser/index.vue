<template>
  <div class="app-container">
    <complex-table
      :page-name="'用户提现记录'"
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
        <el-input
          v-model="otherSearch.keywords"
          placeholder="请输入完整的用户名"
          clearable
          class="search-item"
          @keyup.native.enter="search"
          @clear="search"
        />
        <el-button type="primary" icon="el-icon-search" class="search-item" @click="search">搜索</el-button>
      </template>

      <template v-slot:add_time="slotProps">{{ slotProps.scope.row.add_time|parseTime() }}</template>
      <template v-slot:type="slotProps">{{ typeOptions[slotProps.scope.row.type] }}</template>
      <!-- 用户 -->
      <template v-slot:user="props">
        <div class="user-avater">
          <img :src="props.scope.row.user.avatar">
          <span>{{ props.scope.row.user.nickname }}</span>
        </div>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'
import { removeProperty } from '@/utils'
import { apiBtn } from '@/api/default'

export default {
  name: 'LogPic',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      formSearch: {
        time: []
      },
      otherSearch: {
        keywords: ''
      },
      tableHeader: [
        { label: '提现时间', prop: 'add_time', isCustomize: true, sortable: true },
        { label: '用户', prop: 'user', isCustomize: true },
        { label: '提现金额', prop: 'money' }
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
      typeOptions: {
        1: '微信提现'
      },
      userId: this.$store.getters.userId
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
      apiBtn('CashuserIndex', removeProperty({ ...searchObj })).then((res) => {
        this.tableData = res.data.list
        this.pagination.total = res.data.total
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
