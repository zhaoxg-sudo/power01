<template>
  <!--设备信息新增-->
  <div class="popUp" style="display: block;">
    <div class="popContent">
      <el-form class="form-horizontal" :model="upData" ref="upData" :rules="rules">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">站点ID</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="upData.catalogid">
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">父节点信息</label>
              <div class="col-sm-6">
                <input type="text"  class="form-control" v-model="parentID" :disabled="true">
              </div>
            </div>
          </div>
          <div class="col-md-6" >
            <div class="form-group">
              <label class="col-sm-6 control-label">站点名称</label>
              <div class="col-sm-6">
                <input type="text" placeholder="" class="form-control" v-model="upData.label">
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="upData.type!=0">
            <div class="form-group">
              <label class="col-sm-6 control-label">协议类型</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="upData.protocoltype">
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="upData.type!=0">
            <div class="form-group">
              <label class="col-sm-6 control-label">IP地址</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="upData.ipaddress">
              </div>
            </div>
          </div>
          <div class="col-md-6" v-if="upData.type!=0">
            <div class="form-group">
              <label class="col-sm-6 control-label">端口</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="upData.port">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">站点类型</label>
              <div class="col-sm-6">
                <label class="radio-inline">
                  <input type="radio" value="0" v-model="upData.type">站点组织
                </label>
                <label class="radio-inline">
                  <input type="radio" value="1" v-model="upData.type">电源发生器
                </label>
                <label class="radio-inline">
                  <input type="radio" value="2" v-model="upData.type">电源转换器
                </label>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btnDiv">
      <button type="button" class="btn btn-sm btn-info" @click="userEdit"
      >确定</button>
      <button type="button" class="btn btn-sm btn-default" @click="close">取消</button>
    </div>
  </div>
</template>

<script type="text/javascript">
import $ from 'jquery'
import { mapActions } from 'vuex'
export default {
  props: {
    modolType: {type: Number},
    transferdata: {type: Object},
    changedNode: {type: Object}
  },
  data () {
    return {
      formData: {
        devicecode: '',
        devicename: '',
        password: '',
        type: 0,
        devicevedios: [{ vediourl: '' }, { vediourl: '' }, { vediourl: '' }, { vediourl: '' }],
        feature: {organizationid: this.transferdata.targetMenuId, aliasname: ''},
        ipaddress: '',
        port: ''
      },
      upData: {
        catalogid: '',
        parentid: '',
        label: '',
        stationtype: '',
        commtype: '',
        protocoltype: '',
        positioninfo: '',
        addinfo: '',
        ipaddress: '',
        ipport: '',
        childrennum: '',
        type: 0
      },
      returnData: {node: null, data: null, addNodeData: null},
      rules: {},
      self: this,
      parentID: ''
    }
  },
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUp').css('top', documentHeight * 0.3 + 'px')
      this.parentID = this.changedNode.data.catalogid + this.changedNode.data.label
      // $('.popUp').css('top', 300 + 'px')
      /* if (this.modolType === -2) {
        this.$ajax.get(`Device/Detail/${this.transferdata.deviceid}`)
          .then(res => {
            if (res.data.code === 1) {
              this.formData = res.data.result
              this.formData.feature.organizationid = this.transferdata.targetMenuId
              this.$ajax.get(`Feature/Detail/${this.transferdata.deviceId}`)
              .then(res => {
                  if (res.data.code === 1) {
                    this.formData.feature.organizationID = res.data.result.organizationID
                  }
              })
            }
          })
      } */
    })
  },
  methods: {
    ...mapActions([
      'update'
    ]),
    close () {
      this.$emit('close')
    },
    userEdit () {
      this.$message.success('数据修改成功')
      this.returnData.node = this.changedNode.node
      this.returnData.data = this.changedNode.data
      this.upData.parentid = this.changedNode.data.catalogid
      this.returnData.addNodeData = this.upData
      console.log('returnData=', this.returnData)
      this.$emit('append', this.returnData)
    }
  }
}
</script>
