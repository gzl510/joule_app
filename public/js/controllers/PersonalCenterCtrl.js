/**
 * 定义个人中心
 */
define(['app', 'storageUtil'], function (app, storageUtil) {
    return app.controller('PersonalCenterCtrl', ['$scope', '$rootScope',
        function ($scope, $rootScope) {
            //设置首页title
            $rootScope.appTitle = '个人中心'
            //检查用户是否登录  如果没登录  提示前去登录
            const user = storageUtil.local.get(storageUtil.KEYS.USER)
            if(user === null){
                alert('请先登录')
                //跳转到登录页
                window.location = '#/login'
                return
            }
            //显示用户的手机号
            $scope.user = user
            //定义方法  点击地址管理、意见反馈所在li就可跳转页面
            $scope.toAmUI = function () {
                window.location = '#/addrManage'
            }
            $scope.toFbUI = function () {
                window.location = '#/feedback'
            }

        }])
})