<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <div>
            <tip title="基础设置" />
            <el-button
              v-has="'SettingsStore'"
              style="float: right;margin-bottom:10px"
              size="medium"
              @click="refresh"
            >刷新</el-button>
            <el-button
              v-has="'SettingsStore'"
              type="primary"
              style="float: right;margin-bottom:10px;margin-right:10px"
              size="medium"
              @click="addSetting"
            >添加基础设置</el-button>

            <setting-table :list="defaultList" :list-loading="listLoading" @updatePic="updatePic" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <setting-dialog
      :is-visible="isDialogVisible"
      @addSettingList="addSettingList"
      @changeDialog="changeDialog"
    />
  </div>
</template>
<script>
import SettingDialog from '@/components/Dialog/SettingDialog' // base on element-ui
import SettingTable from '@/components/Table/SettingTable' // base on element-ui

export default {
  name: 'InlineEditTable',
  components: {
    SettingDialog,
    SettingTable
  },
  data() {
    return {
      defaultList: null,
      weixinList: null,
      listLoading: true,
      isDialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.apiBtn('SettingsIndex')
        .then(response => {
          this.defaultList = this.traversingList(response.data)
          this.listLoading = false
        })
    },
    traversingList(list) {
      // 生成可在行内修改数据的table所需数据
      return list.map(v => {
        this.$set(v, 'editvalue', false) // https://vuejs.org/v2/guide/reactivity.html
        this.$set(v, 'edittitle', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalvalue = v.value //  will be used when user click the cancel botton
        v.originaltitle = v.title //  will be used when user click the cancel botton
        return v
      })
    },
    addSetting() {
      // 用于添加基本属性后关闭Dialog
      this.isDialogVisible = true
    },
    changeDialog(res) {
      // 用于Dialog的取消按钮关闭Dialog
      this.isDialogVisible = res
    },
    addSettingList(data) {
      // 为页面list添加数据
      var obj = { ...data }
      obj.originalvalue = data.value //  will be used when user click the cancel botton
      obj.originaltitle = data.title
      obj.editvalue = false
      obj.edittitle = false
      this.defaultList.push(obj)
    },
    updatePic(obj, id) {
      this.defaultList.forEach(e => {
        if (e.id === id) this.$set(e, 'value', obj.id)
        if (e.id === id) this.$set(e, 'upload', obj)
      })
    },
    // 生效设置
    refresh() {
      this.apiBtn('SettingsCache')
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.card-header {
  line-height: 36px;
}
</style>
