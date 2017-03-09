/**
 * 选择收货地址
 */
define(['app'], function (app) {
    return app.controller('LocationAddrCtrl', ['$scope', '$rootScope',
        function ($scope, $rootScope) {
            //设置首页title
            $rootScope.appTitle = '选择收货地址'
        }])
})