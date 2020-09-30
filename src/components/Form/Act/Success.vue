<template>
  <div class="three-step">
    <svg-icon icon-class="pending-review" />
    <span>待审核</span>
    <el-button @click="back">返回</el-button>
  </div>
</template>

<script>
export default {
  created() {
    this.currentRoute = this.$route
  },
  destroyed() {
    this.$store.commit('activity/STEP_ACTIVE', 0)
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.three-step {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .svg-icon {
    width: 50px;
    height: 50px;
  }
  span {
    margin-top: 20px;
    color: #333;
  }
  .el-button {
    margin-top: 20px;
  }
}
</style>
