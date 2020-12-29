<template>
  <div>
      <h1>{{msg}}</h1>
  </div>
</template>

<script>
export default {
  name: 'alarm',
  data () {
    return {
      msg: '还没收到websockt数据'
    }
  },
  created () {
    let _this = this
    this.$nextTick(async () => {
      this.sockets.subscribe('alarm', (data) => {
        _this.msg = data
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  height: 500px;
  width: 99%;
  border: 25px solid red;
  padding: 25px;
  margin: 25px;
}
h1, h2 {
  font-weight: normal;
  }
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
