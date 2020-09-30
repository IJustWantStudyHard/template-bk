<template>
  <el-dialog :visible.sync="currentVisible" :close-on-click-modal="false" title="霸屏广告" width="600px" center :before-close="toggleDialog">
    <el-form ref="form" :model="form" :rules="form" :label-position="$store.state.app.labelPosition" label-width="100px">
      <el-form-item label="链接">
        <el-select v-model="form.link" :placeholder="linkList.length === 0?'请先至霸屏广告页面添加广告':'请选择'">
          <el-option v-for="item in linkList" :key="'video'+item.id" :label="item.link_name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <template v-slot:footer>
      <el-button type="primary" @click="submit">修改</el-button>
      <el-button @click="toggleDialog()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { apiBtn } from '@/api/default'

export default {
  props: {
    row: {
      type: Object,
      default() {}
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentVisible: false,
      form: {
        link: ''
      },
      linkList: []
    }
  },
  watch: {
    isVisible(val) {
      this.currentVisible = val
    },
    'row.video_link': {
      deep: true,
      handler(newV, oldV) {
        this.form.link = newV
      }
    }
  },
  created() {
    this.form.link = this.row.video_link
    this.getList()
  },
  methods: {
    getList() {
      if (this.$_has('AdIndex')) {
        apiBtn('AdIndex', { page: 1, size: 1000 }).then(res => {
          this.linkList = res.data.list
        })
      }
    },
    submit() {
      if (!this.row.id || !this.form.link) {
        this.$message('请先选择链接')
        return
      }
      apiBtn('ActivityVideo', { id: this.row.id, link: this.form.link })
        .then(res => {
          this.toggleDialog()
          this.$emit('success', this.form.link)
        })
    },
    toggleDialog() {
      this.form.link = ''
      this.$emit('close', '')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.imgType{
  width: 250px;
}
</style>
