<template>
  <el-dialog
    :visible.sync="isDialogVisible"
    :fullscreen="$store.state.app.device === 'mobile' ? true : false"
    title="添加基础设置"
    top="7vh"
    width="460px"
    @close="resetForm('roleForm')"
    @dragDialog="handleDrag"
  >
    <el-form ref="settingForm" :rules="rulesForm" :model="settingForm" label-width="100px">
      <el-form-item label="中文名称" prop="title">
        <el-input v-model="settingForm.title" placeholder="请输入中文名称" />
      </el-form-item>
      <el-form-item label="英文名称" prop="name">
        <el-input v-model="settingForm.name" placeholder="请输入英文名称" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="settingForm.type">
          <el-radio :label="1">文本</el-radio>
          <el-radio :label="2">图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="settingForm.type===1" label="值" prop="text">
        <el-input v-model="settingForm.text" placeholder="请输入该字段的值" />
      </el-form-item>
      <el-form-item v-show="settingForm.type===2" label="值" prop="pic">
        <upload-default
          key="settingUpload"
          :upload-type="2"
          :img-url="settingForm.picUrl"
          @change="update"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('settingForm')">提交</el-button>
        <el-button @click="resetForm('settingForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { validatEnRegular, validatMixRegular } from '@/utils/validate'
import { apiBtn } from '@/api/default'
import UploadDefault from '@/components/Upload/UploadDefault'
export default {
  name: 'SettingDialog',
  components: { UploadDefault },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatTitle = (rule, value, callback) => {
      if (!validatMixRegular(value)) {
        callback(
          new Error('该名称只能为中文')
        )
      } else {
        callback()
      }
    }
    const validatName = (rule, value, callback) => {
      if (!validatEnRegular(value)) {
        callback(
          new Error('该名称只能为英文')
        )
      } else {
        callback()
      }
    }

    var validatPic = (rule, value, callback) => {
      if (this.settingForm.type === 'pic' && !value) {
        callback(
          new Error('请上传图片')
        )
      } else {
        callback()
      }
    }

    var validatText = (rule, value, callback) => {
      if (this.settingForm.type === 'text' && !value) {
        callback(
          new Error('请填写该字段的值')
        )
      } else {
        callback()
      }
    }
    return {
      isDialogVisible: false,
      settingForm: {
        title: '',
        name: '',
        value: '',
        // type text 1 pic 2
        type: 1,
        text: '',
        pic: '',
        picUrl: ''
      },
      rulesForm: {
        title: [
          { required: true, message: '请输入中文名称', trigger: 'blur' },
          { validator: validatTitle, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
          { validator: validatName, trigger: 'blur' }
        ],
        text: [
          { validator: validatText, trigger: 'blur' }
        ],
        pic: [
          { validator: validatPic, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    isVisible: function(newV, oldV) {
      this.isDialogVisible = newV
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var obj = {
            title: this.settingForm.title,
            name: this.settingForm.name,
            value: this.settingForm.type === 2 ? this.settingForm.pic : this.settingForm.text,
            type: this.settingForm.type
          }
          apiBtn('SettingsStore', obj)
            .then(res => {
              //  为this.roleForm修改数据
              this.$emit('addSettingList', res.data)
              this.resetForm(formName)
            })
        }
      })
    },
    resetForm(formName) {
      // 清空表单，清空tree,关闭diaglog
      this.$refs.settingForm.resetFields()
      this.$emit('changeDialog', false)
      this.settingForm.picUrl = ''
    },
    // v-el-drag-dialog onDrag callback function dialog拖动的回调事件
    handleDrag() {
      this.$refs.select.blur()
    },
    update(obj) {
      if (!obj.id) {
        this.settingForm.pic = ''
        this.settingForm.picUrl = ''
        return
      }
      this.settingForm.pic = obj.id
      this.settingForm.picUrl = obj.path
    }
  }
}
</script>
<style lang='scss' scoped>
.el-select {
  width: 100%;
}
.el-form-item:last-child {
  margin: 0;
}
#authorityTree {
  min-height: 42px;
  border: 1px solid #dcdfe6;
  padding-top: 7px;
  border-radius: 4px;
  max-height: 300px;
  overflow: auto;
}
</style>

