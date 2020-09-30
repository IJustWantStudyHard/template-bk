<template>
  <div class="app-container">
    <complex-table
      :page-name="'文件管理'"
      :has-selection="true"
      :table-header="tableHeader"
      :table-data="tableData"
      :pagination="pagination"
      @refreshTable="getPicList"
      @changeMultipleSelection="changeMultipleSelection"
    >
      <!-- 搜索框 -->
      <template v-slot:search>
        <!-- 选取时间 -->
        <DatePicker
          :value="formSearch.time"
          :has-shortcuts="true"
          :disabled-type="2"
          value-format="timestamp"
          @changeTime="changeTime"
        />
        <el-input
          v-model="otherSearch.keywords"
          placeholder="请输入图片名称"
          clearable
          class="search-item"
          @keyup.native.enter="search"
          @clear="search"
        />
        <el-input v-model="otherSearch.user_id" placeholder="请输入用户ID" class="search-item" clearable @keyup.native.enter="search" @clear="search" />
        <el-button type="primary" icon="el-icon-search" class="search-item" @click="search">搜索</el-button>
      </template>
      <!-- 按钮 -->
      <template v-slot:btn>
        <el-button v-has="'UploadDestroy'" size="medium" type="warning" @click="delSelectPic()">批量删除</el-button>
      </template>
      <!-- 图片预览 -->
      <template v-slot:path="slotProps">
        <div v-if="slotProps.scope.row.type!==1"><img :src="slotProps.scope.row.path" width="60px"></div>
        <span v-else>无</span>
      </template>
      <!-- 大小 -->
      <template v-slot:size="slotProps">
        <span>{{ slotProps.scope.row.size | fileSize }}</span>
      </template>
      <!-- time -->
      <template v-slot:add_time="slotProps">
        <span>{{ slotProps.scope.row.add_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <!-- 操作 -->
      <template v-slot:action="slotProps">
        <el-button
          v-has="'UploadDestroy'"
          type="warning"
          size="small"
          @click="handleClick(slotProps.scope.row)"
        >删除</el-button>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import DatePicker from '@/components/Tool/DatePicker'
import { deleteArrayById } from '@/utils'
import { apiBtn } from '@/api/default'

export default {
  name: 'LogPic',
  components: { ComplexTable, DatePicker },
  data() {
    return {
      formSearch: {
        time: []
      },
      otherSearch: {
        keywords: '',
        user_id: ''
      },
      tableHeader: [
        { prop: 'id', label: 'ID', sortable: true, width: 80 },
        { prop: 'name', label: '文件名称', width: 300 },
        { prop: 'path', label: '图片预览', isCustomize: true },
        { prop: 'size', label: '文件大小', isCustomize: true },
        { prop: 'suffix', label: '后缀' },
        { prop: 'add_time', label: '添加时间', width: 160, isCustomize: true },
        { prop: 'action', label: '操作', isCustomize: true }
      ],
      pagination: {
        // 当前是第几页
        page: 1,
        // 一页几条
        size: 10,
        // 一共多少页
        total: 100
      },
      tableData: [],
      multipleSelection: []
    }
  },
  watch: {
    formSearch: {
      deep: true,
      handler() {
        this.getPicList()
      }
    }
  },
  created() {
    this.getPicList()
  },
  methods: {
    // 搜索
    search() {
      this.getPicList()
    },
    // 用户列表
    getPicList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else this.initPagination()
      var searchObj = {
        ...this.pagination,
        ...this.formSearch,
        ...this.otherSearch
      }
      delete searchObj.totaltotal
      apiBtn('UploadIndex', searchObj).then((res) => {
        this.tableData = res.data.list
        this.pagination.total = res.data.total
      })
    },
    delSelectPic() {
      if (this.multipleSelection.length === 0) this.$message('请选择图片')
      else {
        var arrId = this.multipleSelection.map((i) => { return i.id })
        this.defalultConfirm('选中图片线上删除后将无法恢复', () => {
          apiBtn('UploadDestroy', { id: arrId })
            .then((res) => {
              this.getPicList()
              this.multipleSelection = []
            })
        })
      }
    },
    handleClick(row) {
      this.defalultConfirm('删除' + row.name, () => {
        apiBtn('UploadDestroy', { id: [row.id] })
          .then((res) => {
            deleteArrayById(this.tableData, row.id)
          })
      })
    },
    changeMultipleSelection(val) {
      this.multipleSelection = val
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

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.el-date-editor {
  width: 380px;
}
</style>
