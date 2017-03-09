/**
 * 登录
 */
define(['app', 'storageUtil'], function (app, storageUtil) {
    return app.controller('LoginCtrl', ['$scope', '$rootScope', '$interval',
                          'serverService',
        function ($scope, $rootScope, $interval, serverService) {
            //设置首页title
            $rootScope.appTitle = '登录'
            //设置按钮初始状态和文本信息
            $scope.isTiming = false
            $scope.btnText = '获取验证码'

            //开始计时响应
            $scope.startTime = function () {
                //1.检查手机号是否合法,
                //如果不合法则显示错误信息
                if(this.loginForm.tel.$invalid){
                    //显示提示信息
                    this.loginForm.tel.$dirty = true
                    return
                }

                //2.开始计时  更新状态
                $scope.isTiming = true
                //定义事件变量
                let time = 60
                $scope.btnText = `${time}s重新获取`
                //启动循环定时器  ：更新btnText
                const stop = $interval(() => {
                    time--
                    $scope.btnText = `${time}s重新获取`
                    //到达结束时间  更新状态
                    if(time===0){
                        $scope.isTiming = false
                        $scope.btnText = '获取验证码'
                        //停止定时器  并且清空验证码输入框
                        $interval.cancel(stop)
                        $scope.user.code = ''
                    }
                }, 1000)
                //发送ajax请求 ---> 发送验证码
                serverService.sendCode($scope.user.phone)
                    .then(result => {
                        console.log(result);
                    })
            }

            $scope.login = function () {
                serverService.login(this.user)
                    .then(result => {
                        //验证码不正确
                        if(result.code === 1){
                            alert('验证码不正确')
                        } else {
                            alert('登陆成功')
                            //定义返回的数据data为user
                            // data": {"phone": "13716962779","_id": "576bbe0aa1d183c42c06c08e"}
                            const user = result.data
                            //保存user到localStorage
                            // localStorage.setItem('_user_', JSON.stringify(user))
                            storageUtil.local.set(storageUtil.KEYS.USER, user)
                            //跳转到首页
                            window.location = '#/home'
                        }
                    })
            }


        }])
})