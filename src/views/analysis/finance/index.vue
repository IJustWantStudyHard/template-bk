<template>
  <div class="app-container">
    <complex-table
      :page-name="'财务分析'"
      :pagination="pagination"
      :table-header="tableHeader"
      :table-data="tableData"
      @refreshTable="getFinanceList"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <el-form :inline="true" :model="formSearch" class="user-form-inline">
          <el-form-item>
            <date-picker
              :value="formSearch.time"
              :has-shortcuts="true"
              :disabled-type="2"
              value-format="timestamp"
              @changeTime="changeTime"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 日期 -->
      <template v-slot:date="props">
        <span>{{ props.scope.row.date| parseTime('{y}-{m}-{d}') }}</span>
      </template>
      <!-- 支出 -->
      <template v-slot:payment="props">
        <span>{{ (props.scope.row[props.scope.column.property] / 100).toFixed(2) }}</span>
      </template>
      <template v-slot:btn>
        <el-button @click="show()">{{ showChart?'隐藏表单':'查看表单' }}</el-button>
      </template>
      <el-card v-show="showChart" class="chart-card">
        <!-- <line-chart
          ref="line"
          :hack-reset="showChart"
          :source-data="line.sourceData"
          :transform="line.transform"
          :scale="line.scale"
          :position="line.position"
          :padding="{ top: 30, right: 70, bottom: 90, left: 60 }"
        /> -->
      </el-card>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'
// import LineChart from '@/components/chart/LineChart'

import { datedifference } from '@/utils'
export default {
  name: 'FinanceAnalysis',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      showChart: false,
      formSearch: {
        time: []
      },
      tableHeader: [
        {
          prop: 'id',
          label: 'ID',
          width: 80
        },
        {
          prop: 'date',
          label: '日期',
          isCustomize: true
        },
        {
          prop: 'payment',
          label: '支出',
          sortable: true,
          isCustomize: true
        },
        {
          prop: 'payment_count',
          label: '支出数量',
          sortable: true
        }
      ],
      tableData: [],
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      line: {
        sourceData: [
          { date: '2018年1月1日', '支出': 5, '支出数量': 3 }
        ],
        transform: {
          type: 'fold',
          fields: ['支出', '支出数量'],
          key: 'name',
          value: 'count'
        },
        scale: [{
          dataKey: 'date',
          min: 0,
          max: 1
        }],
        position: 'date*count'
      }
    }
  },
  watch: {
    formSearch: {
      deep: true,
      handler() {
        this.pagination = {
          page: 1,
          size: 10,
          total: 0
        }
        this.getFinanceList()
      }
    }
  },
  created() {
    this.getFinanceList()
  },
  methods: {
    // 用户列表
    getFinanceList() {
      this.apiBtn('FinanceIndex',
        { ...this.formSearch, ...this.pagination })
        .then((res) => {
          this.tableData = res.data.list
          this.line.sourceData = res.data.line.sourceData
          this.line.transform.fields = res.data.line.fields
          this.pagination.total = res.data.total
        })
    },
    onSubmit() {
      if (!this.formSearch.time[0]) {
        this.$message('请选择时间段')
        return
      } else {
        var d = datedifference(this.formSearch.time[0], this.formSearch.time[1])
        if (d > 31 || d < 5) {
          this.$message({
            message: '请选择5~31天',
            type: 'warning'
          })
          return
        }
      }
      this.getFinanceList()
    },
    changeTime(val) {
      this.formSearch.time = val
    },
    show() {
      this.showChart = !this.showChart
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.chart-card {
  margin-bottom: 20px;
}
</style>
