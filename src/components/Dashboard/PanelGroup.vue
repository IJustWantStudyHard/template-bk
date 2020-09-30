<template>
  <el-row :gutter="20" class="panel-group">
    <el-col
      v-for="(item,index) in list"
      :key="index"
      :xs="24"
      :sm="12"
      :md="6"
      class="card-panel-col"
    >
      <div class="card-panel" @click="handleClick(item.router)">
        <div :class="'card-panel-icon-wrapper icon-'+item.type">
          <svg-icon :icon-class="item.icon" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ item.title }}</div>
          <count-to :start-val="0" :end-val="item.value" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    data: {
      type: [Object, Array],
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      list: [],
      bf: {
        activity: {
          type: 'activity',
          title: '活动总数',
          icon: 'activity',
          value: 200000,
          router: '/act/activity'
        },
        pageviews: {
          type: 'pageviews',
          title: '总浏览量',
          icon: 'pageviews',
          value: 300,
          router: '/act/activity'
        },
        share: {
          type: 'share',
          title: '总分享量',
          icon: 'share',
          value: 10000,
          router: '/act/activity'
        },
        exposure: {
          type: 'exposure',
          title: '总曝光量',
          icon: 'exposure',
          value: 10000,
          router: '/act/activity'
        },
        buyNum: {
          type: 'order',
          title: '总购买量',
          icon: 'order',
          value: 10000,
          router: '/funds/order'
        },
        agent: {
          type: 'agent',
          title: '代理商数量',
          icon: 'agent',
          value: 10000,
          router: '/client/agent'
        },
        store: {
          type: 'store',
          title: '门店数量',
          icon: 'store',
          value: 300,
          router: '/client/agent'
        },
        envelope: {
          type: 'envelope',
          title: '红包总数量',
          icon: 'envelope',
          value: 10000,
          router: '/client/agent'
        },
        money: {
          type: 'money',
          title: '红包总钱数',
          icon: 'money',
          value: 300,
          router: '/client/agent'
        },
        user: {
          type: 'user',
          title: '用户总数',
          icon: 'user1',
          value: 900000,
          router: '/act/activity'
        }
      }
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.formateData()
      }
    }
  },
  created() {
    this.formateData()
  },
  methods: {
    formateData() {
      for (const item in this.data) {
        if (this.bf[item]) this.list.push({ ... this.bf[item], value: this.data[item] })
      }
    },
    handleClick(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 20px;
  }
  .card-panel {
    display: flex;
    flex-direction: inherit;
    justify-content: space-between;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-activity {
        background: #2ec7c9;
      }
      .icon-user {
        background: #b6a2de;
      }
      .icon-agent {
        background: #5ab1ef;
      }
      .icon-money {
        background: #95706d;
      }
      .icon-envelope {
        background: #d87a80;
      }
      .icon-order {
        background: #d87a80;
      }
      .icon-pageviews {
        background: #8d98b3;
      }
      .icon-exposure {
        background: #e5cf0d;
      }
      .icon-store {
        background: #97b552;
      }
      .icon-share {
        background: #97b552;
      }
    }
    .icon-activity {
      color: #2ec7c9;
    }
    .icon-user {
      color: #b6a2de;
    }
    .icon-agent {
      color: #5ab1ef;
    }
    .icon-money {
      color: #95706d;
    }
    .icon-envelope {
      color: #d87a80;
    }
    .icon-order {
      color: #d87a80;
    }
    .icon-pageviews {
      color: #8d98b3;
    }
    .icon-exposure {
      color: #e5cf0d;
    }
    .icon-store {
      color: #97b552;
    }
    .icon-share {
      color: #97b552;
    }
    .card-panel-icon-wrapper {
      margin: 14px 0 14px 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      font-size: 48px;
    }
    .card-panel-description {
      text-align: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        word-break: keep-all;
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
