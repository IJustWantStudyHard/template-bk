<template>
  <el-card class="box-card">
    <template #header>
      <div class="clearfix">
        <span>{{ title }}</span>
        <el-button
          icon="el-icon-more-outline"
          style="float: right; padding: 3px 0"
          type="text"
          @click="more"
        />
      </div>
    </template>
    <ul class="list">
      <li v-for="(i,key) in data" :key="key" class="item">
        <span class="ellipsis">{{ type===1?'标题：':"" }}{{ i.name }}</span>
        <el-button class="btn" type="primary" size="mini" @click="review(i.id)">审核</el-button>
      </li>
      <li v-show="!data||data.length===0" class="none">暂无需审核数据</li>
    </ul>
  </el-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [
          // {
          //   id: 1,
          //   name: '待审核活动标题或者待审核用户信息的备注'
          // }
        ]
      }
    },
    type: {
      type: Number,
      // 1 活动 2用户信息 3提现
      default: 1
    }
  },
  data() {
    return {
      typeName: {
        1: { name: '活动', path: '/act/activity', review: '/act/activity/review' },
        2: { name: '用户信息', path: '/client/agent', review: '/client/agent/review' },
        3: { name: '提现', path: '/funds/cash', review: '/funds/cash/detail' }
      }
    }
  },
  computed: {
    title() {
      var end = '审核'
      return this.typeName[this.type].name + end
    }
  },
  methods: {
    more() {
      this.$router.push(this.typeName[this.type].path)
    },
    review(id) {
      this.$router.push({ path: this.typeName[this.type].review, query: { id }})
    }
  }

}
</script>

<style  lang="scss" scoped>
@import "@/styles/variables.scss";

ul li {
  list-style: none;
}
.list {
  padding: 0;
  margin: 0 19px;
  display: flex;
  flex-wrap: wrap;
  font-size: $fontSizeExtraSmall;
  .item {
    height: 46.5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #ebeef5;
    .btn {
      margin-left: 10px;
    }
  }
  .none {
    height: 200px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $fontColorAide;
  }
}
/deep/ .el-card__body {
  padding: 0;
  height: 231px;
}
</style>

