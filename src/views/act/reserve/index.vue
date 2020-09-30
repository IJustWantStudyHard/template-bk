<template>
  <div class="app-container">
    <ComplexTable
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      :page-name="'预约信息'"
      @refreshTable="getList"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <el-input v-model="otherSearch.act_id" placeholder="请输入活动ID" clearable @keyup.native.enter="search" @clear="getList" />
        <el-button icon="el-icon-search" type="primary" @click="search">搜索</el-button>
      </template>
      <template v-slot:btn>
        <div>
          <el-button v-has="'ReserveExport'" size="medium" icon="el-icon-download" @click="exportToExcel()">导出预约信息</el-button>
        </div>
      </template>
      <!-- 活动标题、ID -->
      <template v-slot:activity="props">
        <span>{{ props.scope.row.activity.name + '（' + props.scope.row.activity.id + '）' }}</span>
      </template>
      <!-- 操作 -->
      <template v-slot:action="props">
        <el-button v-has="'ReserveDestroy'" type="warning" size="small" @click="deleteItem(props.scope.row)">删除</el-button>
      </template>
    </ComplexTable>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import { defalultConfirm, deleteArrayById } from '@/utils'
import { apiBtn } from '@/api/default'
import { parseTime } from '@/utils'

export default {
  components: { ComplexTable },
  data() {
    return {
      otherSearch: {
        act_id: ''
      },
      tableData: [
        {
          id: 1,
          activity: {
            id: 1,
            name: ''
          },
          name: '',
          phone: '',
          add_time: '',
          choose: true // 精选
        }
      ],
      tableHeader: [
        { prop: 'shop_name', label: '活动商家' },
        { prop: 'activity', label: '活动(ID)', isCustomize: true },
        { prop: 'name', label: '预约姓名' },
        { prop: 'phone', label: '预约电话' },
        { prop: 'add_time', label: '提交时间' },
        { prop: 'action', label: '操作', isCustomize: true }
      ],
      pagination: {
        total: 0, // 总条数
        size: 10, // 每页显示条目个数
        page: 1 // 当前页数
      },
      selections: []
    }
  },
  created() {
    this.otherSearch.act_id = this.$route.query.id || ''
    this.getList()
  },
  methods: {
    // 搜索活动
    search() {
      if (this.otherSearch.act_id) {
        this.getList()
      }
    },
    // 获取投诉列表
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      const params = {
        size: this.pagination.size,
        page: this.pagination.page
      }
      if (this.otherSearch.act_id) params.act_id = this.otherSearch.act_id
      apiBtn('ReserveIndex', params)
        .then(res => {
          this.tableData = res.data.list
          this.pagination.total = res.data.total
        })
    },
    // 删除
    deleteItem(row) {
      const msg = '删除后将无法恢复'
      const callback = () => {
        apiBtn('ReserveDestroy', { id: [row.id] })
          .then((res) => {
            deleteArrayById(this.tableData, row.id)
          })
      }
      defalultConfirm(msg, callback)
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
      apiBtn('ReserveExport', this.otherSearch)
        .then(res => {
          // excel数据导出
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require('@/excel/Export2Excel')

            const tHeader = ['姓名', '电话', '预约时间']
            const filterVal = ['name', 'phone', 'add_time']
            const list = res.data.list
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '用户信息' + parseTime(new Date(), '{y}-{m}-{d}'))
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.user {
  color: #00aaed;
  cursor: pointer;
}
</style>
