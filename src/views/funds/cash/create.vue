<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>提现申请</span>
        </div>
      </template>
      <cash-form />
    </el-card>
  </div>
</template>
<script>
import CashForm from '@/components/Form/CashForm'
export default {
  name: 'CashCreate',
  components: { CashForm }
}
</script>
<style lang="scss" scoped>
</style>
