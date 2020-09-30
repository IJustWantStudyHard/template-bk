<template>
  <el-form ref="merchantInfo" :model="merchantInfo" :rules="merchantRules" class="merchantForm">
    <el-form-item prop="brand_name">
      <el-input v-model="merchantInfo.brand_name" class="brandName" placeholder="请输入商户名称" />
    </el-form-item>
    <p class="tip-font">注：商户名称字数上限为12个汉字，该字段提交后不可更改。</p>
    <el-form-item prop="logo_url">
      <!-- 上传卡劵的商户logo -->
      <el-upload
        class="avatar-uploader"
        :action="action"
        :headers="headers"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        accept="image/png, image/jpeg, image/jpg"
      >
        <img v-if="logo" :src="logo" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
    </el-form-item>
    <p class="tip-font">注：商户logo建议像素为300*300，大小不能超过1M，图片格式只能为JPG 或 PNG。</p>

  </el-form>
</template>
<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'MerchantForm',
  props: {
    merchantInfo: {
      type: Object,
      default: function() {
        return {
          logo_url: '',
          brand_name: ''
        }
      }
    }
  },
  data() {
    return {
      merchantRules: {
        brand_name: [
          { required: true, message: '请填写商户名称', trigger: 'blur' },
          { max: 12, message: '字数上限为12个汉字', trigger: 'blur' }
        ],
        logo_url: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ]
      },
      action: process.env.VUE_APP_BASE_API + '/common/wx/upload',
      logo: ''
    }
  },
  computed: {
    headers() {
      return { Authorization: 'Bearer ' + getToken() }
    }
  },
  methods: {
    validateForm: function(callback) {
      var result = false
      this.$refs['merchantInfo'].validate(valid => {
        result = valid
      })
      return result
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.logo = URL.createObjectURL(file.raw)
        this.$emit('updateLogoURLParent', res.data)
        this.$refs['merchantInfo'].validateField('logo_url')
      } else if (res.message) {
        this.$message({
          message: res.message || '请求成功，返回值错误',
          type: 'error',
          duration: 3000,
          showClose: true
        })
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 1MB!')
      }
      return isJPG && isLt2M
    }
  }

}
</script>
<style lang="scss">
.merchantForm{
  .brandName .el-input__inner{
    width: 300px;
    text-align: center;
    border: none;
    border-bottom: 1px solid #dcdfe6;
    border-radius: 0;
  }
  .el-form-item__error{
    width: 100%;
    text-align: center
  }
  .el-form-item__content{
    line-height: inherit
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>

