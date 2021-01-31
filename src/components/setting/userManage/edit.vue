<template>
  <!--设备信息新增-->
  <div class="popUp" style="display: block;">
    <div class="popContent">
      <el-form class="form-horizontal" :model="formData" ref="formData" :rules="rules">
        <div class="row">
          <div class="col-md-6" v-if="formData.type!=2">
            <div class="form-group">
              <label class="col-sm-6 control-label">设备号</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="formData.devicecode">
              </div>
            </div>
          </div>
          <div class="col-md-6"  v-if="formData.type!=2">
            <div class="form-group">
              <label class="col-sm-6 control-label">添加范围</label>
              <div class="col-sm-6">
                <input type="text"  class="form-control" v-model="range">
              </div>
            </div>
          </div>
          <div class="col-md-6" >
            <div class="form-group">
              <label class="col-sm-6 control-label">设备名称</label>
              <div class="col-sm-6">
                <input type="text" placeholder="" class="form-control" v-model="formData.devicename">
              </div>
            </div>
          </div>
        <div class="col-md-6" v-if="formData.type!=2">
            <div class="form-group">
              <label class="col-sm-6 control-label">密码</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="formData.password">
              </div>
            </div>
          </div>
        <div class="col-md-6" v-if="formData.type==2">
            <div class="form-group">
              <label class="col-sm-6 control-label">IP地址</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="formData.ipaddress">
              </div>
            </div>
          </div>
        <div class="col-md-6" v-if="formData.type==2">
            <div class="form-group">
              <label class="col-sm-6 control-label">端口号</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="formData.port">
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="col-sm-6 control-label">设备类型</label>
              <div class="col-sm-6">
                <label class="radio-inline">
                  <input type="radio" value="0" v-model="formData.type">单话机

                </label>
                <label class="radio-inline">
                  <input type="radio" value="1" v-model="formData.type">视频终端
                </label>
                <label class="radio-inline">
                  <input type="radio" value="2" v-model="formData.type">组播终端
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
    transferdata: {type: Object}
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
      rules: {},
      self: this,
      range: '',
      instance: this.$ajax.create({
        baseURL: 'https://scc.ieyeplus.com:8001/'
      })
    }
  },
  created () {
    this.$nextTick(() => {
      let documentHeight = document.documentElement.clientHeight
      $('.popUp').css('top', documentHeight * 0.3 + 'px')
      if (this.modolType === -2) {
        this.$ajax.get(`Device/Detail/${this.transferdata.deviceid}`)
          .then(res => {
            if (res.data.code === 1) {
              this.formData = res.data.result
              this.formData.feature.organizationid = this.transferdata.targetMenuId
              /* this.$ajax.get(`Feature/Detail/${this.transferdata.deviceId}`)
              .then(res => {
                  if (res.data.code === 1) {
                    this.formData.feature.organizationID = res.data.result.organizationID
                  }
              }) */
            }
          })
      }
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
      if (this.modolType !== -2) {
        let axios = []
        let range = this.range === '' ? 1 : parseInt(this.range)
        for (let i = 0; i < range; i++) {
          if (this.formData.type !== 2) {
            let temp = {}
            temp.devicecode = String(parseInt(this.formData.devicecode) + i)
            temp.devicename = this.formData.devicename === '' ? temp.devicecode : (range === 1 ? this.formData.devicename : (this.formData.devicename + String(i + 1)))
            temp.password = this.formData.password === '' ? temp.devicecode : this.formData.password
            temp.type = this.formData.type
            temp.devicevedios = this.formData.devicevedios
            temp.feature = this.formData.feature
            axios.push(this.$ajax.post('Device/Create', temp))
          } else if (this.formData.type === 2) {
            let temp = {}
            temp.ipaddress = this.formData.ipaddress
            temp.organizationid = this.transferdata.targetMenuId
            temp.port = this.formData.port
            temp.type = this.formData.type
            temp.devicename = this.formData.devicename
            axios.push(this.instance({url: 'Device/CreateMulticast', method: 'post', data: temp}))
          }
        }
        this.$ajax.all(axios).then(res => {
          res.forEach((re) => {
            if (re.data.code === 0) {
              setTimeout(() => { this.$message.success('某个设备已存在,请勿重复添加') }, 500)
            } else if (re.data.code === 2) {
              setTimeout(() => { this.$message.success(res.data.result) }, 500)
            } else {
              setTimeout(() => { this.$message.success(re.data.result.devicecode + '添加成功') }, 500)
            }
          })
          this.$store.dispatch('update', 1)
        })
      } else {
        let request = Object.assign(this.formData, {deviceid: this.transferdata.deviceId})
        this.$ajax.put(`Device/Edit`, request)
          .then(res => {
            if (res.data.code === 1) {
              this.$message.success('修改成功')
              this.$store.dispatch('update', 1)
            }
          })
      }
    }
  }
}
</script>
