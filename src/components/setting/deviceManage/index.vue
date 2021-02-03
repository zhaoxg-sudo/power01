<template>
  <div class="content">
    <div class="tableTool">
      <div class="operate">
        <form class="form-inline">
          <div class="form-group">
            <input type="text" placeholder="请输入要查询的设备编号" class="form-control select-width" style="width:200px;" v-model="fuzzyquery" />
          </div>
          <button type="button" class="btn btn-info" @click="openModal(-1)">
            <i class="fa fa-bolt" aria-hidden="true"></i>修改告警联动
          </button>
          <button type="button" class="btn btn-info" @click="refresh()">
            <i class="fa fa-search" aria-hidden="true"></i>查询
          </button>
        </form>
      </div>
    </div>

    <div class="table">
      <table class="table">
        <thead>
          <tr>
            <td>设备编号</td>
            <td>设备名称</td>
            <td>设备类型</td>
            <td>所属组织id</td>
            <td>操作</td>
          </tr>
        </thead>
        <tbody>
          <tr  v-for="item in dataAll" :key="item.deviceid">
            <td>{{item.devicecode}}</td>
            <td>{{item.devicename}}</td>
            <td>
              {{ returnType(item.type)}}
            </td>
            <td> {{item.organizationid}} </td>
            <td>
              <button type="submit" class="btn btn-sm btn-default" @click="deleteItem(item.deviceid)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="modolType ==2">
     xxx
    </div>
    <div v-if="modolType != null && modolType !=2">
      xxx
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import modal from './edit.vue'
// import basechange from './base.vue'
// import {getHeights} from 'utils/page/setting'
export default {
  data () {
    return {
      dataAll: [],
      fuzzyquery: '',
      modolType: null,
      self: this,
      transferData: {
        deviceid: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      // updateState: 'updateState'
      // get_user_info:'GET_USER_INFO'
    })
  },
  created () {
    this.$nextTick(() => {
    // this.refresh()
    // getHeights()
    })
  },
  watch: {
    'updateState': function () {
      // this.refresh()
      this.$store.state.updateState = 0
    }
  },
  components: {
    // modal,
    // basechange
  },
  methods: {
    returnType (type) {
      switch (type) {
        case 0:
          return '语音终端'
        case 1:
          return '视频终端'
        case 2:
          return '组播终端'
      }
    },
    refresh () {
      let organizationIdRequests = []
      organizationIdRequests.push(this.$ajax.get(`Feature/getFeatureByOrg/${this.$store.state.user_info.user.organizationid}?flag=false`))
      organizationIdRequests.push(this.$ajax.get(`Feature/getFeatureByOrg/${this.$store.state.user_info.user.organizationid}?flag=true`))
      this.$ajax.all(organizationIdRequests)
        .then((res) => {
          let allDevices = []
          if (res[0].data.code === 1 && res[0].data.result !== null) {
            res[0].data.result.forEach((re) => {
              if (re.devicecode === this.fuzzyquery || re.devicename === this.fuzzyquery || re.orgname === this.fuzzyquery || this.fuzzyquery === '') {
                allDevices.push(re)
              }
            })
          }
          if (res[1].data.code === 1 && res[1].data.result !== null) {
            res[1].data.result.forEach((re) => {
              if (re.devicecode === this.fuzzyquery || re.devicename === this.fuzzyquery || re.orgname === this.fuzzyquery || this.fuzzyquery === '') {
                allDevices.push(re)
              }
            })
          }
          allDevices.sort((x, y) => { return x.devicecode - y.devicecode })
          this.dataAll = allDevices
        })
    },
    openModal (id) {
      if (id === 0) {
        this.modolType = 0
      } else if (id !== -1) {
        this.modolType = 1
        this.transferData.deviceid = id
      } else {
        this.modolType = 2
      }
    },
    deleteItem (deviceId) {
      this.$ajax.post('Device/RemoveList', [deviceId])
        .then(res => {
          if (res.data.code === 1) {
            console.log('删除成功')
            this.refresh()
          }
        })
    },
    close () {
      this.modolType = null
    },
    getHeight () {
      // getHeights()
    }
  }
}
</script>
<style scoped>
</style>
