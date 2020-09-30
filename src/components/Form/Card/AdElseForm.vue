<template>
  <el-form ref="advancedInfo" :model="advancedInfo" :label-position="$store.state.app.labelPosition" label-width="251px">
    <el-form-item label="商家服务类型" prop="code_type">
      <el-select
        v-model="advancedInfo.business_service"
        multiple
        placeholder="请选择商家服务类型"
        class="form-input"
        clearable
      >
        <el-option
          v-for="(value,key) in business_service_list_option"
          :key="key"
          :label="value"
          :value="key"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'ElseForm',
  props: {
    advancedInfo: {
      type: Object,
      default: function() {
        return {
        }
      }
    }
  },
  data() {
    return {
      business_service_list_option: this.$store.state.card.business_service_list
    }
  },
  methods: {
  }

}
</script>

