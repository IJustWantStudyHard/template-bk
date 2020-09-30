<template>
  <div id="share">
    <tip title="活动分享设置" />
    <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
      <template>
        <el-form-item label="分享标题" prop="share_title" class="activity-share_title">
          <el-input v-model="form.share_title" type="textarea" :disabled="disabled" maxlength="40" show-word-limit clearable @change="updateForm('share_title', $event)" />
        </el-form-item>
        <div class="tip-font">推荐40个汉字以内</div>
      </template>

      <template>
        <el-form-item label="分享描述" prop="share_desc" class="activity-share_desc">
          <el-input v-model="form.share_desc" type="textarea" :disabled="disabled" maxlength="30" show-word-limit clearable @change="updateForm('share_desc', $event)" />
        </el-form-item>
        <div class="tip-font">推荐30个汉字以内</div>
      </template>

      <template>
        <el-form-item label="分享图片" prop="share_image" class="activity-share_image">
          <FileManager :value="form.share_image" :page-size="8" :disabled="disabled" :type="8" :size="100" @change="changeSharePic" />
        </el-form-item>
        <div class="tip-font">1.图片尺寸：1:1；2.图片大小必须小于100KB</div>
      </template>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Bus from '@/utils/bus'
import FileManager from '@/components/FileManager/index'

export default {
  components: { FileManager },
  data() {
    const validatePic = (rule, val, callback) => {
      if (this.form.share_image && this.form.share_image.path && this.form.share_image.id) callback()
      else callback(new Error('请上传分享图片'))
    }
    return {
      sharePic: {},
      formRules: {
        share_title: [{ required: true, min: 1, max: 430, trigger: 'change', message: '请设置分享标题' }],
        share_desc: [{ required: true, min: 1, max: 30, trigger: 'change', message: '请设置分享描述' }],
        share_image: [{ required: true, trigger: 'change', validator: validatePic }]
      }
    }
  },
  computed: {
    ...mapState({
      form: state => state.activity.form,
      disabled: state => state.activity.disabled
    })
  },
  watch: {
    'form.share_image': {
      deep: true,
      handler() {
        this.$refs.form.validateField('share_image')
      }
    }
  },
  mounted() {
    // 表单校验
    Bus.$on('validFirst', () => {
      if (this.$refs.form) {
        this.$refs.form.validate(valid => {
          const obj = {
            key: 'share',
            value: valid
          }
          this.VALID_FIRST(obj)
        })
      }
    })
    // 清除校验
    Bus.$on('clearValidate', () => {
      this.$refs.form.clearValidate(['share_title', 'share_desc', 'share_image'])
    })
    Bus.$on('resetFields', () => {
      this.$refs.form.resetFields()
    })
  },
  methods: {
    ...mapMutations('activity', [
      'VALID_FIRST',
      'ACTIVITY_FORM'
    ]),
    updateForm(key, val) {
      this.ACTIVITY_FORM({ key: key, val: val })
    },
    changeSharePic(val) {
      const obj = { id: val.id, path: val.path }
      this.updateForm('share_image', obj)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ {
  .el-textarea{
    max-width: 500px;

  }
}
</style>
