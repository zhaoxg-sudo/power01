<template>
  <div class="dept">
    <el-tree
      ref="tree"
      :data="treeData"
      highlight-current
      :props="defaultProps"
      :default-expanded-keys="defaultExpanded"
      @node-click="handleNodeClick"
      node-key="label"
      :expand-on-click-node="false"
      :render-content="renderContent"
    >
    </el-tree>
  </div>
</template>

<script>
// import $ from 'jquery'
import { mapGetters, mapActions } from 'vuex'
// import {GET_USER_INFO} from 'store/getters/type'
export default {
  props: {
    stationStatus: {
      type: String
    }
  },
  watch: {
    stationSatus: (stationStatus) => {
      console.log(stationStatus)
    }
  },
  data () {
    return {
      data: [
        {'catalogId': 0, 'parentId': -1, 'label': '站点设备树'},
        {'catalogId': 58, 'parentId': 0, 'label': '棋盘梁隧道1'},
        {'catalogId': 59, 'parentId': 58, 'label': '南向局端直流电源1'},
        {'catalogId': 60, 'parentId': 59, 'label': '南向远端1'},
        {'catalogId': 61, 'parentId': 59, 'label': '南向远端2'},
        {'catalogId': 62, 'parentId': 59, 'label': '南向远端3'},
        {'catalogId': 63, 'parentId': 59, 'label': '南向远端4'},
        {'catalogId': 64, 'parentId': 58, 'label': '北向局端直流电源2'},
        {'catalogId': 65, 'parentId': 64, 'label': '北向远端1'},
        {'catalogId': 66, 'parentId': 64, 'label': '北向远端2'},
        {'catalogId': 67, 'parentId': 0, 'label': '太子城隧道2'},
        {'catalogId': 68, 'parentId': 67, 'label': '局端交流电源1'}
      ],
      treeData: [],
      defaultExpanded: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapGetters({
      // get_user_info: GET_USER_INFO
    })
  },
  created () {
    this.$nextTick(function () {
      this.refresh()
    })
  },
  methods: {
    ...mapActions([
      'TreeChange',
      'setInitData'
    ]),
    refresh () {
      this.$ajax.get('http://power.ieyeplus.com:7001/' + 'localall')
        .then((res) => {
          this.treeData = this.actionGetCatalog(this.data)
          let data = this.treeData
          // let data = res.data.result
          // this.data = data
          console.log(data[0]['label'])
          // 初始化树对象
          this.TreeChange({data: data[0], node: {}})
            .then((res) => { console.log(res) })
          // 循环出默认展开项的ID
          for (let i in data) {
            this.defaultExpanded.push(data[i]['label'])
          }
          this.TreeChange({data: data[0], node: this.$refs.tree.$children[0]})
          this.$nextTick(() => {
            this.$refs.tree.$children[0].$el.className = this.$refs.tree.$children[0].$el.className + ' ' + 'is-current'
          })
        })
    },
    handleNodeClick (data, node, event) {
      // 判断点击的是否为默认选中的树节点，如果不是，取消默认选中
      if (event) {
        if (node.id !== this.$refs.tree.$children[0].node.id) {
          this.$refs.tree.$children[0].$el.className = 'el-tree-node'
        }
      }
      // 提交树对象，以及当前点击树菜单的数据至仓库
      this.TreeChange({data, node})
    },
    append (data, node) {
      const newChild = { catalogId: 100, parentId: 58, label: '新建站点', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      this.TreeChange({data, node})
    },
    remove (node, data) {
      console.log(data)
      let parent = node.parent
      parent.data.children.pop()
      let request = []
      this.users.forEach((element) => {
        request.push(element.userID)
      })
      if (request.length > 0) {
        this.$ajax.post(`User/RemoveList`, request)
          .then((res) => {
            if (res.data.code === 1) {
              this.$ajax.delete(`Organization/Remove/${data.organizationid}`)
                .then((res) => {
                  console.log(res)
                  if (res.data.code === 1) {
                    console.log('组织机构删除成功')
                    if (this.targetUserGroupId === '') {
                      this.$ajax.delete(`Role/Remove/${this.targetUserGroupId}`)
                      this.$ajax.post(`DeviceGroup/RemoveList/${this.deviceGroupsDelete}`)
                      console.log('用户组,设备组删除成功')
                      // window.location.reload()
                      // this.$emit("refresh")
                    } else {
                      console.log('用户组删除失败')
                    }
                  }
                })
            }
          })
      } else {
        console.log(data)
        this.$ajax.delete(`Organization/Remove/${data.organizationid}`)
          .then((res) => {
            if (res.data.code === 1) {
              console.log('组织机构删除成功')
              if (this.targetUserGroupId !== '') {
                this.$ajax.delete(`Role/Remove/${this.targetUserGroupId}`)
                console.log('用户组删除成功')
                // this.$emit("refresh")
                // window.location.reload()
              } else {
                console.log('用户组删除失败')
              }
            }
          })
      }
    },
    renderContent (h, { node, data, store }) {
      console.log('enter into tree update status........')
      console.log(this.stationStatus)
      if (this.stationStatus === 'change') {
        let neww = false
        if (node.label === '新建站点') {
          neww = true
        } else {
          neww = false
        }
        return (
          <span class="custom-tree-node">
            <span contenteditable = {neww} onkeydown={() => this.enter(event, data, node)} onblur = {() => this.renameDeviceGroupList(event, data, node)}>
              {node.label}
            </span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }><i class = "fa fa-plus"></i></el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }><i class = "fa fa-minus"></i></el-button>
            </span>
          </span>)
      } else {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>)
      }
    },
    enter (event, data, node) {
      if (event.keyCode === 13) {
        console.log(event, data, node)
        this.renameDeviceGroupList(event, data, node)
      }
    },
    renameDeviceGroupList (event, data, node) {
      console.log('焦点转移绑定成功')
      let text = event.target.textContent
      let children = node.parent.data.Children
      children[children.length - 1].orgname = text
      // if (text !== '新建设备分组') {
      this.$ajax.post('Organization/List', {pageIndex: 1, pageSize: 1000})
        .then((res) => {
          if (res.data.code === 1) {
            console.log(res)
            let total = res.data.result.length
            let vertos = []
            let axios = []
            res.data.result.forEach((org) => {
              axios.push(this.$ajax.get(`Organization/Detail/${org.organizationid}`))
            })
            this.$ajax.all(axios)
              .then(res => {
                res.forEach((re) => {
                  if (re !== null && re.data.result !== null) {
                    vertos.push(Number(re.data.result.vertoid.slice(2)))
                  }
                })
                let id = String(Math.max(...vertos) + 1).length > 1 ? String(Math.max(...vertos) + 1) : '0' + String(Math.max(...vertos) + 1)
                console.log(vertos, id)
                let vertoNum = '99' + id
                let alarmNum = '91' + id
                let voiceNum = '92' + id
                let broadNum = '93' + id
                let meetingNum = '94' + id
                this.$ajax.post('Organization/Create', {
                  orgcode: '00000' + String(Number(total) + 1),
                  orgname: text,
                  parentid: data.organizationid,
                  vertoid: vertoNum,
                  voicecallid: voiceNum,
                  meetingid: meetingNum,
                  broadid: broadNum,
                  alarmid: alarmNum
                })
                  .then((res) => {
                    console.log(res)
                    if (res.data.code === 1) {
                      let organizationID = res.data.result.organizationid
                      data.organizationid = organizationID
                      let request = {
                        rolename: text,
                        childdata: false
                      }
                      this.$ajax.post('Role/Create', request)
                        .then(res => {
                          console.log(res)
                          if (res.data.code === 1) {
                            let result = res.data.result
                            console.log(result)
                            this.$emit('refresh')
                          }
                        })
                    }
                  })
              })
          }
        })
      event.target.contentEditable = 'false'
    },
    actionGetCatalog (data) {
      let tree = []
      console.log('actionGetCatalog!')
      console.log('原始data', data)
      tree = this.getJsonTree(data, {
        id: 'catalogId',
        pid: 'parentId',
        children: 'children'
      })
      console.log('生成树data:')
      console.log(tree)
      return tree
    },
    getJsonTree (data, config) {
      let id = config.id || 'id'
      let pid = config.pid || 'pid'
      let children = config.children || 'children'
      let idMap = []
      let jsonTree = []
      data.forEach(function (v) {
        idMap[v[id]] = v
      })
      data.forEach(function (v) {
        let parent = idMap[v[pid]]
        if (parent) {
          !parent[children] && (parent[children] = [])
          parent[children].push(v)
        } else {
          jsonTree.push(v)
        }
      })
      // 循环遍历给tree加图标
      this.treeAddIcon(jsonTree)
      return jsonTree
    },
    treeAddIcon (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children) {
          // icon来自阿里巴巴矢量图标库http://iconfont.cn
          data[i].icon = 'iconfont icon-wenjianjia'
          this.treeAddIcon(data[i].children)
        } else {
          data[i].icon = 'iconfont icon-wenjian'
        }
      }
    }
  }
}
</script>
<style scoped>
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background: #313439;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin-left: 5px;
  }
.operation{
    float:right;
}
i {
    margin:0px 5px;
}
</style>
