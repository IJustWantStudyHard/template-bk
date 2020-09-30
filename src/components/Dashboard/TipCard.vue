<template>
  <el-card class="box-card">
    <dl class="notices_box">
      <dt>
        <i class="icon_login speaker" />系统公告
      </dt>
      <dd v-for="(item,k) in data" v-show="k<showCount" :key="k">
        <i>●</i>
        <router-link :to="{path: '/sys/tip/detail',query:{id:item.id}}" class="ellipsis">
          {{ item.title }}
          <span>{{ item.time | parseTime('{y}-{m}-{d}') }}</span>
        </router-link>
        <el-tag type="danger" size="mini">新</el-tag>
      </dd>
      <dt>
        <router-link to="/sys/tip">
          <span>查看更多</span>
          <i class="el-icon-arrow-right" />
        </router-link>
      </dt>
    </dl>
  </el-card>
</template>
<script>

export default {
  props: {
    data: {
      type: Array,
      default() { return [] }
    }
  },
  data() {
    return {
      showCount: 2
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  /deep/ .el-card__body {
    padding: 0 20px;
  }
  .notices_box {
    font-size: 13.5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    dd {
      width: 35%;
      display: flex;
      align-items: center;
      i {
        color: #c0c4cc;
      }
      .ellipsis {
        display: inline-block;
        max-width: 400px;
        margin: 0 5px;
        line-height: 20px;
      }
    }
  }
}
</style>
