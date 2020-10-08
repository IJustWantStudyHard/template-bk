<template>
  <div class="app-container">
    <ComplexTable
      :has-search="false"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      :page-name="`红包领取记录(活动id:${otherSearch.id })`"
      @refreshTable="refreshTable"
    >
      <template v-slot:btn>
        <div>
          <el-button icon="el-icon-refresh" size="medium" type="default" @click="search">刷新</el-button>
          <el-button v-has="'PhoneExport'" size="medium" icon="el-icon-download" @click="exportToExcel()">导出用户信息</el-button>
        </div>
      </template>
      <!-- 领取时间 -->
      <template v-slot:add_time="props">
        <span>{{ props.scope.row.add_time|parseTime }}</span>
      </template>
      <template v-slot:type="props">
        <span>{{ typeOption[props.scope.row.type] }}</span>
      </template>
      <!-- 用户头像、昵称 -->
      <template v-slot:user="props">
        <div class="user-avater">
          <img :src="props.scope.row.avatar">
          <span>{{ props.scope.row.nickname }}</span>
        </div>
      </template>

      <!-- 操作 -->
      <template v-slot:action="props">
        <div>
          <el-button v-if="props.scope.row.location" v-has="'DecodeLocation'" type="primary" size="medium" @click="getLocation(props.scope.row)">获取距离</el-button>
        </div>
      </template>
    </ComplexTable>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'

export default {
  components: { ComplexTable },
  data() {
    return {
      type: 1, // 1城市，2范围
      otherSearch: {
        id: ''
      },
      addFrom: {
        add_money: '',
        add_num: ''
      },
      tableData: [],
      pagination: {
        total: 0, // 总条数
        size: 10, // 每页显示条目个数
        page: 1 // 当前页数
      },
      selections: [],
      typeOption: {
        2: '分享奖励',
        4: '推广奖励',
        5: '点击赚钱'

      }
    }
  },
  computed: {
    tableHeader() {
      let arr = [
        { prop: 'add_time', label: '领取时间', isCustomize: true },
        { prop: 'user', label: '用户', isCustomize: true },
        { prop: 'phone', label: '电话', isCustomize: true },
        { prop: 'type', label: '奖励类型', isCustomize: true },
        { prop: 'money', label: '红包金额(￥)' }]
      if ([1, 5].includes(this.$store.getters.roles[0])) {
        arr = arr.concat([
          { prop: 'ip', label: 'ip', isCustomize: true },
          { prop: 'location', label: '地理位置' }
        ])
      }
      // 当活动红包按照范围领取时才有操作列
      if (this.type === 2 && this.$_has('DecodeLocation')) {
        arr.push({ prop: 'action', label: '操作', isCustomize: true })
      }

      return arr
    }
  },
  watch: {
    otherSearch: {
      deep: true,
      handler(newVal) {
        this.initPagination()
      }
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
    // 分页器刷新表格
    refreshTable(e) {
      this.pagination = e
      this.getList()
    },
    // 获取列表
    getList() {
      const params = {
        ...this.otherSearch,
        size: this.pagination.size,
        page: this.pagination.page
      }
      this.apiBtn('RedIndex', params)
        .then(res => {
          this.tableData = res.data.list
          this.pagination.total = res.data.total
          this.type = res.data.type
        })
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
        act_id: this.otherSearch.id
      }
      this.apiBtn('PhoneExport', params)
        .then(res => {
          // excel数据导出
          require.ensure([], () => {
            const {
              export_json_to_excel
            } = require('@/excel/Export2Excel')

            const tHeader = ['昵称', '电话']
            const filterVal = ['name', 'phone']
            const list = res.data.list
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '用户信息' + this.parseTime(new Date(), '{y}-{m}-{d}'))
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getLocation(obj) {
      this.apiBtn('DecodeLocation', { id: this.otherSearch.id, location: obj.location })
        .then(res => {
          const h = this.$createElement
          this.$msgbox({
            title: '消息',
            message: h('p', null, [
              h('span', null, obj.nickname + '距离活动中心' + res.data + 'km')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
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
