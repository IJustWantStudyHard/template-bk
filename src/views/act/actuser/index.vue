<template>
  <div class="app-container">
    <complex-table
      :page-name="'活动用户'"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getUserList"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <el-form :inline="true" :model="otherSearch" class="user-form-inline">
          <el-form-item>
            <el-input v-model="otherSearch.user_id" placeholder="请输入用户ID|用户名称" clearable @keyup.native.enter="onSubmit" @clear="onSubmit" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="otherSearch.act_id" placeholder="请输入活动ID" clearable @keyup.native.enter="onSubmit" @clear="onSubmit" />
          </el-form-item>

          <!-- robot 是否封禁 0否1 是 -->
          <el-select v-model="formSearch.robot" v-has="'ActuserUpdate'" clearable placeholder="请选择该用户是否封禁">
            <el-option v-for="item in optionStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 用户 -->
      <template v-slot:user="props">
        <div class="user-avater">
          <img :src="props.scope.row.user.avatar">
          <span>{{ props.scope.row.user.nickname }}</span>
        </div>
      </template>
      <!-- 操作 -->
      <template v-slot:action="props">
        <el-button
          v-show="props.scope.row.robot === 0"
          v-has="'ActuserUpdate'"
          type="warning"
          size="small"
          @click="handleClick(props.scope.row)"
        >标记</el-button>
        <el-button
          v-show="props.scope.row.robot === 1"
          v-has="'ActuserUpdate'"
          type="primary"
          size="small"
          @click="handleClick(props.scope.row)"
        >解禁</el-button>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'

export default {
  name: 'UserList',
  components: { ComplexTable },
  data() {
    return {
      formSearch: {
        robot: ''
      },
      otherSearch: {
        user_id: '',
        act_id: ''
      },
      pagination: {
        // 当前是第几页
        page: 1,
        // 一页几条
        size: 10,
        // 一共多少页
        total: 100
      },
      // robot 0 不是机器人 1 是机器人
      tableData: [],
      optionStatus: [
        { value: 0, label: '未封禁' },
        { value: 1, label: '已封禁' }
      ]
    }
  },
  computed: {
    tableHeader: function() {
      const user = this.$store.state.user
      const arr = [
        { prop: 'userId', label: '用户ID', sortable: true },
        { prop: 'user', label: '用户', width: 180, isCustomize: true },
        { prop: 'last_login_time', label: '访问时间', width: 160 },
        { prop: 'ip', label: 'IP' }
      ]
      // 角色为 管理员、运营、会计 时，添加openid
      if ('156'.indexOf(user.roles[0]) >= 0) {
        arr.push(
          { prop: 'openid', label: 'openid', width: 300 },
          { prop: 'action', label: '操作', isCustomize: true }
        )
      }
      return arr
    }
  },
  watch: {
    formSearch: {
      deep: true,
      handler(newVal, oldVal) {
        this.initPagination()
        this.getUserList()
      }
    },
    otherSearch: {
      deep: true,
      handler(newVal) {
        this.initPagination()
      }
    }
  },
  created() {
    this.otherSearch.act_id = this.$route.query.id || ''
    this.otherSearch.user_id = this.$route.query.user_id || ''
    this.getUserList()
  },
  methods: {
    // 用户列表
    getUserList() {
      this.apiBtn('ActuserIndex', {
        page: this.pagination.page,
        size: this.pagination.size,
        ...this.otherSearch,
        ...this.formSearch

      })
        .then((res) => {
          this.tableData = res.data.list
          this.pagination.total = res.data.total
        })
    },
    onSubmit() {
      this.getUserList()
    },
    handleClick(row) {
      this.defalultConfirm(row.robot === 0 ? '标记该用户' : '解除标记该用户', () => {
        this.apiBtn('ActuserUpdate', { id: row.userId, robot: row.robot === 0 ? 1 : 0 })
          .then((res) => {
            row.robot = res.data.robot
          })
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

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
