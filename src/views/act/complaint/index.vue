<template>
  <div class="app-container">
    <ComplexTable
      :has-selection="true"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      :page-name="'投诉列表'"
      @refreshTable="getList"
      @changeMultipleSelection="selectMore"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <el-input v-model="otherSearch.act_id" placeholder="请输入活动ID" clearable @keyup.native.enter="search" @clear="getList" />
        <el-button icon="el-icon-search" type="primary" @click="search">搜索</el-button>
      </template>
      <!-- 批量删除 -->
      <template v-slot:btn>
        <el-button v-has="'ComplaintDestroy'" size="medium" type="warning" @click="deleteMore">批量删除</el-button>
      </template>
      <!-- 用户头像、昵称 -->
      <template v-slot:user="props">
        <div class="user-avater">
          <img :src="props.scope.row.user.avatar">
          <span>{{ props.scope.row.user.nickname }}</span>
          <span class="user" @click="toRedirect('ActivityActuser', { user_id: props.scope.row.user.id })">{{ '（' + props.scope.row.user.id + '）' }}</span>
        </div>
      </template>
      <!-- 手机号 -->
      <template v-slot:phone="props">
        <span>{{ props.scope.row.user.phone }}</span>
      </template>
      <!-- 活动标题、ID -->
      <template v-slot:activity="props">
        <span>{{ props.scope.row.activity.name + '（' + props.scope.row.activity.id + '）' }}</span>
      </template>
      <template v-slot:reason_ids="props">
        <span v-for="(item,index) in props.scope.row.reason_ids" :key="'reason_ids'+index">{{ complaint[item] }}</span>
      </template>
      <!-- 操作 -->
      <template v-slot:operation="props">
        <el-button v-has="'ComplaintDestroy'" type="warning" size="small" @click="deleteItem(props.scope.row)">删除</el-button>
      </template>
    </ComplexTable>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import { deleteArrayById } from '@/utils'

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
          add_time: '1',
          user: {
            id: 1,
            avatar: '1',
            nickname: '1',
            phone: '1'
          },
          activity: {
            id: 1,
            name: '1'
          },
          reason_ids: [1], // 原因
          reason_description: '' // 详细内容
        }
      ],
      pagination: {
        total: 0, // 总条数
        size: 10, // 每页显示条目个数
        page: 1 // 当前页数
      },
      selections: [],
      complaint: {
        1: '网页包含欺诈信息（如：假红包)',
        2: '网页包含色情信息',
        3: '网页包含暴力恐怖信息',
        4: '网页包含政治敏感信息',
        5: '网页在搜集个人隐私信息（如：钓鱼链接）',
        6: '网页包含诱导分享/关注性质的内容',
        7: '网页可能包含谣言信息',
        8: '网页包含赌博信息'
      }
    }
  },
  computed: {
    tableHeader: function() {
      const arr = [
        { prop: 'add_time', label: '时间' },
        { prop: 'user_id', label: '用户ID', width: 80, isCustomize: true },
        { prop: 'user', label: '用户', width: 180, isCustomize: true },
        { prop: 'phone', label: '手机号', isCustomize: true },
        { prop: 'reason_ids', label: '原因', width: 300, isCustomize: true },
        { prop: 'reason_description', label: '详细内容' },
        { prop: 'activity', label: '活动(ID)', isCustomize: true },
        { prop: 'operation', label: '操作', isCustomize: true }
      ]
      if (this.$store.state.user.roles[0] !== 1) {
        arr.splice(7, 1)
      }
      return arr
    }
  },
  created() {
    console.log(this)
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
        ...this.otherSearch,
        size: this.pagination.size,
        page: this.pagination.page
      }
      this.apiBtn('ComplaintIndex', params)
        .then(res => {
          this.tableData = res.data.list
          this.pagination.total = res.data.total
        })
    },
    // 删除
    deleteItem(row) {
      const msg = '删除后将无法恢复'
      const callback = () => {
        this.apiBtn('ComplaintDestroy', { id: [row.id] })
          .then((res) => {
            deleteArrayById(this.tableData, row.id)
          })
      }
      this.defalultConfirm(msg, callback)
    },
    deleteMore() {
      if (this.selections.length) {
        const arr = this.selections.map((i) => { return i.id })
        const msg = '删除后将无法恢复'
        const callback = () => {
          this.apiBtn('ComplaintDestroy', { id: arr })
            .then((res) => {
              this.getList()
            })
        }
        this.defalultConfirm(msg, callback)
      } else {
        this.$message({
          type: 'warning',
          message: '至少选择一项'
        })
      }
    },
    selectMore(val) {
      this.selections = val
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

<style lang="scss" rel="stylesheet/scss" scoped>
.user {
  color: #00aaed;
  cursor: pointer;
}
</style>
