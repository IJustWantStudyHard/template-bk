<template>
  <div class="app-container">
    <ComplexTable
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      :page-name="'红包追加日志'"
      @refreshTable="getList"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <tip size="big">活动id:{{ otherSearch.id }}</tip>
        <div v-has="'AppendStore'">
          追加红包数量<el-input-number v-model="number" :controls="false" :min="1" :max="5000" :step="1" step-strictly placeholder="追加红包数量" clearable />
          <el-button icon="el-icon-plus" type="primary" @click="add">追加</el-button>
        </div>
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
      number: 1,
      tableHeader: [{ prop: 'add_time', label: '追加时间', isCustomize: true },
        { prop: 'number', label: '追加数量' },
        { prop: 'number_total', label: '总量' }],
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
      apiBtn('AppendIndex', params)
        .then(res => {
          this.tableData = res.data.list
          this.pagination.total = res.data.total
        })
    },
    // 追加红包
    add() {
      if (!this.number) {
        this.$message('请先填写追加数量')
        return
      }
      apiBtn('AppendStore', { id: this.otherSearch.id, number: this.number })
        .then(res => {
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
