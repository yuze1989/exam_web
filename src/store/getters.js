const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    token: state => state.user.token,
    userName: state => state.user.userName,
    nickname: state => state.user.nickname,
    roles: state => state.user.roles,
    menu: state => state.user.menu,
    loginCode: state => state.user.loginCode,
    imgUrl: state => state.user.imgUrl,
    permission_routes: state => state.permission.routes
}


export default getters