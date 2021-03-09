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
  DEVICE: require('./images/report.png'),
  CUSTOM_DATA: require('./images/online.png'),
  LOGIC_RULE: require('./images/condition.png'),
  ARITHMETIC: require('./images/caculator.png'),
  APP: require('./images/post.png'),
  HTTP: require('./images/http.png'),
  EMAIL: require('./images/email.png')
}

let name = {
  DEVICE: '站点组织',
  CUSTOM_DATA: '局端电源',
  LOGIC_RULE: '直流电源',
  ARITHMETIC: '交流电源',
  APP: '远端交流模块',
  HTTP: '远端直流模块',
  EMAIL: '远端电源'
}

let portDelta = {
  INPUT_X: 0,
  Y: 15
}

export { type, bgColor, icon, name, portDelta }
