<template>
  <div class="app-container">
    <ComplexTable
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      :page-name="'卡劵领取日志'"
      @refreshTable="getList"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <el-input v-model="otherSearch.act_id" placeholder="请输入活动ID" clearable @keyup.native.enter="getList" @clear="getList" />
        <el-button icon="el-icon-search" type="primary" @click="getList">搜索</el-button>
      </template>
      <!-- 活动标题、ID -->
      <template v-slot:card="props">
        <span>{{ props.scope.row.card.title + '（' + props.scope.row.card.id + '）' }}</span>
      </template>
      <!-- 领取时间 -->
      <template v-slot:add_time="props">
        <span>{{ props.scope.row.add_time | parseTime('{y}-{m}-{d}') }}</span>
      </template>
      <!-- 用户头像、昵称 -->
      <template v-slot:user="props">
        <div class="user-avater">
          <img :src="props.scope.row.user.avatar">
          <span>{{ props.scope.row.user.nickname }}</span>
          <span class="user" @click="toRedirect('ActivityActuser', { user_id: props.scope.row.user.id })"> {{ '（' + props.scope.row.user.id + '）' }}</span>
        </div>
      </template>
      <!-- 手机号 -->
      <template v-slot:phone="props">
        <span>{{ props.scope.row.user.phone }}</span>
      </template>
      <!-- 活动状态 -->
      <template v-slot:status="props">
        <span>{{ props.scope.row.status?'已核销':'未核销' }}</span>
      </template>
      <!-- 活动标题、ID -->
      <template v-slot:activity="props">
        <span>{{ props.scope.row.activity.name + '（' + props.scope.row.activity.id + '）' }}</span>
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
      otherSearch: {
        act_id: ''
      },
      tableData: [],
      pagination: {
        total: 0, // 总条数
        size: 10, // 每页显示条目个数
        page: 1 // 当前页数
      },
      tableHeader: [
        { prop: 'card', label: '卡劵（ID）', isCustomize: true },
        { prop: 'code', label: '卡劵核销码', width: 180 },
        { prop: 'status', label: '卡劵状态', isCustomize: true },
        { prop: 'add_time', label: '领取时间', isCustomize: true },
        { prop: 'user', label: '用户(ID)', isCustomize: true, width: 160 },
        { prop: 'phone', label: '手机号', isCustomize: true },
        { prop: 'activity', label: '活动', isCustomize: true }
      ]
    }
  },
  created() {
    this.otherSearch.act_id = this.$route.query.id || ''
    this.getList()
  },
  methods: {
    // 获取投诉列表
    getList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      const params = {
        ...this.otherSearch,
        size: this.pagination.size,
        page: this.pagination.page
      }
      this.apiBtn('CardlogIndex', params)
        .then(res => {
          this.tableData = res.data.list
          this.pagination.total = res.data.total
        })
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

<style lang="scss" rel="stylesheet/scss" scoped>
.user {
  color: #00aaed;
  cursor: pointer;
}
</style>
