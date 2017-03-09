/**
 * 意见反馈
 */
define(['app', 'storageUtil'], function (app, storageUtil) {
    return app.controller('FeedbackCtrl', ['$scope', '$rootScope','serverService',
        function ($scope, $rootScope, serverService) {
            //设置首页title
            $rootScope.appTitle = '意见反馈'
            //收集数据  定义feedback属性，收集数据  从存储工具模块获得   因为数据存储在localStorage
            const {_id, phone} = storageUtil.local.get(storageUtil.KEYS.USER)
            $scope.feedback = {
                user_id:_id,
                phone:phone
            }
            $scope.submit = function () {
                serverService.feedback(this.feedback)
                    .then(result => {
                        console.log(result)
                        alert('吐槽成功了')
                        window.location = '#/home'
                    })
            }
        }])
})