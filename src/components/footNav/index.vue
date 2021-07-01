<template>
  <div class="bottomTools">
    <div class="userInfo">
      <div class="userName">
        <span>Hi {{username}}<a @click="logout()"> [退出]</a>
          <a @click="setting()"><i class="fa fa-cogs"></i>配置管理</a>
          <a @click="$router.go(0)"><i class="fa fa-refresh"></i>刷新页面</a>
          &nbsp;  &nbsp;&nbsp; copyright©北京三合云海科技有限责任公司  &nbsp;&nbsp; v0.7.02 2021.0701
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
      <div></div>
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
import {GET_USER_INFO} from '@/store/getters/type'
import {SET_USER_INFO} from '@/store/actions/type.js'
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
      leftwatcher: '',
      mobile: '',
      selectPhonex: null
    }
  },
  created () {
  },
  computed: {
    ...mapGetters({
      get_user_info: GET_USER_INFO
    })
  },
  watch: {
  },
  methods: {
    ...mapActions({
      set_user_info: SET_USER_INFO
    }),
    logout () {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--primary',
        type: 'warning'
      }).then(() => {
        this.$message.success('退出成功')
        this.set_user_info({
          user: null,
          freeswitchData: null,
          login: false
        })
        setTimeout(this.$router.replace({name: 'login'}), 500)
      }).catch(() => {
        this.$message.success('退出取消')
      })
    },
    setting () {
      this.$router.push('/setting')
    }
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
