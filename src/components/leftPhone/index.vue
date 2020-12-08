<template>
  <div class="phone left">
    <div class="phoneTitle">
     <i class="fa fa-phone" aria-hidden="true"></i>{{this.confname.show + "队列 &nbsp" + (this.confname.name=='confleft'?(this.deskPhone==true?this.phone:this.verto):"")}} 

     <div style="display:inline;"> 
      <el-dropdown 
        @command = "handleCommand" 
        :hide-on-click = "true"
        trigger= "click"
        @visible-change = "count"
	v-if = "confname.name!='confleft'"
      >
     <el-button type="primary"  >
      {{this.choosenConf}}<i class="el-icon-arrow-down el-icon--right" ></i>
    </el-button>
     <el-dropdown-menu slot="dropdown">
    <el-dropdown-item v-for="con in conf_detail"  :command ="con.conf_num" :key = "con.conf_num" >{{con.conf_num + " " + con.group_name + " 人数:" + con.num}}</el-dropdown-item>
  </el-dropdown-menu>
  </el-dropdown>
      </div>

      <div      style="display:inline;" 
		:class="(!flag_conf)&&(conf.length>0)?'phoneMeeting meetingOut':(flag_conf?'phoneMeeting meetingIn':'phoneMeeting')"
		@click="toggle_enter"><!--进入为phoneMeeting 离开添加meetingOut-->
        <i aria-hidden="true" 	
		:class="flag_conf ? 'fa fa-sign-out fixed-nav' :(conf.length>0?'fa fa-volume-control-phone fixed-nav':'fa fa-plus fixed-nav')"></i>
		{{flag_conf?'离开':'进入'}}
		</div><!--进入为fa-plus 离开为fa-sign-out 有语音呼入为fa-volume-control-phone fixed-nav-->
    </div>
    <div class="numList">
      <div>
        <ul class="callNum">
          <!--<li v-for="item in callQueue">-->
          <!--<i  class="fa fa-circle red" aria-hidden="true"></i>-->
          <!--1005-->
          <!--<span>00:00:01</span>-->
          <!--</li>-->
          <li class ="unselected" v-if="item.caller_id_number!=verto" v-for="item in conf" @click.stop="select($event,item)">
	  <i :class="callStatus(item)" aria-hidden="true"></i> 
		             {{ item.caller_id_number }}
          </li>
          <!--<li><i class="fa fa-clock-o" aria-hidden="true"></i>1005</li>-->
        </ul>
      </div>
    </div>
    <div>
      <video width="800" id="video-container" autoplay="autoplay" hidden="true"></video>

    </div>
    <div class="phoneDial">
      <div class="dial rightdial" v-for="(item,index) in btnData" @click.stop='buttonclick(item.name)' @touchstart = "$btnMousedown" @touchend = "$btnMouseup" @mousedown="$btnMousedown" @mouseup="$btnMouseup">
	<el-tooltip :content="item.content" placement="top"  :open-delay = "1000" >
        <i aria-hidden="true" class="fa" :class="item.class"></i>
	</el-tooltip>
        <span>{{item.name}}</span>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import {GET_USER_INFO} from 'store/getters/type'
  const btnData = [
    { name: '邀请成员', class: 'fa-user-plus',content:"邀请右侧非离线状态的选中设备进入会议" },
    { name: '允许通话', class: 'fa-microphone' ,content:"允许上方选中的会议成员通话"},
    { name: '排队等待', class: 'fa-spinner' ,content:"使上方选中的会议成员进入排队等待状态，不能通话也不能听见他人通话"},
    { name: '踢出会话', class: 'fa-sign-out',content:"使上方选中的会议成员离开会议"},
    { name: '只听不说', class: 'fa-microphone-slash',content:"允许上方选中的会议成员听见他人通话,禁止上方选中的会议成员通话"},
    { name: '结束服务', class: 'fa-window-close-o',content:"踢出会议所有成员并结束会议" },
    { name: '用户转出', class: 'fa-user-times',content:"开启用户转出动作,标记右侧非离线状态的选中设备" },
    { name: '确认转出', class: 'fa-reply-all',content:"将上方选中的会议成员从会议中踢出，并和标记的右侧设备进行联通" },
    { name: '接听通话', class: 'fa-phone',content:"管理员接听队列中的选中通话" },
  ]
  export default {
    props:{
	  selectPhone:{
	    type: Array,
      default: []},
    },
    data() {
      return {
        btnData,
        selected:[],
        status:"进入",
        conf:[],
        confname:{},
        userDeflect:"",
        flag_conf:false,
        flag_confalarm:false,
        flag_callqueue:false,
        verto: "",
        meeting: "",
        voice: "",
        broad: "",
        alarm: "",
	      org:"",
        choosenConf : "",
        instance : this.$ajax.create({
         baseURL: 'https://scc.ieyeplus.com:8001/'
        }),
        conf_detail:[],
        role_id:"",
        deskPhone:true,
	phone:""

      }
    },
    created() {
      this.$nextTick(function () {
        // getHeight()
        // $.verto.init({}, this.bootstrap);
        this.organizationid = this.get_user_info.user.organizationid
        this.verto = this.get_user_info.freeswitchData.VertoID
        this.meeting = this.get_user_info.freeswitchData.MeetingID
        this.voice = this.get_user_info.freeswitchData.VoiceCallID
        this.alarm = this.get_user_info.freeswitchData.AlarmID
        this.broad = this.get_user_info.freeswitchData.BroadID
        this.org = this.get_user_info.user.orgname
        if(this.$router.history.current.fullPath=="/voiceCall"){
          this.conf = this.$store.getters.confLeft
          this.confname = {name:'confleft',num: this.voice,show:"通话"}
	  this.choosenConf = this.voice
        }
        else if(this.$router.history.current.fullPath=="/ipBroad") {
          this.conf = this.$store.getters.confIpBoard
          this.confname = {name:'confipboard',num:this.broad,show:"广播"}
	  this.choosenConf = this.broad
        }
        else if(this.$router.history.current.fullPath=="/meeting") {
                this.conf = this.$store.getters.confMeeting
                this.confname = {name:'confmeeting',num:this.meeting,show:"会议"}
	  this.choosenConf = this.meeting
        }
        else if(this.$router.history.current.fullPath=="/radio") {
                this.conf = this.$store.getters.confMeeting
                this.confname = {name:'confmeeting',num:this.meeting,show:"对讲"}
	  this.choosenConf = this.meeting
        }
        else if(this.$router.history.current.fullPath=="/alarm") {
                this.conf = this.$store.getters.confLeft
                this.confname = {name:'confleft',num:this.voice,show:"语音"}
	  this.choosenConf = this.voice
        }
        this.refresh()
      })
    },
    mounted(){
    },
    watch: {
        'choosenConfLeft': function(conf) {
        if(conf!="" && conf!=undefined){
        if(this.confname.name == 'confleft')
        this.confname.num = conf
        this.voice = conf
        }
      },
      'choosenConfMeeting' :function(conf) {
        if(conf!="" && conf!=undefined){
        if(this.confname.name == 'confmeeting')
        this.confname.num = conf
        this.meeting = conf
        }
      },
      'choosenConfIpboard' :function(conf){
       if(conf!="" && conf!=undefined){
        if(this.confname.name == 'confipboard')
        this.confname.num = conf
        this.broad = conf
        }
      },
        callQueue:function(callqueue)
        {
        if(callqueue.length>0){
         if(callqueue[0].caller == this.verto || callqueue[0].des ==this.verto)
                this.flag_callqueue = true
         else
                this.flag_callqueue = false
        }
        else
                this.flag_callqueue = false
        },
        conf:function(conf)
        {
        for(var  i = 0;i < conf.length;i++)
                  if(conf[i].caller_id_number == this.verto)
                        {   this.flag_conf = true
                            break
                        }
        if(i==conf.length)
             this.flag_conf = false
        if(conf.length>0 && conf.every((item,index,array)=>{return item.caller_id_number==this.verto}))
        {
           conf.forEach((item)=>{
           this.fsAPI('conference',this.confname.num+'-scc.ieyeplus.com'+' ' +'hup'+' '+item.conf_id)
                })
        }

        },
	      confAlarm:function(confalarm)
        {
        for(var  i = 0;i < confalarm.length;i++)
                  if(confalarm[i].caller_id_number == this.verto)
                        {   this.flag_confalarm = true
                            break
                        }
        if(i==confalarm.length)
             this.flag_confalarm = false

        },
    },
    computed: {
      ...mapGetters({
        vertoHandle: 'vertoHandle',
        group_users: 'group_users',
        users: 'users',
        currentLoginUser: 'currentLoginUser',
        callQueue: 'callQueue',
	confLeft : 'confLeft',
	confAlarm : 'confAlarm',
        confIpBoard : 'confIpBoard',
        selectedAlarm : 'selectedAlarm',
        get_user_info: GET_USER_INFO,
        vertoHandle: 'vertoHandle',
        choosenConfLeft:'choosenConfLeft',
        choosenConfMeeting:'choosenConfMeeting',
        choosenConfIpboard: 'choosenConfIpboard',
	deviceList : 'deviceList',
      }),
    },
    methods: {
      count(status){
        console.log(status)
        this.conf_detail.forEach((co,index)=>{
          this.vertoHandle.sendMethod("jsapi",{command:"fsapi", data:{cmd:"conference", arg:co.conf_name  +  " " + "list as xml"}},
          (data)=>{
              if(data.message.slice(0,4)=="-ERR"){
                co.num = 0
                this.$set(this.conf_detail, index,co )
              }
              else{
                co.num = data.message.split('\n').length - 1
                this.$set(this.conf_detail, index,co )
              }
          })
        })
        this.conf_detail.sort((x,y)=>{return y.num - x.num} )
      },
  async refresh(){
     this.$ajax.post(`Role/List`)
                    .then(async (res) => {
                      if (res.data.code === 1) {
                        let groupList = res.data.result
                        groupList.forEach(element => {
                          if(element.rolename == this.get_user_info.user.orgname){
                            this.roleid = element.roleid
                          }
                        })
			let re1 = await this.instance({
                              method:'get',
                              url:`organization/${this.organizationid}`,
                            })
                  				this.deskPhone = re1.data.enable_left_watcher
                  				this.phone = re1.data.left_watcher

                          let re2 = await this.instance({method: "post",url: "Conference/Detail",
                          data: {
                            confname: this.$router.history.current.fullPath.slice(1),
                            organizationid: this.organizationid,
                            roleid: this.roleid
                          }});
                          this.conf_detail = re2.data.result;
                          this.conf_detail.forEach(co => {
                            co.num = 0;
                          });
                      }
                  })

  },
      handleCommand(conf){
        if(this.choosenConf == conf)
          return 
        else{
            this.choosenConf = conf
            let application_des = ""
            let arr = []
            switch(this.confname.name){
                    case 'confleft':
                    arr = this.$store.getters.confLeft
                    while(arr.length>0)
                    arr.pop()
                    this.$store.dispatch('setConfLeft',arr)
                    this.$store.dispatch('setChoosenConfLeft',conf)
                    break
                    case 'confipboard':
                    arr = this.$store.getters.confIpBoard
                    while(arr.length>0)
                    arr.pop()
                    this.$store.dispatch('setConfIpBoard',arr)
                    this.$store.dispatch('setChoosenConfIpboard',conf)
                    break
                    case 'confmeeting':
                    arr = this.$store.getters.confMeeting
                    while(arr.length>0)
                    arr.pop()
                    this.$store.dispatch('setConfMeeting',arr)
                    this.$store.dispatch('setChoosenConfMeeting',conf)
                    break
              }
            }
      },
      callStatus(item){
          if(item.muted == true && item.deaf == true)
            return 'fa fa-spinner red'
          else if(item.muted == true && item.deaf == false)
            return 'fa fa-microphone-slash blue'
          else if(item.muted == false && item.deaf == false)
            return 'fa fa-microphone green'
          else 
            return 'fa fa-circle orange'
      },
       toggle_enter(){
          this.instance({url:"organization/" + this.organizationid,method:"get"})
          .then((res)=>{
	  let left_watcher = res.data.left_watcher
	  let right_watcher = res.data.right_watcher
          if(this.conf.length>0)
          this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"pause_play"+" " +this.conf[0].conf_id)
                let _this = this
          if(this.flag_conf==true)
          {
                this.conf.forEach((item,index,array)=>{
                  if(_this.confname.num!=this.alarm && item.caller_id_number == (res.data.enable_left_watcher==true?res.data.left_watcher:this.verto))
                    this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"hup"+" "+item.conf_id)
		  else if(_this.confname.num==this.alarm && item.caller_id_number == (res.data.enable_right_watcher==true?res.data.right_watcher:this.verto))
                    this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"hup"+" "+item.conf_id)
              if(_this.confname.num==this.alarm){
            this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"mute"+" "+item.conf_id)
            this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"deaf"+" "+item.conf_id)}
                })
          }
              else
		{
		      if(_this.confname.num==this.alarm){
                     if(res.data.enable_left_watcher==false){
                      this.vertoHandle.hangup()
                      this.vertoHandle.newCall({
                      destination_number: this.confname.num,
                        caller_id_name: "LegalHigh",
                      caller_id_number: this.verto,
                      outgoingBandwidth: "default",
                      incomingBandwidth: "default",
                      useStereo: true,
                      dedEnc: false,
                      tag: "video-container",
                      deviceParams: {
                        useMic: "any",
                        useSpeak: "any",
                        useCamera: "any"
                      }
                    })
                    }
                        else{
                         _this.fsAPI('conference',_this.confname.num+"-scc.ieyeplus.com"+" bgdial user/"+res.data.right_watcher+ " " + _this.confname.num)
                    }
		    }
		    else{
		    if(res.data.enable_left_watcher==false){
                      this.vertoHandle.hangup()
                      this.vertoHandle.newCall({
                      destination_number: this.confname.num,
                        caller_id_name: this.verto,
                      caller_id_number: this.verto,
                      outgoingBandwidth: "default",
                      incomingBandwidth: "default",
                      useStereo: true,
                      dedEnc: false,
                      tag: "video-container",
                      deviceParams: {
                        useMic: "any",
                        useSpeak: "any",
                        useCamera: "any"
                      }
                    })
                    }
                        else{
                         _this.fsAPI('conference',_this.confname.num+"-scc.ieyeplus.com"+" bgdial user/"+res.data.left_watcher + " " + _this.confname.num)
                    }
                    }
          if(this.confname.num==this.voice){
          _this.fsAPI('conference',_this.confname.num+"-scc.ieyeplus.com"+" "+"unmute"+" "+_this.conf[0].conf_id)
          _this.fsAPI('conference',_this.confname.num+"-scc.ieyeplus.com"+" "+"undeaf"+" "+_this.conf[0].conf_id)
            }
          }
        })
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
      buttonclick(name){
        switch(name){
          case '踢出会话':
              if(this.selected.length > 0)
                this.selected.forEach((a,i)=>{
                  this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"hup"+" "+a.conf_id)
                })
	      if(this.selectedAlarm.length > 0)
                this.selectedAlarm.forEach((a,i)=>{
                  this.fsAPI('conference',this.alarm+"-scc.ieyeplus.com"+" "+"hup"+" "+a.conf_id)
                })
		break
          case '允许通话':
              if(this.selected.length > 0){
                this.selected.forEach((a,i)=>{
		              this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"pause_play"+" "+a.conf_id)
                  this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"unmute"+" "+a.conf_id)
                  this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"undeaf"+" "+a.conf_id)
		
		})
		
           	$('.selected').removeClass().addClass('unselected')
           	this.selected = []
                }
		if(this.selectedAlarm.length > 0){
                this.selectedAlarm.forEach((a,i)=>{
		              this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"pause_play"+" "+a.conf_id)
                  this.fsAPI('conference',this.alarm+"-scc.ieyeplus.com"+" "+"unmute"+" "+a.conf_id)})
                //this.selectedAlarm.forEach(function(a,i){
                //  _this.fsAPI('conference',"9110-scc.ieyeplus.com"+" "+"undeaf"+" "+a.conf_id)})
                $('.selected').removeClass().addClass('unselected')
		            this.$store.dispatch('setSelectedAlarm',[])
                }
		break
          case '排队等待':
              if(this.selected.length > 0){
                this.selected.forEach((a,i)=>{
		  this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"pause_play"+" "+a.conf_id)
                  this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"mute"+" "+a.conf_id		   )
                  this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"deaf"+" "+a.conf_id		   )
		  //this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"pause_play"+" "+a.conf_id)
		            })
		            $('.selected').removeClass().addClass('unselected')
           	    this.selected = []
                }
		            if(this.selectedAlarm.length > 0){
                this.selectedAlarm.forEach((a,i)=>{
                  this.fsAPI('conference',this.alarm+"-scc.ieyeplus.com"+" "+"mute"+" "+a.conf_id)})
                // this.selectedAlarm.forEach(function(a,i){
                //  _this.fsAPI('conference',"9110-scc.ieyeplus.com"+" "+"deaf"+" "+a.conf_id)})

		            $('.selected').removeClass().addClass('unselected')
                this.$store.dispatch('setSelectedAlarm',[])
		            }
	  break
	  case '结束服务':
	      if(this.conf)
              this.conf.forEach((a,i)=>{
              this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"kick"+" "+a.conf_id)
	        }) 
	      if(this.confAlarm)
              this.confAlarm.forEach((a,i)=>{
              this.fsAPI('conference',this.alarm+"-scc.ieyeplus.com"+" "+"kick"+" "+a.conf_id)
                })
	        break
	   case '用户转出':
	      if(this.flag_confalarm == true && this.selectedAlarm.length>0)
		      this.userDeflect = this.selectedAlarm[0].channel_uuid
              else if(this.selected.length > 0)
                this.userDeflect = this.selected[0].channel_uuid
	      //this.$emit('reset')
	      break
	   case '确认转出':
	      if(this.userDeflect!=""){
		 this.fsAPI('uuid_transfer',this.userDeflect+ " "+"sip:"+this.selectPhone[0].userID+"@"+this.selectPhone[0].networkIP+":"+this.selectPhone[0].networkPort)	
	      }
	      this.userDeflect = "" 
		$('.selected').removeClass().addClass('unselected')
               this.selected = []
               this.$store.dispatch('setSelectedAlarm',[])
	       this.$emit('reset')
	      break
	   case '接听通话':
	      
	      let selected = this.selected
	      let deviceList = this.deviceList
	      let currentLoginUser = this.currentLoginUser
	      let fsAPI = this.fsAPI
	      let voice = this.voice 
	      this.instance({url:"organization/" + this.organizationid,method:"get"})
              .then((res)=>{
		let uuid
		if( selected.length > 0)
	      	uuid =  selected[0].channel_uuid 
		if(res.data.enable_left_watcher == true){
		let left_watcher = deviceList.find(function(x){return x.userID == res.data.left_watcher})
	        fsAPI("uuid_dual_transfer" , left_watcher.channelUUID  +  " " + voice + "/XML/default "  +  voice + "/XML/default") 	
	        //setTimeout(	
		//	function(){
	      		fsAPI("uuid_bridge", uuid + " " + left_watcher.channelUUID)//} , 500) 
		}
		else{
		fsAPI("uuid_bridge", uuid + " " + currentLoginUser.channelUUID)
		}
		this.$store.dispatch('setSelectedAlarm',[])
                $('.selected').removeClass().addClass('unselected')
                this.selected = []
		})
              	//this.$store.dispatch('setSelectedAlarm',[])
	        //$('.selected').removeClass().addClass('unselected')
              	//this.selected = []
	      break
	   case '邀请成员':
		if(this.selectPhone.length > 0 && this.flag_confalarm == true){
                 this.selectPhone.forEach((a,i)=>{
                  this.fsAPI('conference',this.alarm+"-scc.ieyeplus.com"+" "+"bgdial"+" "+(a.type==2?"loopback/":"user/")+  a.userID+" "+this.alarm + "warning")
                })
                }
		else if(this.selectPhone.length > 0 ){
                 this.selectPhone.forEach((a,i)=>{
                  this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+(this.confname.num==this.broad ? '+flags{mute}' :'') +" "+"bgdial"+" "+(a.type==2?"loopback/":"user/")+  a.userID+" " + this.confname.num )

                })
                }
		this.$emit('reset')
                break
	   case '只听不说':
		if(this.selected.length > 0){
                this.selected.forEach((a,i)=>{
                  this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"mute"+" "+a.conf_id)})
                this.selected.forEach((a,i)=>{
                  this.fsAPI('conference',this.confname.num+"-scc.ieyeplus.com"+" "+"undeaf"+" "+a.conf_id)})

		 $('.selected').removeClass().addClass('unselected')
                this.selected = []
                }
		break
        }

      },
      select(e,item){
	console.log(e)
        let _this = this
        let target = e.currentTarget
	console.log(e.currentTarget.parentElement.nextElementSibling)
	    if($(target).hasClass('unselected')){
            $(target).removeClass().addClass('selected')
            if(this.selected.findIndex(function(caller,index,array){return caller.conf_id==item.conf_id})==-1 ){
          this.selected.push(item)}
        }
        else if ($(target).hasClass('selected')){
            $(target).removeClass().addClass('unselected')
            this.selected.forEach((a,i) => {if(a.conf_id==item.conf_id) this.selected.splice(i,1)})
        }

	    },
      clear() {
        this.destination_number = this.destination_number.substring(0, this.destination_number.length - 1)
      },
      keypad(value) {
        this.destination_number = this.destination_number + value
      },
      answerCall(item) {
        this.callQueue[0].curCall.answer();
      },
      callDivert() {
        // 呼叫转移
        if (this.destination_number != '') {
          this.$store.dispatch('CallDivert', { type: true, num: this.destination_number })
        }
      },
      makeCall() {
        this.vertoHandle.newCall({
          // Extension to dial.
          destination_number: this.destination_number,
          caller_id_name: 'LegalHigh',
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
      hangupCall() {
        this.vertoHandle.hangup();
      }

    }
  }
</script>

<style scoped>
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown-group {
    background-color:#4E545A;
    color:white;
    border:none;
  }
  .el-dropdown-menu {
    background-color:#4E545A;
    color:white;
    border:none;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-button{
    background-color:#69C7F9;
    padding: 8px 4px;
    margin-left:5px; 
  }

</style>
