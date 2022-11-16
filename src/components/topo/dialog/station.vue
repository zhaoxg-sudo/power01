<template>
  <el-dialog
    custom-class="topo-dialog"
    :close-on-click-modal="false"
    :title="`编辑 ${name[item.name]}`"
    :visible="dialogVisible"
    @close="onClose"
    width="580px"
    append-to-body
    class="dialog-style"
  >
    <el-form
      :model="form"
      label-width="120px"
      ref="data"
      size="medium"
      :rules="rules"
    >
      <el-form-item label="站点显示名称" prop="title">
        <el-input
          v-model="form.title"
          auto-complete="off"
          placeholder="必填"
        ></el-input>
      </el-form-item>
      <el-form-item label="站点ID" prop="id">
        <el-input
          v-model="form.id"
          auto-complete="off"
          placeholder="必填"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import { name } from '../enum'

export default {
  props: ['item'],
  data () {
    return {
      form: _.cloneDeep(this.item.data) || {},
      name: name,
      dialogVisible: true,
      rules: {}
    }
  },
  methods: {
    onConfirm () {
      this.$refs['data'].validate((valid) => {
        if (valid) {
          this.item.data = this.form
          this.onClose()
        }
      })
    },
    onClose () {
      this.dialogVisible = false
      this.$emit('on-close', this.item)
      this.item.updateItem({
        text: this.form.title
      })
    }
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
.dialog-style  {
/deep/.el-dialog__title{
  padding: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-left: 20px;
  background-color:brown;
  font-size: 24px;
}
}
</style>
