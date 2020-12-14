
// import * as type from './type'
// import {cookieStorage} from '../../common/storage/index'
// import 'assets/js/common'

export default {
  TREECHANGE (state, val) {
    state.TreeData = val.data
    state.TreeObj = val.node
  }
}
