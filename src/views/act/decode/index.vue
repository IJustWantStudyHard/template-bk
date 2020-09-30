<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <el-form ref="form" label-width="251px">
            <tip title="数据解密" />
            <el-form-item label="解密数据">
              <el-input
                v-model="code"
                autocomplete="off"
                placeholder="请输入需要解密的活动ID或者用户ID"
              />
            </el-form-item>
            <el-form-item v-show="result" label="解密结果">
              <el-input v-model="result" disabled />
            </el-form-item>
          </el-form>
          <el-button
            v-has="'DecodeStore'"
            type="primary"
            style="margin-left:251px"
            @click="handlerSubmit"
          >解密</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { apiBtn } from '@/api/default'
export default {
  name: 'Decode',
  data() {
    return {
      code: '',
      result: ''
    }
  },
  watch: {
    code() {
      this.result = ''
    }
  },
  methods: {
    // 请求
    handlerSubmit() {
      if (this.code) {
        apiBtn('DecodeStore', { code: this.code })
          .then((res) => {
            this.result = res.data
          })
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
/deep/ .el-input.is-disabled .el-input__inner{
    background-color: #fff;
    color: #606266;
}
</style>
