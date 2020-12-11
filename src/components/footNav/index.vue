<template>
  <div class="bottomTools">
    <div class="userInfo">
      <div class="userName">
        <span>您好 {{username}}<a @click="logout()"> [退出]</a>
          <a @click="setting()"><i class="fa fa-cogs"></i>系统设置</a>
<a @click="$router.go(0)"><i class="fa fa-refresh"></i>刷新页面</a>
        </span>
      </div>
    </div>
    <audio id="music"></audio>
    <div class="span_large">
      <el-tooltip :content="leftwatcher" placement="top" :disabled="leftwatcher == ''">
      <div :class="this.enable_leftwatcher==false?'':'fa fa-phone fa-2x'"></div>
      </el-tooltip>
      <el-tooltip :content="mobile" placement="top" :disabled="mobile == ''">
      <div :class="this.enable_mobile == false?'':'fa fa-mobile fa-2x'"></div>
      </el-tooltip>
      <div :class="this.vertoClose==0?'':'location_indicator'"></div>
    </div>
    <div class="audio-box" style="top: 5px;">
       <audio ref="audio" ></audio>
      <div class="audio-container">
        <div class="audio-view">
          <span>{{this.selectPhonex==null?'':'设备号码:'+this.selectPhonex.userID}}   {{this.selectPhonex==null?'':'设备名字:'+this.selectPhonex.name}}   {{(this.selectPhonex==null||this.selectPhonex.networkIP==null)?'':'IP地址:'+this.selectPhonex.networkIP+":"+this.selectPhonex.networkPort}}</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import {GET_USER_INFO} from 'store/getters/type'
// import {SET_USER_INFO} from 'store/actions/type'
export default {
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      activeIndex: -1, // 当前播放歌曲角标
      songlistShow: false, // 播放列表显示或隐藏
      playSwitch: true,
      totalTime: '00:00',
      now: '00:00',
      caonima: null,
      enable_leftwatcher: false,
      enable_mobile: false,
      leftwatcher: ''
    }
  },
  created () {
  },
  computed: {
    ...mapGetters({
    })
  },
  watch: {
  },
  methods: {
    ...mapActions({
    })
  }
}
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
  .audio-inline {
    li {
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
  }
</style>
