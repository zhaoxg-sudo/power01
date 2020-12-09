<script src="../../utils/page/meeting.js"></script>
<template>
  <div >
     <left-phone :select-phone="selectPhone" @reset='reset' ></left-phone>
    <div id="media">
      <video width=800 id="webcam" autoplay="autoplay" hidden="true"></video>
    </div> 
    <div ref="conf" class="middleCon">
      <iframe  v-if="!alarm_address==''" allowTransparency="true" height = "20000" width = "100%" :src="alarm_address"></iframe>
    <div class="functionMenu">
        <ul class="nav nav-justified menuList">
          <li id="a1" @click="clear" @mousedown="$btnMousedown" @mouseup="$btnMouseup" @touchend = "$btnMouseup" @touchstart = "$btnMousedown">
            <i class="fa fa-window-close-o fa-2x" aria-hidden="true"></i>
            <span>清空</span>
          </li>
        </ul>
      </div>
    </div>
    <right-phone></right-phone>
    <device-list></device-list>
    <switchs></switchs>
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
      selectPhone: [],
      verto:"",
    }
  },
  created () {
    this.$nextTick(function () {
      getHeight()
      getHeights()
      this.height = this.$refs.conf.offsetHeight
      this.verto = this.get_user_info.freeswitchData.VertoID
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
      alarm_address:'alarmAddress',
      selectPhonex: 'selectPhonex',
    })
  },
  methods: {
    refresh(){
      this.$store.dispatch('setSelectPhonex',null)
    },
    // 获取设备分组数据
    reset(){
    },
    clear(){
    let apiKey = this.alarm_address.split('/')[3]
    let groupKey = this.alarm_address.split('/')[5]
    let groupName = this.alarm_address.split('/')[6]
    let startUrl = "https://nvr.ieyeplus.com:8432/" + apiKey + "/monitor/" + groupKey
    this.$ajax.get(startUrl).then((res)=>{
        if(res.status == 200){
            let axios = []
            res.data.forEach( re => {
	    let parsed = JSON.parse(re.details).groups_name
            if(re.mode == "start" && parsed.slice(1,parsed.length-1).split(',').some((item)=>{return item == '"' + groupName + '"'}))
            axios.push(this.$ajax.get("https://nvr.ieyeplus.com:8432/" + apiKey + "/monitor/" + groupKey + "/" + re.mid +"/stop"))
            })
            this.$ajax.all(axios).then((res)=>{
                res.forEach(element => {
                })
            })
        }
    })
    this.$store.dispatch("setAlarmAddress","")
   },
  }
}
</script>

<style scoped>
iframe{
  background-color:transparent;
  border:none;
}
</style>
