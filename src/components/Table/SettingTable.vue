<template>
  <PageTable :table-header="tableHeader" :table-data="list" :has-pagination="false">
    <!-- 中文名 -->
    <template v-slot:title="props">
      <template v-if="props.scope.row.edittitle">
        <el-input
          v-model="props.scope.row.title"
          v-focus="props.scope.row.edittitle"
          size="small"
          class="edit-input"
          @blur="confirmEdit(props.scope.row,'title')"
        />
      </template>
      <span
        v-else
        style="cursor: pointer;"
        @click="props.scope.row.edittitle =! props.scope.row.edittitle"
      >{{ props.scope.row.title }}</span>
    </template>
    <!-- 值 -->
    <template v-slot:value="props">
      <template v-if="props.scope.row.type===2">
        <upload-default
          :key="props.scope.row.id"
          :upload-type="2"
          :img-url="form[props.scope.row.name]"
          :r-params="props.scope.row"
          @change="update"
        />
      </template>
      <template v-else>
        <template v-if="props.scope.row.editvalue">
          <el-input
            v-model="props.scope.row.value"
            v-focus="props.scope.row.editvalue"
            size="small"
            class="edit-input"
            @blur="confirmEdit(props.scope.row,'value')"
          />
        </template>
        <span
          v-else
          style="cursor: pointer;"
          @click="props.scope.row.editvalue =! props.scope.row.editvalue"
        >{{ props.scope.row.value }}</span>
      </template>
    </template>
  </PageTable>
</template>
<script>
import UploadDefault from '@/components/Upload/UploadDefault'
import PageTable from '@/components/Table/PageTable'
import { apiBtn } from '@/api/default'

export default {
  name: 'SettingTable',
  components: { PageTable, UploadDefault },
  props: {
    list: {
      type: Array,
      default() { }
    },
    listLoading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableHeader: [
        { prop: 'id', label: 'id', width: 80 },
        { prop: 'title', label: '中文名称', width: 200, isCustomize: true },
        { prop: 'name', label: '英文名称', width: 200 },
        { prop: 'value', label: '内容', align: 'left', isCustomize: true }
      ]
    }
  },
  computed: {
    // 为图片上传控件添加值
    form: function() {
      const form = {}
      this.list.forEach(e => {
        if (e.type === 2) {
          if (e.upload && e.upload.path) form[e.name] = e.upload.path
          else form[e.name] = ''
        }
      })
      return form
    }
  },
  methods: {
    // 修改 文字
    confirmEdit(row, type, callback) {
      if (row['original' + type] === row[type]) {
        row['edit' + type] = false
        return
      }
      this.$confirm('修改"' + row[type] + '"为"' + row['original' + type] + '", 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var obj = {
          id: row.id
        }
        obj[type] = row[type]
        apiBtn('SettingsUpdate', obj)
          .then(res => {
            // 修改成功则修改备份数据
            row['edit' + type] = false
            row['original' + type] = row[type]
          }).catch(error => {
            // 失败则返回备份数据
            if (error) row[type] = row['original' + type]
            row['edit' + type] = false
          })
      }).catch(() => {
        row[type] = row['original' + type]
        row['edit' + type] = false
      })
    },
    // 修改图片
    update(obj, row) {
      if (!obj.id) {
        row.path = ''
        return
      }
      apiBtn('SettingsUpdate', { id: row.id, value: obj.id })
        .then(res => {
          // 上传成功修改图片的value(id)以及value对应的upload图片对象
          row.value = res.data.value
          row.upload = res.data.upload
          // 修改存储的图片value
          row['originalvalue'] = res.data.value
          this.$emit('updatePic', obj, row.id)
        }).catch(error => {
          // 上传失败使用上传 之前的图片value(id)
          if (error) row[row.name] = row['original' + row.name]
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-input {
  width: 100%;
}
/deep/ .el-table .cell {
  line-height: 35px;
}
</style>

