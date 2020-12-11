<template>
  <!--head部分-->
  <div class="menubanner">
    <div class="logo">
      <img src="../../assets/img/logo.fw.png" />
    </div>
    <div class="headMenu">
      <i class="fa fa-bars fa-2x" aria-hidden="true"></i>
      <ul class="nav nav-justified headMenuList">
        <router-link  v-for="item in menuList" :key="item.path" tag="li" active-class="active" :to="item.path" >
          {{item.name}}
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      menuList: []
    }
  },
  created () {
  }
}
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">
  .menubanner {
    .headMenuList li {
      cursor: pointer;
    }
  }
</style>
