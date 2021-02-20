/**
 * @file: tools_base64.
 * @intro: base64加密解密工具.
 * @author: zzmhot.
 * @email: zzmhot@163.com.
 * @Date: 2017/5/9 13:45.
 * @Copyright(©) 2017 by zzmhot.
 *
 */

// 存储前缀
import {base64Prefix} from '../../common/config/index.js'

import base64 from 'js-base64'

class Base64 {
  constructor () {
    this.prefix = base64Prefix
    this.base64 = base64.Base64
  }

  // base64加密
  encode (val) {
    return this.base64.encode(base64Prefix + val)
  }

  // base解密
  decode (val) {
    return this.base64.decode(base64Prefix + val)
  }
}
export default new Base64()
