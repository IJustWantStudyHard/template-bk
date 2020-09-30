<template>
  <div class="directory">
    <ul>
      <li v-for="item in list" :key="item.name" :class="active===item.name?'bg':''" @click="scroll(item.name)">{{ item.title }}</li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Directory',
  data() {
    return {
      active: 'base',
      anchorOffset: {
        base: 0,
        share: 0,
        redDetail: 0,
        redRule: 0,
        else: 0,
        style: 0
      }
    }
  },
  computed: {
    ...mapState({
      form: state => state.activity.form
    }),
    list() {
      var list = [
        {
          name: 'base',
          title: '活动内容设置'
        },
        {
          name: 'share',
          title: '活动分享设置'
        },
        {
          name: 'redDetail',
          title: '红包配置'
        },
        {
          name: 'redRule',
          title: '红包提示信息'
        },
        {
          name: 'else',
          title: '首屏配置'
        },
        {
          name: 'style',
          title: '页面风格'
        }
      ]
      if (this.form.activity_type === 2) list.splice(3, 1)
      return list
    }
  },
  mounted() {
    document.querySelector('.app-main').addEventListener('scroll', this.handleScroll) // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
  },
  methods: {
    // 滚动到指定div
    scroll(name) {
      this.active = name
      document.querySelector('#' + name).scrollIntoView()
    },
    // 滚动监听
    handleScroll(e) {
      const scrollTop = document.querySelector('.app-main').pageYOffset || document.querySelector('.app-main').scrollTop || document.querySelector('.app-main').scrollTop // 滚动条偏移量

      for (const item of this.list) {
        this.anchorOffset[item.name] = document.querySelector('#' + item.name).offsetTop - 200
      }

      for (let i = 0; i < this.list.length; i++) {
        const name = this.list[i].name
        if (i === this.list.length - 1) {
          if (scrollTop > this.anchorOffset[this.list[i].name]) {
            this.active = name
          }
          return
        }
        const next = this.list[i + 1].name
        if (scrollTop > this.anchorOffset[name] && scrollTop < this.anchorOffset[next]) {
          this.active = name
        }
      }
    }
  }

}
</script>
<style lang="scss" scoped >
@import '@/styles/variables.scss';
.directory{
    position: fixed;
    right: 48px;
    top: 30%;

    width: 100px;
    text-align: center;
    border-radius: 5px;
    overflow: hidden;
    ul {
        margin: 0;
        padding: 0;
        li{
            list-style: none;
            line-height: 40px;
            color: #fff;
            font-size: 13px;
            background: $mainColor;
        }
        li:hover{
          background: #d5ffdc;
          color: $mainColor;
          cursor: pointer;
        }
    }
    .bg{
        background: #d5ffdc;
        color: $mainColor;
    }
}

</style>
