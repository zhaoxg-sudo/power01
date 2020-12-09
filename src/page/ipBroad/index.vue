<template>
  <div >
 <left-phone  :select-phone="selectPhone" @reset='reset'></left-phone>
   <div id="media">
      <video width=800 id="webcam" autoplay="autoplay" hidden="true"></video>
    </div>
    <div class="middleCon">

      <div class="module">
        <ul class="nav nav-justified choose" data-name="title">
          <li @click="refresh(null)" class="on">全部</li>
          <li @click="refresh(userGroup[0])">分组</li>
        </ul>
        <div data-name="con">
          <div class="moduleList" id="height01">
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
                 v-for='item in userGroup'>{{  item.name + " " + item.devicegroup_extn}}</li>
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
            </div>
            </div>
          </div>
        </div>
      </div>

      <playList :selectPhone="selectPhone" v-if="playListShow"  @closeDialog="close(2)"></playList>



      <div class="functionMenu">
        <ul class="nav nav-justified menuList">
         <!-- <li id="a1" @click="tmute" @mousedown="$btnMousedown" @mouseup="$btnMouseup"><i class="fa fa-user-circle fa-2x" aria-hidden="true"></i><span>管理员静音</span></li>-->
          <li id="a2" @click="startIpbroad" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
		<i :class="returnVertoState()"  aria-hidden="true"></i>
		<span>{{mute}}</span></li>
          <!-- <li id="a3" @click="play" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown"><i class="fa fa-play-circle-o fa-2x" aria-hidden="true"></i><span>播放</span></li> -->
          <li id="a4" @click="pauseOrPlay" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown"><i class="fa fa-fast-forward fa-2x" aria-hidden="true"></i><span>播放/暂停</span></li>
          <li id="a5" @click="allOver" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown"><i class="fa fa-window-close fa-2x" aria-hidden="true"></i><span>全部结束</span></li>
          <li id="a5" @click="selectAll" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown"><i class="fa fa-group fa-2x" aria-hidden="true"></i><span>全选</span></li>
        </ul>
      </div>
    </div>

    
    <switchs></switchs>

    <div class="playList ListShow">
      <div class="listTitle">播放设备列表</div>
      <div class="musicList" id="end">
        <div class="songSheet" v-for="songlist in playList" @click="(()=> songlist.unfold = !songlist.unfold)">
          <div class="songSheetName" :class="songlist.selected ? 'songSheetNameSelect' : ''" @click="addMusic(songlist)">
            <div class="songSetting">
              <span class="toggle"><i class="fa fa-angle-right" aria-hidden="true"></i></span>
              <p>{{songlist.foldername}}</p>
              <span class="musicNum">[{{ songlist.Files ? songlist.Files.length :0}}]</span>
            </div>
          </div>
          <ul class="musicList" v-if="songlist.unfold">
            <li v-for="fileItem in songlist.Files">
              <p>{{fileItem.filename}}</p>
              <span class="totalTime" v-if="fileItem.mediatype == 1">{{fileItem.filetime}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="btnDiv">
        <button type="button" class="btn btn-info" @click="playMusic">播放</button>
      </div>

      
    </div>
    <callDivert v-if="phoneShow"></callDivert>
  </div>
</template>

<script>
  import {getHeight} from 'utils/height'
  import {getHeights,itemClicks} from 'utils/page/ipBroad'
  import { mapGetters,mapActions } from 'vuex'
  import playList from './playList.vue'
  import {GET_USER_INFO} from 'store/getters/type'
  import {leftPhone, rightPhone,switchs,callDivert} from 'components'

  export default {
    watch:{
	'choosenConfIpboard':function(conf){
	this.name = conf + "-scc.ieyeplus.com" 
	}
    },
    data() {
      this.deviceList
      return {
        playState: '暂停',
        selectPhone: [],
        name: "",
        playListShow: false,     //播放列表显示切换
	groupShow:"",
        playList: [],
        selectPlayList: [],
        anotherSong: [],
	mute:"喊话",
	selectNowCall: [],
        selectRingCall: [],
        verto:"",
        broad:"",

      }
    },
    components: {
      leftPhone,
      rightPhone,
      switchs,
      playList,
      callDivert
    },
    created() {
      this.$nextTick(function() {
        getHeight()
        getHeights()
        this.verto = this.get_user_info.freeswitchData.VertoID
        this.broad = this.get_user_info.freeswitchData.BroadID
        this.name = this.broad + '-' + window.location.hostname
        this.refresh()
        this.reFresh()  
      })
    },
    /* watch: {
      whetherPlayAnotherSong: 'pauseOrPlay',
    }, */
    computed: {
      ...mapGetters({
        phoneShow:'phoneShow',
        vertoHandle:'vertoHandle',           // verto初始化
        deviceList:'deviceList',                       // 所有设备
        currentLoginUser:'currentLoginUser',  // 当前用户
	callQueue:'callQueue',
	userGroup:'userGroup',
	confIpBoard:'confIpBoard',
	choosenConfIpboard:'choosenConfIpboard',
        whetherPlayAnotherSong:'whetherPlayAnotherSong',
        get_user_info: GET_USER_INFO,
        selectPhonex: 'selectPhonex',
      }),
    },
    methods: {
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
      returnVertoState(){
	if(this.confIpBoard.some((item,index)=>{return item.caller_id_number==this.verto && item.muted == true})){
		this.mute = "喊话"
		return  "fa fa-bullhorn fa-2x"
	    }
	 else if(this.confIpBoard.some((item,index)=>{return item.caller_id_number==this.verto && item.muted == false})){
		this.mute = "静音"
		return  "fa fa-window-close fa-2x"	
		}
	 else if(!this.confIpBoard.some((item,index)=>{return item.caller_id_number==this.verto})){ 
		this.mute = "喊话"
		return "fa fa-bullhorn fa-2x"
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
	//case undefined:
        //  return "online"
        //  break
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

    reFresh() {
      this.$ajax.get('Folder/getTreeFiles', {params: {userID: '133585596bb04c9cbe311d0857dd7196'}})
        .then(res => {
          if(res.data.code == 1) {
            let result = res.data.result
            result.forEach(function(r,i){
              r.unfold = false
            })
            this.playList = result
          }
        })
    },
   itemClick (e, row) {
      let target = e.currentTarget
      let _this = this
      /* let ifAdd = 0
      this.selectPhonex.forEach(function (s, i) {
        if (s.userID == row.userID) {
          ifAdd = 1
          _this.selectPhonex.splice(i, 1)
        }
      })
      if (ifAdd===0) {
        this.selectPhonex.push(row)
      }  */
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

    },
      play() {
        this.playListShow = true
        this.$nextTick(function(){
          $('.playMenu').removeClass('Hide').addClass('Show');

        })
      },
      close(type) {
        if(type == 1) {
          $('.playList').removeClass("ListShow").addClass("ListHide");
        }else {
          $('.playMenu').removeClass('Show').addClass('Hide');
          this.playListShow = false
        }
      },
      removeItem(event) {
        let _this = this
        this.selectPhone.forEach(function(s,i) {
          if(s.userID == event.userID) {
            _this.selectPhone.splice(i, 1)
          }
        })
        this.deviceList.forEach(function(g, i) {
          if(g.userID == event.userID) {
            $('#height01 .singleM').eq(i).find('.moduleStyle').removeClass("onlineSelected")
          }
        })
      },
      removeAll() {
        if(this.selectPhone.length != 0) {
          this.selectPhone = []
          this.deviceList.forEach(function (g, i) {
            $('#height01 .singleM').eq(i).find('.moduleStyle').removeClass("onlineSelected")
          })
        }
      },
      selectAll() {
	this.selectPhone = []
	this.deviceList.forEach((device)=>{
		if(this.groupShow=="" || this.returnGroup(device) == true)
		this.selectPhone.push(device)	
		})
	$('.online').addClass('onlineSelected') 
	},
      
      addMusic(item) {
        if(this.selectPlayList[0] == null) {
          console.log("none");
          this.selectPlayList.push(item)
        }else if(this.anotherSong[0] == null) {
          console.log("one");
          this.anotherSong.push(item)
        }else{
          this.anotherSong[0] = item
        }
        item.selected = !item.selected
      },

      playMusic() {
        let files = []
        this.$store.dispatch('setWhetherPlayAnotherSong','yes')
        let music = this.selectPlayList[0].mediapath;
          if(this.anotherSong[0] == null){
            let usera = this.selectPlayList[0];
            let _this = this;
            let file_string = "file_string://"
            usera.Files.forEach((usern,index) =>{
              let  x = usern.mediapath.indexOf("IpBcFiles") ;
              let  y = usern.mediapath.substring(x);
              let  z = "/var/lib/tomcat8/webapps/"+y;
              files.push(z)
            })
            file_string += files.join('!')
            this.fsAPI("conference"," " + _this.name + " " + "play" + " " +"{vol=5}"+ file_string,function(res){console.log("bofang")})
          }else {
            this.selectPlayList[0] = this.anotherSong[0]
            let usera = this.selectPlayList[0]
            let _this = this
            let file_string = "file_string://"
	    this.$store.dispatch("setPlayFileDoneFlag", true )
            this.fsAPI("conference"," " + _this.name + " " + "stop",function(res){console.log("qie ge")});
            usera.Files.forEach((usern,index)=>{
              let  x = usern.mediapath.indexOf("IpBcFiles") ;
              let  y = usern.mediapath.substring(x);
              let  z = "/var/lib/tomcat8/webapps/"+y;
              files.push(z)
            })
            file_string += files.join('!')
            this.fsAPI("conference"," " + _this.name + " " + "play" + " " +"{vol=5}"+ file_string ,function(res){console.log("qiege")})
          }
      },  

      pauseOrPlay() {
        if(this.whetherPlayAnotherSong == 'no') {
          console.log("The same song");
          if(this.playState == '暂停') {
            this.playState = '继续播放'
            this.fsAPI("conference",this.name + " " + "pause_play",function(res) {console.log("zan ting")}.bind(this));
          }else {
            this.playState = '暂停'
            this.fsAPI("conference",this.name + " " + "pause_play",function(res) {console.log("continue play")}.bind(this));
          }
        }else {
         console.log("Another song"); 
         this.playState = '继续播放'
         this.fsAPI("conference",this.name + " " + "pause_play",function(res) {console.log("play a new song")}.bind(this));
         this.$store.dispatch('setWhetherPlayAnotherSong','no')
        }
      },

      shout() {
        this.vertoHandle.newCall({
          destination_number: this.choosenConfIpboard,
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
            useCamera: "any"
          }
        })
      },

      startIpbroad() {
        // 喊话
        const laChannelName = this.getChannelName("liveArray");
        if(!this.confIpBoard.some((item,index)=>{return item.caller_id_number==this.verto})){ 
	  
	  $('.onlineSelected').removeClass('onlineSelected').addClass('online')

          // 创建会议室
          this.broadcast(laChannelName, {
            liveArray: {
              command: "bootstrap",
              context: laChannelName,
              name: this.name,
              obj: {}
            }
          });
        }
	else if(this.confIpBoard.some((item,index)=>{return item.caller_id_number==this.verto && item.muted == true}))
	  this.tmute()
	 else if(this.confIpBoard.some((item,index)=>{return item.caller_id_number==this.verto && item.muted == false}))
	  this.tmute()
      },
      broadcast(channel, params) {

        let msg = {
          eventChannel: channel,
          data: {}
        }

        for (var i in params) {
          msg.data[i] = params[i]
        }
        this.vertoHandle.sendMethod("verto.broadcast", msg);
      },
      getChannelName(what) { // liveArray chat mod
        return "conference-" + what + "." + this.name + "@" + window.location.hostname
      },
      fsAPI(cmd, arg, success_cb, failed_cb) {
        this.vertoHandle.sendMethod("jsapi", {
          command: "fsapi",
          data: {
            cmd: cmd,
            arg: arg
          },
        }, success_cb, failed_cb);
      },
      allOver() {
        // 结束全部喊话和播放
	this.fsAPI('conference',this.choosenConfIpboard+'-scc.ieyeplus.com'+' '+'hup'+' '+'all')
	this.selectPhone = []
	$('.onlineSelected').removeClass('onlineSelected').addClass('online')
      },
      tmute(){
          // this.fsAPI("conference",this.name + " " + "pause_play" + "all",function(res) {console.log("zan ting")}.bind(this));
	console.log(this.confIpBoard)
        this.confIpBoard.forEach((item,index)=>{	
	if(item.caller_id_number==this.verto)
	this.fsAPI('conference',this.choosenConfIpboard+'-scc.ieyeplus.com'+' '+'tmute'+' '+item.conf_id)
	})
	}
    }
 }
</script>

<style scoped>

</style>
