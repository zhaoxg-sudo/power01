
// import * as act from './type'
// import * as mutations from './type'

export default {
  //  刷新页面和树
  update ({commit}, val) {
    commit('UPDATE', val)
  },
  // 单击树
  TreeChange ({commit}, val) {
    commit('TREECHANGE', val)
  }
}
