<template>
  <div class="app-container">
    <el-card class="box-card">
      <h2>{{ tip.title }}</h2>
      <article v-html="tip.content" />
      <footer>
        <p>码上拓客</p>
        <p>{{ tip.time | parseTime('{y}-{m}-{d}') }}</p>
      </footer>
    </el-card>
  </div>
</template>

<script>
import { apiBtn } from '@/api/default'

export default {
  data() {
    return {
      tip: {
        id: this.$route.query.id,
        title: '',
        content: '',
        time: new Date()
      }
    }
  },
  created() {
    if (this.tip.id) {
      apiBtn('TipShow', { id: this.tip.id })
        .then((res) => {
          this.tip = { ...this.tip, ...res.data }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .box-card {
    padding: 20px 40px;
    h2 {
      font-weight: 500;
      text-align: center;
      letter-spacing: 1px;
    }
    article {
      line-height: 30px;
      margin: 30px 0;
    }
    footer {
      text-align: right;
    }
  }
}
</style>

<style>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
