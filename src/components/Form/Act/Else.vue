<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules" :label-position="$store.state.app.labelPosition" label-width="251px">
      <tip id="else" title="首屏配置" />
      <el-form-item label="首屏广告" prop="first_screen" class="activity-first_screen">
        <FileManager :value="form.first_screen" :page-size="8" :disabled="disabled" :type="10" :size="1000" @change="changePic" />
      </el-form-item>
      <div class="tip-font">1.图片尺寸：750px*1334px；2.图片大小必须小于1000KB；3.不传则不显示首屏广告</div>

      <tip id="style" title="页面风格" />
      <el-form-item label="页面模板" prop="template_type" class="activity-template_type">
        <el-radio-group v-model="form.template_type" :disabled="disabled" @change="updateForm('template_type', $event)">
          <el-radio :label="1">模板一</el-radio>
          <el-radio :label="2">模板二</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="tip-font">
        <div>此处展示的为示例模板,仅供用户样式参考</div>
        <img v-show="form.template_type===1" src="@/assets/activity/template1_1.png">
        <img v-show="form.template_type===1" src="@/assets/activity/template1_2.png">
        <img v-show="form.template_type===2" src="@/assets/activity/template2_1.png">
        <img v-show="form.template_type===2" src="@/assets/activity/template2_2.png">
      </div>
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
    return {
      formRules: {
        is_card: [{ required: true, trigger: 'change' }],
        template_type: [{ required: true, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      status: state => state.activity.status,
      form: state => state.activity.form,
      disabled: state => state.activity.disabled
    })
  },
  created() {
  },
  mounted() {
    // 表单校验
    Bus.$on('validSecond', () => {
      if (this.$refs.form) {
        this.$refs.form.validate(valid => {
          const obj = {
            key: 'else',
            value: valid
          }
          this.VALID_SECOND(obj)
        })
      }
    })
  },
  methods: {
    ...mapMutations('activity', [
      'VALID_SECOND',
      'ACTIVITY_FORM'
    ]),
    updateForm(key, val) {
      this.ACTIVITY_FORM({ key: key, val: val })
    },
    changePic(val) {
      const obj = { id: val.id, path: val.path }
      this.updateForm('first_screen', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.tip-font img{
  max-width: 300px;
  border:1px solid #ccc;
}
.tip-font{
  line-height: 25px;
}
</style>
