<template>
  <div class="openTreeList" @click="open"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>

</template>

<script>
import $ from 'jquery'
export default {
  methods: {
    open () {
      $('.orgTreeList').removeClass('treeListHide').addClass('treeListShow')
      console.log('点击了树展开按钮')
      var contentWidth = $(window).width()
      var treeWidth = $('.orgTreeList').width()
      $('.content').css('left', treeWidth)
      $('.content').width(contentWidth - treeWidth - 10)
    }
  }
}
</script>

<style type="text/scss" rel="stylesheet/scss" lang="scss">

</style>
