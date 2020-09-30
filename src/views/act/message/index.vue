<template>
  <div class="app-container">
    <ComplexTable
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      :page-name="'评论管理'"
      @refreshTable="getList"
    >
      <!-- 搜索 -->
      <template v-slot:search>
        <el-input v-model="otherSearch.act_id" placeholder="请输入活动ID" clearable @keyup.native.enter="search" @clear="getList" />
        <el-button icon="el-icon-search" type="primary" @click="search">搜索</el-button>
      </template>
      <!-- 用户头像、昵称 -->
      <template v-slot:user="props">
        <div class="user-avater">
          <img :src="props.scope.row.user.avatar">
          <span>{{ props.scope.row.user.nickname }}</span>
        </div>
      </template>
      <!-- 活动标题、ID -->
      <template v-slot:activity="props">
        <span>{{ props.scope.row.activity.name + '（' + props.scope.row.activity.id + '）' }}</span>
      </template>
      <template v-slot:like="props">
        <template v-if="props.scope.row.edit_like && $_has('MessagePatch')">
          <el-input
            v-model="props.scope.row.like"
            v-focus="props.scope.row.edit_like"
            size="small"
            class="edit-input"
            @blur="confirmEdit(props.scope.row)"
          />
        </template>
        <span
          v-else
          :style="$_has('MessagePatch')?'cursor: pointer;':''"
          @click="props.scope.row.edit_like =! props.scope.row.edit_like"
        >{{ props.scope.row.like }}</span>
      </template>
      <template v-slot:choose="props">
        <el-tooltip :content="props.scope.row.choose ? '精选留言' : '普通留言'" placement="top">
          <el-switch
            v-model="props.scope.row.choose"
            :disabled="!$_has('MessagePatch')"
            @change="changeSwitch('MessagePatch', props.scope.row)"
          />
        </el-tooltip>
      </template>
      <!-- 操作 -->
      <template v-slot:operation="props">
        <el-button v-show="props.scope.row.choose" v-has="'MessagePatch'" type="danger" size="small" @click="topItem('MessagePatch',props.scope.row)">{{ props.scope.row.top?'取消置顶':'置顶' }}</el-button>
        <el-button v-has="'MessageDestroy'" type="warning" size="small" @click="deleteItem(props.scope.row)">删除</el-button>
      </template>
    </ComplexTable>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import { deleteArrayById } from '@/utils'
import { apiBtn } from '@/api/default'
import { validateNumber } from '@/utils/validate'

export default {
  components: { ComplexTable },
  data() {
    return {
      otherSearch: {
        act_id: ''
      },
      tableData: [
        // {
        //   id: 1,
        //   user: {
        //     avatar: '',
        //     nickname: ''
        //   },
        //   activity: {
        //     id: 1,
        //     name: ''
        //   },
        //   shop_name: '',
        //   message: '',
        //   like: 0,
        //   original_like: 0,
        //   edit_like: false,
        //   add_time: '',
        //   choose: true // 精选
        //   top: true // 置顶
        // }
      ],
      tableHeader: [
        { prop: 'shop_name', label: '活动商家' },
        { prop: 'activity', label: '活动(ID)', isCustomize: true },
        { prop: 'user', label: '用户', isCustomize: true },
        { prop: 'message', label: '留言' },
        { prop: 'like', label: '点赞数', isCustomize: true },
        { prop: 'add_time', label: '时间', width: '160px' },
        { prop: 'choose', label: '精选', isCustomize: true },
        { prop: 'operation', label: '操作', isCustomize: true, width: '180px' }
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
      if (this.otherSearch.order || this.otherSearch.act_id) {
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
      apiBtn('MessageIndex', params)
        .then(res => {
          for (const item of res.data.list) {
            item.original_like = item.like
            item.edit_like = false
          }
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
    },
    // 删除
    deleteItem(row) {
      const msg = '删除后将无法恢复'
      const callback = () => {
        apiBtn('MessageDestroy', { id: [row.id] })
          .then((res) => {
            deleteArrayById(this.tableData, row.id)
          })
      }
      this.defalultConfirm(msg, callback)
    },
    // 开关控制 精选
    changeSwitch(name, row) {
      const msg = (row.choose ? '选中该留言为精选' : '取消该留言的精选') + ',是否继续？'
      const params = {
        id: row.id,
        choose: row.choose
      }
      const catchBack = () => {
        this.$set(row, 'choose', row.choose = !row.choose)
      }
      const callBack = () => {
        apiBtn(name, params)
          .then(res => {
            this.$set(row, 'choose', row.choose)
          })
          .catch(res => {
            catchBack()
          })
      }
      this.defalultConfirm(msg, callBack, catchBack)
    },
    // 置顶
    topItem(name, row) {
      const msg = (row.top ? '取消该留言的置顶' : '置顶该留言') + ',是否继续？'
      const params = {
        id: row.id,
        top: !row.top
      }
      const callBack = () => {
        apiBtn(name, params)
          .then(res => {
            this.$set(row, 'top', !row.top)
          })
      }
      this.defalultConfirm(msg, callBack)
    },
    // 修改点赞数
    confirmEdit(row) {
      if (row.original_like === row.like) {
        row.edit_like = false
        return
      }
      const params = {
        id: row.id,
        like: row.like
      }
      // 校验数字且大于0
      if (validateNumber(row.like - 0) && (row.like - 0) >= 0) {
        apiBtn('MessagePatch', params)
          .then(res => {
            this.$set(row, 'original_like', row.like)
            row.edit_like = false
          })
          .catch(res => {
            this.$set(row, 'like', row.original_like)
            row.edit_like = false
          })
      } else {
        this.$set(row, 'like', row.original_like)
        row.edit_like = false
        this.$message('请输入数字')
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
