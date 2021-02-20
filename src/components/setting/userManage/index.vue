<template>
  <div class="content">
    <div v-if="modolType!=null && modolType >=0 ">
      aaa
      </div>
      <div v-if="modolType!=null && modolType < 0">
       aaa
      </div>
      <div class="groupList">
      <div class="menuType">
        <i class="fa fa-list-ul" aria-hidden="true"></i>远程供电站点
        <span><button type="button" class="btn btn-sm btn-info" @click="changeStatus">修改</button></span>
      </div>
      <tree :stationStatus="stationStatus"></tree>
    </div>
    <div class="singleDevice">
      <div class="table">
        <h3> 站点详情 </h3>
      </div>
      <div class="table">
        <h3> 用户 </h3>
        <h3 v-if = "allDevices.length>0">局端设备</h3>
        <h3 v-if = "deviceGroups.length>0">设备组</h3>
      </div>
    </div>
        <!--<paging></paging>-->
  </div>
</template>
<script>
// import deviceList from './deviceList.vue'
// import alarm from './alarm.vue'
import $ from 'jquery'
import { mapGetters } from 'vuex'
import tree from '../structureTree/index.vue'
// import paging from '../paging/index.vue'
// import modal from './modal.vue'
// import edit from './edit.vue'
// import {getHeights} from 'utils/page/setting'
// import { GET_USER_INFO } from 'store/getters/type'
const labels = {
  defaultId: 'organizationid',
  treeName: 'orgname'
}
export default {
  directives: {
    focus: {
      update: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      // get_user_info: GET_USER_INFO,
      updateState: 'updateState',
      TreeData: 'TreeData'
    })
  },
  data () {
    return {
      stationStatus: 'show',
      showDeviceList: false,
      labels,
      selectUser: [],
      dataAll: [],
      deviceGroups: [],
      targetMenu: {},
      self: this,
      modolType: null,
      targetUserGroup: null,
      allDevices: [],
      targetUserGroupId: '',
      transferdata: {deviceId: '', targetMenuId: ''},
      deviceGroupsDelete: [],
      verto: '',
      meeting: '',
      voice: '',
      broad: '',
      alarm: '',
      instance: this.$ajax.create({
        baseURL: 'https://scc.ieyeplus.com:8001/'
      })
    }
  },
  watch: {
    'TreeData': {
      handler: function (data) {
        this.targetMenu = data
        this.transferdata.targetMenuId = data.organizationid
        this.targetUserGroup = data.orgname
        this.modolType = null
        /* this.deviceGroups.forEach(
          (item,index)=>{
            this.deviceGroups.splice(index,1)
          }
        ) */
        this.$nextTick(function () {
          // this.refresh()
        })
      },
      deep: true
    },
    'updateState': function (e) {
      console.log('update changed :', e)
      if (this.updateState === 1) {
        this.refresh()
      } else if (this.updateState === 2) {
        this.refresh()
        this.$refs.tree.refresh(this.targetMenu)
      }
      this.$store.state.updateState = 0
    }
  },
  components: {
    tree
    // modal,
    // paging,
    // deviceList,
    // edit
    // alarm,
  },
  created () {
    this.$nextTick(() => {
      // this.refresh()
      this.getHeights()
    })
    this.targetMenu = this.TreeData
    if (!this.targetMenu.hasOwnProperty('organizationid')) {
      this.targetMenu = { organizationid: 'b202669251a046bbbc727ff3fb25f9f4' }
    }
    // this.targetUserGroup = this.$store.state.user_info.user.orgname
    // this.OrgUrl = 'Organization/TreeRoot/' + this.$store.state.user_info.user.organizationid
  },
  methods: { // 组织机构树默认选中
    closeAlarmMessage () {
      this.alarm_show = false
    },
    changeAlarmMessage () {
      this.alarm_show = true
    },
    initDatas (data) {
      if (!this.targetMenu.hasOwnProperty('organizationid') && data) {
        this.targetMenu = data
        this.refresh()
      }
    },
    // 渲染表格数据
    refresh () {
    },
    openModal (status, id) {
      // 编辑或新增
      if (status === 1) {
        if (id === 0) {
          this.modolType = 0
        } else {
          this.modolType = 1
          this.targetMenu.userid = id
        }
      }
      if (status === -1) {
        if (id === 0) {
          this.modolType = -1
        } else {
          this.modolType = -2
          this.transferdata.deviceid = id
        }
      }
    },
    closeModal () {
      this.modolType = null
    },
    deleteDevice (deviceId, deviceCode) {
      let request = {}
      request.deviceId = deviceId
      request.deviceCode = deviceCode
      this.$ajax.post('Device/deletes', [request])
        .then(res => {
          if (res.data.code === 1) {
            this.deviceGroups = []
            this.refresh()
          }
        })
    },
    deleteUser (userId) {
      this.$ajax.delete(`User/Remove/${userId}`)
        .then(res => {
          if (res.data.code === 1) {
            this.refresh()
          }
        })
    },
    open () {
      this.showDeviceList = true
      $('.singleDevice').removeClass('moveRightMiddle').addClass('moveLeftMiddle')
      $('.allDevice').removeClass('moveRightDev').addClass('moveLeftDev')
    },
    close () {
      this.showDeviceList = false
      $('.singleDevice').removeClass('moveLeftMiddle').addClass('moveRightMiddle')
      $('.allDevice').removeClass('moveLeftDev').addClass('moveRightDev')
    },
    changeStatus () {
      if (this.stationStatus === 'show') {
        this.stationStatus = 'change'
      } else {
        this.stationStatus = 'show'
      }
      console.log('now update status =', this.stationStatus)
    },
    getHeights () {
      //  高度判断
      var windowHeight = $(window).height()
      $('.content').height(windowHeight - 120)
      // var maxHeight = windowHeight - $('.sysName').outerHeight()
      // var contentHeight = $('.content').outerHeight()
    }
  }
}

</script>
<style  scoped>
.watcher{
  margin-left: 5px;
}
</style>
