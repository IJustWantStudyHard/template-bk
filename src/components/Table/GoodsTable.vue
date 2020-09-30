<template>
  <page-table
    :table-header="tableHeader"
    :table-data="tableData"
    :pagination="pagination"
    :layout="layout"
    @refreshTable="getList"
  >
    <template v-slot:time="props">{{ slotProps.scope.row.time[0]| parseTime('{y}-{m}-{d}') }} ~ {{ slotProps.scope.row.time[1]| parseTime('{y}-{m}-{d}') }}</template>
    <!-- 状态 -->
    <template v-slot:status="props">{{ status[slotProps.scope.row.status] }}</template>
    <!-- 操作 -->
    <template v-slot:action="props">
      <el-button v-show="slotProps.scope.row.status==1" v-has="'GoodsStore'" type="warning" size="small" @click="addGoods(slotProps.scope.row,2)">编辑</el-button>
      <el-button v-has="'GoodsDestroy'" type="danger" size="small" @click="delGoods(slotProps.scope.row)">删除</el-button>
    </template>
  </page-table>
</template>
<script>
import PageTable from '@/components/Table/PageTable'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'GoodsTable',
  components: { PageTable },
  props: {
    // 1 正常列表 2可选择列表
    type: {
      type: Number,
      default: 1
    },
    params: {
      type: Object,
      default() { return {} }
    },
    tableHeader: {
      type: Array,
      default() {
        return [
          {
            prop: 'id',
            label: 'ID',
            width: 80,
            sortable: true
          },
          {
            prop: 'card_name',
            label: '商品名称'
          },
          {
            prop: 'stock',
            label: '库存',
            sortable: true
          },
          {
            prop: 'price',
            label: '价格',
            sortable: true

          },
          {
            prop: 'time',
            label: '有效期',
            sortable: true,
            width: 190,
            isCustomize: true
          },
          {
            prop: 'status',
            label: '状态',
            isCustomize: true
          },
          {
            prop: 'action',
            label: '操作',
            width: 200,
            isCustomize: true
          }
        ]
      }
    },
    // 一页多少条
    size: {
      type: Number,
      default: 10
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data() {
    return {
      Dialogtype: 1,
      form: {},
      status: {
        0: '全部',
        1: '未过期',
        2: '已过期'
      }
    }
  },
  computed: {
    ...mapState({
      tableData: state => state.goods.goodsList,
      pagination: state => state.goods.pagination
    })
  },
  watch: {
    size(newV, oldV) {
      this.SET_GOODS_SIZE(newV)
    }
  },
  created() {
    this.SET_GOODS_SIZE(this.size)
    this.getList()
  },
  methods: {
    ...mapMutations('goods', [
      'SET_GOODS_SIZE',
      'INIT_PAFINATION'
    ]),
    // 商品列表
    getList(pagination) {
      if (pagination) this.INIT_PAFINATION({ ...pagination })
      else {
        var pag = {
          page: 1,
          size: this.size,
          total: 0
        }
        this.INIT_PAFINATION(pag)
      }
      this.$store.dispatch('goods/GetGoodsList', this.params)
    },
    // 编辑
    addGoods(row, Dialogtype) {
      this.$emit('add', Dialogtype, row)
    },
    // 删除商品
    delGoods(row) {
      this.defalultConfirm('删除商品' + row.card_name, () => {
        this.$store.dispatch('goods/delGoods', { id: row.id })
      })
    }
  }

}
</script>
<style lang="scss" scoped>
</style>
