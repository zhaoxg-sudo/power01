<script src="../../utils/page/meeting.js"></script>
<template>
  <div >
     <left-phone  :select-phone="selectPhone" @reset='reset'></left-phone>
     <div id="media">
      <video width=800 id="webcam" autoplay="autoplay" hidden="true"></video>
    </div> 
    <div class="middleCon">
      <div class="module">
        <ul class="nav nav-justified choose" data-name="title">
          <li class="on">全部</li>
          <li @click="refresh(userGroup[0])">分组</li>
        </ul>
        <div data-name="con">
          <div class="moduleList " id="height01">
            <div class="singleM" v-for="item in deviceList">
              <div class="moduleStyle" :class="returnClass(item.deviceState,item.type)" @click.stop="itemClick($event, item)">
                <div class="moduleNum" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><i :class="returnIcon(item.type)" aria-hidden="true"></i>{{item.userID + " " + (item.name==null?"":item.name)}}</div>
                <div class="moduleKind">{{returnType(item.type)}}
			<i class="fa fa-user" v-if = "item.deviceState=='active' || item.deviceState=='ringing'"></i>
                        {{(item.calling==null?"":item.calling)}}
		</div>
		<div class="moduleState">{{ returnState(item.deviceState)  + "   " + ((item.timer.s>0 || item.timer.m>0 || item.timer.h>0)?
                        ((item.timer.h/10<1?"0"+item.timer.h+":":item.timer.h+":")+
                        (item.timer.m/10<1?"0"+item.timer.m+":":item.timer.m+":")+
			(item.timer.s/10<1?"0"+Math.floor(item.timer.s):Math.floor(item.timer.s))):"")}}
              </div>
              </div>
            </div>
          </div>
          <div class="moduleList">
            <div class="department">
              <ul data-name="title">
                <li
                @click="refresh(item)"
                :class="{on: item.selected}"
                 v-for='item in userGroup'>{{ item.name + " " + item.devicegroup_extn}}</li>
              </ul>
            </div>
            <div class="rightDetailList" data-name="con">
              <div class="departDetail">
                <div class="detailCon">
                  <div class="singleM" v-show="returnGroup(item)" v-for="item in deviceList">
			<div class="moduleStyle" :class="returnClass(item.deviceState,item.type)" @click.stop="itemClick($event, item)">
                <div class="moduleNum"><i :class="returnIcon(item.type)" aria-hidden="true"></i>{{item.userID + " " + (item.name==null?"":item.name)}}</div>
		<div class="moduleKind">{{returnType(item.type)}}
                        <i class="fa fa-user" v-if = "item.deviceState=='active' || item.deviceState=='ringing'"></i>
                        {{(item.calling==null?"":item.calling)}}
                </div>
                <div class="moduleState">{{ returnState(item.deviceState)  + "   " + ((item.timer.s>0 || item.timer.m>0 || item.timer.h>0)?
                        ((item.timer.h/10<1?"0"+item.timer.h+":":item.timer.h+":")+
                        (item.timer.m/10<1?"0"+item.timer.m+":":item.timer.m+":")+
                        (item.timer.s/10<1?"0"+Math.floor(item.timer.s):Math.floor(item.timer.s))):"")}}
              		</div>
                    </div>
                  </div>

                </div>
                <div class="selectAll">全部选择</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="functionMenu">
        <ul class="nav nav-justified menuList">
          <li id="a1" @click="call" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
            <el-tooltip content="对单个设备发起呼叫" placement="top" :open-delay = "1000" >
            <i class="fa fa-phone fa-2x" aria-hidden="true" :style="adminState==1?{color: 'yellow'}: {color: 'white'}"></i>
            </el-tooltip>
            <span :style="adminState==1?{color: 'yellow'}: {color: 'white'}">呼叫</span>
          </li>
          <li id="a2" @click="strongCall" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
            <el-tooltip content="强行插入到选中设备的呼叫当中，断掉对端呼叫" placement="top"  :open-delay = "1000" >
            <i class="fa fa-volume-control-phone fa-2x" aria-hidden="true" :style="adminState==2?{color: 'yellow'}: {color: 'white'}"></i>
             </el-tooltip>
            <span :style="adminState==2?{color: 'yellow'}: {color: 'white'}">强行通话</span>
          </li>
          <li id="a3" @click="strongDelete" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
            <el-tooltip content="强行结束选中的呼叫" placement="top"  :open-delay = "1000" >
            <i class="fa fa-window-close fa-2x" aria-hidden="true"  :style="adminState==6?{color: 'yellow'}: {color: 'white'}"></i>
            </el-tooltip>
            <span :style="adminState==6?{color: 'yellow'}: {color: 'white'}">强拆</span>
          </li>
          <li id="a4" @click="strongJoin" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
            <el-tooltip content="强行插入到选中设备的呼叫当中并形成三方通话" placement="top"  :open-delay = "1000" >
            <i class="fa fa-deaf fa-2x" aria-hidden="true" :style="adminState==3?{color: 'yellow'}: {color: 'white'}"></i>
            </el-tooltip>
            <span :style="adminState==3?{color: 'yellow'}: {color: 'white'}">强插</span>
          </li>
          <li id="a5" @click="observe" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
            <el-tooltip content="强行插入到选中设备的呼叫进行监听,对方无法听见管理员" placement="top"  :open-delay = "1000" >
            <i class="fa fa-headphones fa-2x" aria-hidden="true" :style="adminState==4?{color: 'yellow'}: {color: 'white'}"></i>
            </el-tooltip>
            <span :style="adminState==4?{color: 'yellow'}: {color: 'white'}">监听</span>
          </li>
          <li id="a6" @click="daiJie" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
            <el-tooltip content="管理员对选中的未接听的呼叫进行代接，与其建立通话" placement="top"  :open-delay = "1000" >
            <i class="fa fa-phone-square fa-2x" aria-hidden="true" :style="adminState==5?{color: 'yellow'}: {color: 'white'}"></i>
            </el-tooltip>
            <span :style="adminState==5?{color: 'yellow'}: {color: 'white'}">代接</span>
          </li>
          <li id="a7" @click="callTraverse" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
            <el-tooltip content="将管理员进行的通话转给选中的在线话机" placement="top"  :open-delay = "1000" >
            <i class="fa fa-reply fa-2x" aria-hidden="true"  :style="adminState==7?{color: 'yellow'}: {color: 'white'}"></i>
            </el-tooltip>
            <span :style="adminState==7?{color: 'yellow'}: {color: 'white'}">转到</span>
          </li>
            <li id="a8" @click="connect" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
            <el-tooltip content="在两个在线设备之间直接建立呼叫" placement="top"  :open-delay = "1000" >
            <i class="fa fa-arrow-right fa-2x" aria-hidden="true" :style="adminState==8?{color: 'yellow'}: {color: 'white'}"></i>
            </el-tooltip>
            <span :style="adminState==8?{color: 'yellow'}: {color: 'white'}">直连</span>
          </li>
        </ul>
      </div>
    </div>
    <right-phone></right-phone>
  </div>
</template>

<script>
import parseXML from 'utils/xml_parser';
import { mapGetters, mapActions } from 'vuex'
import { getHeight } from 'utils/height'
import { getHeights, itemClick } from 'utils/page/voiceCall'
import {GET_USER_INFO} from 'store/getters/type'
import { leftPhone, rightPhone, deviceList, switchs} from 'components'

export default {
  components: {
    leftPhone,
    rightPhone,
    deviceList,
    switchs,
  },
  data () {
    return {
      inputValue: '',
      deviceAll: [],
      currentCall: null,
      destination_number: '',
      nowCall: [],
      instance : this.$ajax.create({
                         baseURL: 'https://scc.ieyeplus.com:8001/'
      }),
      selectNowCall: [],
      selectPhone: [],
      selectRingCall: [],
      deviceGroupList: [],
      deviceGroup: [],
      num: 0,
      groupShow:"",
      verto: "",
    }
  },
  created () {
    this.$nextTick(function () {
      getHeight()
      getHeights()
      this.verto = this.get_user_info.freeswitchData.VertoID
      this.organizationid = this.get_user_info.user.organizationid
      //this.initData()
      this.refresh()
    })
  },
  computed: {

    ...mapGetters({
      dialogShow:'dialogShow',
      callQueue:'callQueue',
      vertoHandle:'vertoHandle',
      group_users:'group_users',
      users:'users',
      deviceList:'deviceList',
      currentLoginUser:'currentLoginUser',
      userGroup:'userGroup',
      get_user_info: GET_USER_INFO,
      selectPhonex: 'selectPhonex',
      adminState: 'adminState',
      deviceStatus: 'deviceStatus'
    })
  },
  methods: {
    // 获取设备分组数据
    reset(){
    this.selectPhone = []
    $('.onlineSelected').removeClass('onlineSelected').addClass('online')
    },
    returnIcon(type){
      switch(type){
        case 0:
          return "fa fa-microphone"
          break
        case 1:
          return "fa fa-video-camera"
          break
        case 2:
          return "fa fa-user"
          break
      }

    },
    returnType(type){
      switch(type){
        case 0:
          return "语音终端"
          break
        case 1:
          return "视频终端"
          break
        case 2:
          return "组播终端"
          break
      }

    },
    returnGroup(item){
      return item.groupid.some((it)=>{return it==this.groupShow})
    },
    returnClass(status,type){
      switch(status){
        case "registered":
          return "online"
          break
        case "registeredM":
          return "onlineMulticast"
          break
        case "unregistered":
          return "offline"
          break
        case "ringing":
          return "waitting"
          break
        case "active":
          return "calling"
          break
        case "register":
          return "online"
          break
        default:
          return "online"
      }
    },
    returnState(status){
      switch(status){
	case "registeredM":
          return "在线"
          break
        case "registered":
          return "在线"
          break
        case "unregistered":
          return "离线"
          break
        case "ringing":
          return "振铃"
          break
        case "active":
            return "通话中"
            break
	case "register":
          return "在线"
          break
      }
    },
    refresh (item) {
      this.$store.dispatch('setSelectPhonex',null)
      this.userGroup.forEach((r, i) => {
              r.selected = false
            })
      if(item){
      item.selected = true
      this.groupShow = item.devicegroupid
     }
      else
      this.groupShow = ""
    },
    itemClick (e, row) {
      let target = e.currentTarget
      let _this = this
      let ifAdd = 0
      this.selectPhone.forEach(function (s, i) {
        if (s.userID === row.userID) {
          ifAdd = 1 
        }
      })
      if (this.selectPhonex === null && ifAdd === 0) {
        this.$store.dispatch('setSelectPhonex',row) 
      }else if(this.selectPhonex === null && ifAdd === 1) {
        this.$store.dispatch('setSelectPhonex',null)
      }else {
        if (this.selectPhonex.userID === row.userID) {
          this.$store.dispatch('setSelectPhonex',null) 
        }else {
          if(ifAdd === 1) {
          }else { 
            this.$store.dispatch('setSelectPhonex',row) 
          }
        }
      }
     if ($(target).hasClass('online')) {
        if ($(target).hasClass("onlineSelected")) {
          $(target).removeClass("onlineSelected")
          this.selectPhone.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectPhone.splice(i, 1)
            }
          })
        } else {
          $(target).addClass("onlineSelected");
          this.selectPhone.push(row)
        }
      } 
      else if ($(target).hasClass('onlineMulticast')) {
        if ($(target).hasClass("onlineMulticastSelected")) {
          $(target).removeClass("onlineMulticastSelected")
          this.selectPhone.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectPhone.splice(i, 1)
            }
          })
        } else {
          $(target).addClass("onlineMulticastSelected");
          this.selectPhone.push(row)
        }
      }
	else if ($(target).hasClass("calling")) {
        if ($(target).hasClass("callingSelected")) {
          $(target).removeClass("callingSelected");
          this.selectNowCall.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectNowCall.splice(i, 1)
            }
          })
        } else {
          $(target).addClass("callingSelected");
          this.selectNowCall.push(row)
        }
      } else if ($(target).hasClass("waitting")) {
        if ($(target).hasClass("waittingSelected")) {
          $(target).removeClass("waittingSelected");
          this.selectRingCall.forEach(function (s, i) {
            if (s.userID == row.userID) {
              _this.selectRingCall.splice(i, 1)
            }
          })
        } else {
          $(target).addClass("waittingSelected");
          this.selectRingCall.push(row)
        }
      }
      this.destination_number =this.selectPhone.length>0?this.selectPhone[0].userID:'';

    },
    fsAPI (cmd, arg, success_cb, failed_cb) {
      this.vertoHandle.sendMethod("jsapi", {
        command: "fsapi",
        data: {
          cmd: cmd,
          arg: arg
        },
      }, success_cb, failed_cb);
    },



    // 实现管理员和指定话机的强行通话
    async strongCall () {
      let users = this.deviceList
      let userChanged = false
      if(this.selectNowCall.length == 0 || this.selectNowCall.length >1){
        this.$message.success("请选择一个正在通话中的设备进行操作")
        $('.onlineSelected').removeClass('onlineSelected').addClass('online')
        $('.callingSelected').removeClass('callingSelected').addClass('calling')
        $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
        this.selectRingCall = []
        this.selectPhone = []
         this.selectNowCall = []
        return
      }
      let select = this.selectNowCall[0]
      if (userChanged) this.$store.dispatch('setDeviceList', users)
      let result = await this.instance({
          method: 'get',
          url: '/organization/'+ this.organizationid,
      })
      if(result.data.enable_left_watcher && !isNaN(parseInt(result.data.left_watcher))){
	 this.fsAPI("uuid_transfer", select.channelUUID+ " " + result.data.left_watcher + " XML default")
         this.$store.dispatch('setAdminState', 2);
       }else {
         this.vertoHandle.newCall({
           destination_number: '9801' + select.channelUUID,
           caller_id_name: this.verto,
           caller_id_number: this.verto,
           outgoingBandwidth: 'default',
           incomingBandwidth: 'default',
           useStereo: true,
           dedEnc: false,
           tag: "video-container",
           deviceParams: {
             useMic: "any",
             useSpeak: "any",
             useCamera: "any",
           }
         }) 
         this.$store.dispatch('setAdminState', 2);
       }     
      this.selectNowCall = [];
      $('.onlineSelected').removeClass('onlineSelected').addClass('online')
    },


     // 实现管理员对指定通话的强拆
       strongDelete() {
          if(this.selectRingCall.length == 0  &&  this.selectNowCall.length == 0){
          success("请选择一个通话或呼叫中的设备进行操作")
          $('.onlineSelected').removeClass('onlineSelected').addClass('online')
          $('.callingSelected').removeClass('callingSelected').addClass('calling')
          $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
            this.selectRingCall = []
            this.selectPhone = []
            this.selectNowCall = []
          return
        }
    if(this.selectNowCall.length>0){
    this.selectNowCall.forEach((call)=>{
          this.fsAPI("uuid_kill",call.channelUUID,function(res) {console.log("qiang delete")}.bind(this))
          this.selectNowCall = []
    })
    }
	 if(this.selectRingCall.length>0){
	this.selectRingCall.forEach((call)=>{
         this.fsAPI("uuid_kill",call.channelUUID,function(res) {console.log("qiang delete")}.bind(this))
         this.selectRingCall = []
	})
	}
	this.$store.dispatch('setAdminState', 6);
      },

    // 实现管理员对指定通话的强插
    async strongJoin () {

      if(this.selectNowCall.length == 0 || this.selectNowCall.length >1){
        this.$message.success("请选择一个正在通话中的设备进行操作")
        $('.onlineSelected').removeClass('onlineSelected').addClass('online')
        $('.callingSelected').removeClass('callingSelected').addClass('calling')
        $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
        this.selectRingCall = []
        this.selectPhone = []
         this.selectNowCall = []
        return
      }
      let select = this.selectNowCall[0];
      let result = await this.instance({
                        method: 'get',
          url: '/organization/'+ this.organizationid,
                        })
      if(result.data.enable_left_watcher && !isNaN(parseInt(result.data.left_watcher))){
         this.fsAPI("originate","{origination_caller_id_number="+select.userID + "}user/"+result.data.left_watcher+" 9803"+select.channelUUID+" XML default");
         this.$store.dispatch('setAdminState', 3);
       }else {
         this.vertoHandle.newCall({
           destination_number: '9803' + select.channelUUID,
           caller_id_name: this.verto,
           caller_id_number: this.verto,
           outgoingBandwidth: 'default',
           incomingBandwidth: 'default',
           useStereo: true,
           dedEnc: false,
           tag: "video-container",
           deviceParams: {
             useMic: "any",
             useSpeak: "any",
             useCamera: "any",
           }
         })
         this.$store.dispatch('setAdminState', 3);
       }
      this.selectNowCall = [];
	$('.callingSelected').removeClass('callingSelected').addClass('calling')
    },

    // 实现管理员对指定通话的监听
    async observe () {
      if(this.selectNowCall.length == 0 || this.selectNowCall.length >1){
        this.$message.success("请选择一个正在通话中的设备进行操作")
        $('.onlineSelected').removeClass('onlineSelected').addClass('online')
        $('.callingSelected').removeClass('callingSelected').addClass('calling')
        $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
        this.selectRingCall = []
        this.selectPhone = []
         this.selectNowCall = []
        return
      }
      let select = this.selectNowCall[0];
      let result = await this.instance({
                        method: 'get',
          url: '/organization/'+ this.organizationid,
                        })
      if(result.data.enable_left_watcher && !isNaN(parseInt(result.data.left_watcher))){
         this.fsAPI("originate","{origination_caller_id_number="+select.userID +"}user/"+result.data.left_watcher+" 9802"+select.channelUUID+" XML default");
         this.$store.dispatch('setAdminState', 4);
       }else {
         this.vertoHandle.newCall({
           destination_number: '9802' + select.channelUUID,
           caller_id_name: this.verto,
           caller_id_number: this.verto,
           outgoingBandwidth: 'default',
           incomingBandwidth: 'default',
           useStereo: true,
           dedEnc: false,
           tag: "video-container",
           deviceParams: {
             useMic: "any",
             useSpeak: "any",
             useCamera: "any",
           }
         })
         this.$store.dispatch('setAdminState', 4);
       } 
      this.selectNowCall = [];
      $('.callingSelected').removeClass('callingSelected').addClass('calling')
    },

    // 实现第三方对于指定通话中一方的代接
    async daiJie () {
      if(this.selectRingCall.length == 0 || this.selectRingCall.length >1){
        $('.onlineSelected').removeClass('onlineSelected').addClass('online')
        $('.callingSelected').removeClass('callingSelected').addClass('calling')
        $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
        this.selectRingCall = []
        this.selectPhone = []
         this.selectNowCall = []
        this.$message.success("请选择一个正在呼叫中的设备进行操作")
        return
      }
      let users = this.deviceList;
      let userChanged = false;
      let select = this.selectRingCall[0];
      let result = await this.instance({
                        method: 'get',
          url: '/organization/'+ this.organizationid,
                        })
	
      let main_userid 
      if(select.oppoChannelUUID == select.channelUUID) 
	main_userid = select.userID
      else
	main_userid = select.calling
      if(result.data.enable_left_watcher && !isNaN(parseInt(result.data.left_watcher))){
         this.fsAPI("originate","{origination_caller_id_number="+ main_userid + "}user/"+result.data.left_watcher+" 9804"+this.selectRingCall[0].oppoChannelUUID+" XML default");
       this.$store.dispatch('setAdminState', 5);
       }else {
         this.vertoHandle.newCall({
           destination_number: '9804' + this.selectRingCall[0].oppoChannelUUID,
           caller_id_name: this.verto,
           caller_id_number: this.verto,
           outgoingBandwidth: 'default',
           incomingBandwidth: 'default',
           useStereo: true,
           dedEnc: false,
           tag: "video-container",
           deviceParams: {
             useMic: "any",
             useSpeak: "any",
             useCamera: "any",
           }
         })
         this.$store.dispatch('setAdminState', 5);
       }
      this.selectRingCall = [];
    },

     // 实现呼叫转移
       async connect(){
         if(this.selectPhone.length !=2){
          this.$message.success("请选两个在线非通话的设备进行操作")
          $('.onlineSelected').removeClass('onlineSelected').addClass('online')
          $('.callingSelected').removeClass('callingSelected').addClass('calling')
          $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
          this.selectRingCall = []
          this.selectPhone = []
         this.selectNowCall = []
          return
        }
          let caller = this.selectPhone[0].userID
          let callee = this.selectPhone[1].userID
          this.fsAPI("originate","{origination_caller_id_number="+ callee+"}user/" + caller+ " &bridge(user/" + callee + ")")
	  this.$store.dispatch('setAdminState', 8);
	  $('.onlineSelected').removeClass('onlineSelected').addClass('online')
          $('.callingSelected').removeClass('callingSelected').addClass('calling')
          $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
          this.selectRingCall = []
          this.selectPhone = []
         this.selectNowCall = []
       },
       async callTraverse() {
         if(this.selectPhone.length == 0 || this.selectPhone.length >1){
          this.$message.success("请选择一个在线非通话的设备进行操作")
          $('.onlineSelected').removeClass('onlineSelected').addClass('online')
          $('.callingSelected').removeClass('callingSelected').addClass('calling')
          $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
          this.selectRingCall = []
          this.selectPhone = []
         this.selectNowCall = []
          return
        }
         let leftwatcherdb = await this.instance({method: 'get', url: '/organization/'+this.organizationid})
         let leftwatcher
         let uuid 
         let queue
         let calling
         if(leftwatcherdb.data.enable_left_watcher == true)
           leftwatcher = leftwatcherdb.data.left_watcher
         if(leftwatcher != undefined)
         {
           this.deviceList.forEach((item)=>{
              if(item.userID == leftwatcher)
                calling = item.calling
           })
           if(calling!=undefined)
              queue = this.deviceStatus[calling]
           for(let uid in queue){
             if(queue[uid].deviceState == 'active' && queue[uid].calling == leftwatcher){
                uuid = uid
                break
          }
         }
	}
        else{
          if(this.currentLoginUser.calling!=null && this.currentLoginUser.calling!=undefined)
          queue = this.deviceStatus[this.currentLoginUser.calling]
          calling = this.currentLoginUser.calling
          for(let uid in queue){
             if(queue[uid].deviceState == 'active' && queue[uid].calling == this.currentLoginUser.userID){
                uuid = uid
                break
          }
        }
	}
        if(uuid!=undefined){
          console.log(uuid)
          this.fsAPI("originate","{origination_caller_id_number=" + calling + "}user/"+this.selectPhone[0].userID+" 9804"+uuid+" XML default");

        }
         this.$store.dispatch('setAdminState', 7); 
         this.selectPhone = [];
         this.selectNowCall = [];
         $('.onlineSelected').removeClass('onlineSelected').addClass('online')
         $('.callingSelected').removeClass('callingSelected').addClass('calling')
         $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
      },

      // call
      async call() {
        if((this.selectPhone.length  + this.selectNowCall.length + this.selectRingCall.length)!=1){
          this.$message.success("请选择单个设备进行操作")
          $('.onlineSelected').removeClass('onlineSelected').addClass('online')
          $('.callingSelected').removeClass('callingSelected').addClass('calling')
          $('.waittingSelected').removeClass('waittingSelected').addClass('.waitting')
          this.selectRingCall = []
          this.selectPhone = []
         this.selectNowCall = []
          return
        }
       let des
       if(this.selectPhone.length > 0) 
        des = this.selectPhone[0].userID
       else if(this.selectNowCall.length > 0) 
        des = this.selectNowCall[0].userID
       else if(this.selectRingCall.length > 0) 
        des = this.selectRingCall[0].userID
       let result = await this.instance({
                        method: 'get',
          url: '/organization/'+ this.organizationid,
                        })
       if(result.data.enable_left_watcher && !isNaN(parseInt(result.data.left_watcher))){
         this.fsAPI("originate","{origination_caller_id_number="+des+"}user/"+result.data.left_watcher+" "+des+" XML default");    
         this.$store.dispatch('setAdminState', 1);
       }else {
         this.vertoHandle.newCall({
           destination_number : des,
           caller_id_name: this.verto,
           caller_id_number: this.verto,
           outgoingBandwidth: 'default',
           incomingBandwidth: 'default',
           useStereo: true,
           dedEnc: false,
           videoParams: {
              "minWidth": "1280",
              "minHeight": "720",
              "minFrameRate": 30
            },
           tag: "video-container",
           deviceParams: {
             useMic: "any",
             useSpeak: "any",
             useCamera: "any",
           }
         })
         this.$store.dispatch('setAdminState', 1);       
       }
       this.selectPhone = [];
       $('.onlineSelected').removeClass('onlineSelected').addClass('online')
    },

    hangupCall () {
      this.vertoHandle.hangup();
    },
    play () {
      $('.playMenu').removeClass('Hide').addClass('Show');
    }
  }
}
</script>

<style scoped>
</style>
