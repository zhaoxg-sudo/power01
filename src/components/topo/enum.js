/**
 * 拓扑关系图
 * 枚举字典
 * @author: zhaoxuegang
 * @date: 2021-3-8
*/
let type = {
  INPUT: 'INPUT',
  FUNCTION: 'FUNCTION',
  ACTION: 'ACTION'
}

let bgColor = {
  INPUT: '#169ce4',
  FUNCTION: '#8fbb34',
  ACTION: '#ffc539'
}

let icon = {
  STATION: require('./images/report.png'),
  CUSTOM_DATA: require('./images/online.png'),
  DCCENTER: require('./images/condition.png'),
  ACCENTER: require('./images/caculator.png'),
  ACREMOTE: require('./images/post.png'),
  DCREMOTE: require('./images/http.png'),
  EMAIL: require('./images/email.png')
}

let name = {
  STATION: '站点组织',
  CUSTOM_DATA: '局端电源',
  DCCENTER: '直流局端电源',
  ACCENTER: '交流局端电源',
  ACREMOTE: '远端交流电源',
  DCREMOTE: '远端直流电源',
  EMAIL: '远端电源'
}

let portDelta = {
  INPUT_X: 0,
  Y: 15
}

export { type, bgColor, icon, name, portDelta }
