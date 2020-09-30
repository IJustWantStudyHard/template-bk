<template>
  <div class="app-container">
    <complex-table
      :page-name="'客户筛选'"
      :has-pagination="false"
      :table-header="tableHeader"
      :table-data="profitList"
      @refreshTable="getList"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <DatePicker
          v-if="'156'.indexOf($store.state.user.roles) > -1"
          :value="formSearch.time"
          :has-shortcuts="true"
          value-format="timestamp"
          @changeTime="changeTime"
        />
        <el-button icon="el-icon-search" type="primary" @click="getList">搜索</el-button>
      </template>
      <!-- 地区 -->
      <template v-slot:area="props">
        <span>{{ props.scope.row.area_id | areaFilter }}</span>
      </template>

    </complex-table>
  </div>
</template>

<script>
import DatePicker from '@/components/Tool/DatePicker'
import ComplexTable from '@/components/Table/ComplexTable'
import { apiBtn } from '@/api/default'
import { getCity } from '@/utils/area'

export default {
  name: 'Profit',
  components: { ComplexTable, DatePicker },
  filters: {
    areaFilter: function(val) {
      const nameList = getCity(val, true)
      let name = ''
      for (const item of nameList) {
        name = name + item.name
      }
      return name
    }
  },
  data() {
    return {
      formSearch: {
        time: ''
      },
      tableHeader: [
        { prop: 'id', label: 'ID', width: 70, sortable: true },
        { prop: 'username', label: '用户名' },
        { prop: 'area', label: '地区', isCustomize: true },
        { prop: 'remark', label: '备注' },
        { prop: 'count', label: '门店数', width: 100, sortable: true }
      ],
      profitList: []
    }
  },
  created() {
    this.initTime()
    this.$store.dispatch('area/GetArea')
      .then(() => {
        this.getList()
      })
  },
  methods: {
    // 用户列表
    getList() {
      apiBtn('ProfitIndex', this.formSearch)
        .then(response => {
          this.profitList = response.data
        })
    },
    changeTime(val) {
      this.formSearch.time = val
      this.getList()
    },
    // 初始化搜索时间为当前一个月
    initTime() {
      const end = new Date().getTime() / 1000
      const start = (new Date().getTime() - 3600 * 1000 * 24 * 30) / 1000
      this.formSearch.time = [start, end]
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
