<template>
  <div class="app-container">
    <complex-table
      :page-name="'领取记录'"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getReceivingRecordsList"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <el-form :inline="true" :model="formSearch" class="user-form-inline">
          <el-form-item>
            <DatePicker
              :value="formSearch.time"
              :has-shortcuts="true"
              :disabled-type="2"
              value-format="timestamp"
              @changeTime="changeTime"
            />
          </el-form-item>
          <el-form-item>
            <el-input v-model="formSearch.user" placeholder="请输入用户ID" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 用户 -->
      <template v-slot:user="slotProps">
        <div class="user-box">
          <img :src="slotProps.scope.row.user.avatar">
          <span>{{ slotProps.scope.row.user.nickname }}</span>
        </div>
      </template>
      <!-- 活动名称 -->
      <template v-slot:activityname="slotProps">
        <span>{{ slotProps.scope.row[slotProps.scope.column.property] }}</span>
      </template>
      <!-- 红包 -->
      <template v-slot:packetsnumber="slotProps">
        <span>{{ (slotProps.scope.row.packetsnumber / 100).toFixed(2) }}</span>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'
// import { getReceiveList } from '@/api/activity.js'
export default {
  name: 'UserList',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      formSearch: {
        user: '',
        time: []
      },
      tableHeader: [
        {
          prop: 'id',
          label: 'ID',
          width: 80,
          sortable: true
        },
        {
          prop: 'user',
          label: '用户',
          isCustomize: true
        },
        {
          prop: 'id',
          label: '活动ID'
        },
        {
          prop: 'activityname',
          label: '活动名称',
          over: true,
          isCustomize: true
        },
        {
          prop: 'activityarea',
          label: '活动区域',
          width: 200
        },
        {
          prop: 'pickuptime',
          label: '领取时间',
          width: 200
        },
        {
          prop: 'packetsnumber',
          label: '红包',
          isCustomize: true
        }
      ],
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
    'formSearch.time': {
      deep: true,
      handler() {
        this.getReceivingRecordsList()
      }
    }
  },
  created() {
    this.getReceivingRecordsList()
  },
  methods: {
    onSubmit() {
      this.getReceivingRecordsList()
    },
    // 领取记录列表
    getReceivingRecordsList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else {
        this.pagination = {
          page: 1,
          size: 10,
          total: 100
        }
      }
      // getReceiveList({
      //   page: this.pagination.page,
      //   size: this.pagination.size,
      //   ...this.formSearch
      // }).then((res) => {
      //   this.tableData = res.data.list
      //   this.pagination.total = res.data.total
      // })
    },
    changeTime(val) {
      this.formSearch.time = val
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.user-box {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    display: block;
    width: 40px;
    height: 40px;
    margin-right: 5px;
    border-radius: 50%;
  }
}
</style>

