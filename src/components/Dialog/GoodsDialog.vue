<template>
  <el-dialog
    :visible.sync="isDialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :fullscreen="$store.state.app.device === 'mobile' ? true : false"
    title="添加商品"
    top="7vh"
    width="60%"
    @dragDialog="handleDrag"
  >
    <el-form ref="form" :rules="rulesForm" :model="form" label-width="100px">
      <el-form-item label="商品名称" prop="card_name">
        <el-input v-model="form.card_name" placeholder="请输入商品的名称" />
      </el-form-item>
      <el-form-item label="商品图片" prop="thumb">
        <file-manager :value="pic" :type="7" @change="changeFile" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="form.stock" :precision="0" :min="0" :step="100" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number v-model="form.price" :precision="2" :min="0" :step="1" />
      </el-form-item>
      <el-form-item label="有效期" prop="time">
        <date-picker
          :value="form.time"
          :has-shortcuts="true"
          value-format="timestamp"
          @changeTime="changeTime"
        />
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import DatePicker from '@/components/Tool/DatePicker'
import FileManager from '@/components/FileManager'

export default {
  name: 'GoodsDialog',
  components: { DatePicker, FileManager },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    goodsForm: {
      type: Object,
      default: function() {
        return {
          card_name: '',
          thumb: '',
          stock: '',
          price: '',
          time: [],
          remark: '',
          upload: {}
        }
      }
    },
    type: {
      type: Number,
      // 新增 1 编辑 2
      default: 1
    }
  },
  data() {
    const validateValue = (rule, val, callback) => {
      if (val > 0) {
        callback()
      } else {
        callback(new Error('必须大于0'))
      }
    }
    return {
      isDialogVisible: false,
      rulesForm: {
        card_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        thumb: [
          { required: true, message: '请上传商品图片', trigger: 'change' }
        ],
        stock: [
          { required: true, message: '填写商品库存', trigger: 'blur' },
          { validator: validateValue, trigger: 'blur' }

        ],
        price: [
          { required: true, message: '填写商品价格', trigger: 'blur' },
          { validator: validateValue, trigger: 'blur' }
        ],
        time: [
          { required: true, message: '选择商品有效期', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入商品说明', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      },
      pic: {},
      form: {
        card_name: '',
        thumb: '',
        stock: '',
        price: '',
        time: [],
        remark: '',
        upload: {}
      }
    }
  },
  watch: {
    isVisible: function(newV, oldV) {
      this.isDialogVisible = newV
    },
    GoodsForm: {
      deep: true,
      handler(newV, oldV) {
        // 生成新商品，编辑 获取初始值
        this.form = { ...newV }
        // 图片控件 使用数据
        this.pic = { id: this.GoodsForm.thumb, path: this.GoodsForm.upload[this.GoodsForm.thumb] }
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 处理数据
          var obj = { ...this.form }
          if (this.type === 1) delete obj.id
          delete obj.upload
          // 请求
          this.$store.dispatch(this.type === 1 ? 'goods/addGoods' : 'goods/editGoods', obj)
            .then(res => {
              this.resetForm(formName)
            })
        }
      })
    },
    resetForm(formName) {
      // 关闭diaglog
      this.$refs[formName].resetFields()
      this.$emit('changeDialog', false)
      // 清空图片上传控件
      this.pic = {}
    },
    // v-el-drag-dialog onDrag callback function dialog拖动的回调事件
    handleDrag() {
      this.$refs.select.blur()
    },
    changeTime(val) {
      this.form.time = val
    },
    // 图片改变更新表单，更新pic对象
    changeFile(val) {
      this.form.thumb = val.id
      this.form.upload[val.id] = val.path
      this.pic = val
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/ .el-input-number .el-input {
  width: inherit;
}
</style>

