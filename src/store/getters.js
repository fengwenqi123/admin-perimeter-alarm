const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  cancelTokenArr: state => state.permission.cancelTokenArr
}
export default getters
