
import {cookieStorage} from '../../common/storage'

export default {
  // 用户信息和是否登录
  user_info: cookieStorage.get('user_info'),
  nameNumberMap: {},
  count: 10,
  LoginId: '',
  // 点击树菜单的 data
  updateState: 0,
  treeChanged: 0,
  TreeData: {},
  // 点击树菜单的 obj
  TreeObj: {}
}
