<template>
  <div class="app-container">
    <complex-table
      :page-name="'卡劵管理'"
      :table-header="tableHeader"
      :table-data="cardList"
      :pagination="pagination"
      @refreshTable="showCardList"
    >
      <!-- 搜索 -->
      <template #search>
        <el-input v-model="formSearch.keywords" placeholder="ID|店铺名|卡劵名称" clearable />
        <el-button icon="el-icon-search" type="primary" @click="formSearchSubmit">搜索</el-button>
      </template>
      <!-- 添加按钮 -->
      <template slot="btn">
        <div>
          <el-button v-has="'CardStore'" size="medium" @click="handelRedirect('CardStore')">添加卡劵</el-button>
        </div>
      </template>

      <!-- table 自定义列-->
      <!-- color 卡劵颜色 -->
      <template v-slot:color="props">
        <div :style="{background:color_option[props.scope.row.color]}" class="colorBlock" />
      </template>
      <!-- date_info 有效期 -->
      <template v-slot:date_info="props">
        <span>{{ props.scope.row.begin_timestamp | parseTime('{y}-{m}-{d}') }} ~ {{ props.scope.row.end_timestamp | parseTime('{y}-{m}-{d}') }}</span>
      </template>
      <!-- 操作 -->
      <template v-slot:action="props">
        <el-button
          v-has="'CardUpdate'"
          type="primary"
          size="small"
          @click="handelRedirect('CardUpdate',props.scope.row.id)"
        >编辑</el-button>
      </template>
    </complex-table>
  </div>
</template>

<script>
import ComplexTable from '@/components/Table/ComplexTable'
import { deleteArrayById } from '@/utils'
import { apiBtn } from '@/api/default.js'
import { defalultConfirm, toRedirect } from '@/utils'

export default {
  name: 'UserList',
  components: { ComplexTable },
  data() {
    return {
      formSearch: {
        keywords: ''
      },
      pagination: {
        // 当前是第几页
        page: 1,
        // 一页几条
        size: 10,
        // 一共多少页
        total: 0
      },
      cardList: [
        {
          id: 1, // 后台数据库的卡劵id,其余字段均为微信api的字段
          wx_card_id: 'po_2DjgJ2zrboM6SzK3qNuje5iWQ',
          color: 'Color010',
          brand_name: '商户名称',
          title: '卡劵名',
          status: 'CARD_STATUS_VERIFY_OK',
          // 起用时间
          begin_timestamp: 1397577600,
          // 表示结束时间 ， 建议设置为截止日期的23:59:59过期 。
          end_timestamp: 1472724261
        }
      ],
      card_type_option: this.$store.state.card.card_type_list,
      color_option: this.$store.state.card.color_list,
      status_option: this.$store.state.card.status_list,
      code_type_option: this.$store.state.card.code_type_list
    }
  },
  computed: {
    tableHeader() {
      const header = [
        {
          prop: 'id',
          label: '卡劵ID',
          sortable: true
        },
        {
          prop: 'brand_name',
          label: '商户名称'
        },
        {
          prop: 'title',
          label: '卡劵名称'
        },
        {
          prop: 'color',
          label: '卡劵颜色',
          width: 80,
          isCustomize: true
        },
        {
          prop: 'date_info',
          label: '有效期',
          width: 200,
          isCustomize: true
        },
        {
          prop: 'action',
          label: '操作',
          width: 160,
          isCustomize: true
        }
      ]
      if (this.$store.getters.roles[0] === 1) {
        header.unshift({
          prop: 'wx_card_id',
          label: '微信卡劵ID',
          sortable: true
        })
      }
      return header
    }
  },
  created() {
    if (!window.sessionStorage.getItem('cardRoute')) {
      window.sessionStorage.setItem('cardRoute', this.$route.path)
    }
    this.showCardList()
  },
  methods: {
    // 卡劵列表
    showCardList(pagination) {
      if (pagination) this.pagination = { ...pagination }
      else {
        this.pagination = {
          page: 1,
          size: 10,
          total: 0
        }
      }
      apiBtn('CardIndex', {
        ...this.pagination,
        ...this.formSearch })
        .then((res) => {
          this.cardList = res.data.list
          this.pagination.total = res.data.total
        })
    },
    // 跳转页面
    handelRedirect(a, id) {
      var obj = {}
      if (id) obj = { id }
      toRedirect(a, obj)
    },
    // 删除卡劵
    delCard(row) {
      defalultConfirm('删除卡劵' + row.id, () => {
        apiBtn('CardDestroy', { id: row.id, card_id: row.card_id })
          .then((res) => {
            deleteArrayById(this.cardList, row.id)
          })
      })
    },
    // 搜索
    formSearchSubmit() {
      this.showCardList()
    }

  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
}
.colorBlock {
  width: 100%;
  height: 50px;
}
</style>
