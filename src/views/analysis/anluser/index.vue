<template>
  <div class="app-container">
    <complex-table
      :page-name="'客户发展'"
      :pagination="pagination"
      :table-header="tableHeader"
      :table-data="tableData"
      @refreshTable="getCustomerList"
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
  name: 'CustomerAnalysis',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      showChart: false,
      formSearch: {
        time: []
      },
      tableHeader: [
        { prop: 'id', label: 'ID', width: 80 },
        { prop: 'name', label: '用户名' },
        { prop: 'remarks', label: '备注', isCustomize: true },
        { prop: 'createAccountNumber', label: '创建账号数', width: 160, sortable: true }
      ],
      tableData: [],
      pagination: {
        // 当前是第几页
        page: 1,
        // 一页几条
        size: 10,
        // 一共多少页
        total: 0
      },
      line: {
        sourceData: [
          { date: '2018年1月1日', admin: 5, ycsagent: 3 },
          { date: '2018年1月2日', admin: 8, ycsagent: 9 }
        ],
        transform: {
          type: 'fold',
          fields: ['admin', 'ycsagent'],
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
        this.getCustomerList()
      }
    }
  },
  created() {
    this.getCustomerList()
  },
  methods: {
    // 用户列表
    getCustomerList() {
      this.apiBtn('AnluserIndex', {
        ...this.formSearch,
        ...this.pagination
      }).then((res) => {
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
      this.getCustomerList()
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
