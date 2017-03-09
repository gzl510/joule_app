/**
 * 前端路由配置模块
 */
define(['app'], function (app) {
    return app.config(['$routeProvider', function ($routeProvider) {
        //注册路由
        $routeProvider
            .when('/home', {
                templateUrl:'js/templates/home.html',
                controller:'HomeCtrl'
            })
            .when('/personal', {
                templateUrl:'js/templates/personalCenter.html',
                controller:'PersonalCenterCtrl'
            })
            .when('/addNewAddr', {
                templateUrl:'js/templates/addNewAddr.html',
                controller:'AddNewAddrCtrl'
            })
            .when('/addrManage', {
                templateUrl:'js/templates/addrManage.html',
                controller:'AddrManageCtrl'
            })
            .when('/chooseCoordinate', {
                templateUrl:'js/templates/chooseCoordinate.html',
                controller:'ChooseCoordinateCtrl'
            })
            .when('/feedback', {
                templateUrl:'js/templates/feedback.html',
                controller:'FeedbackCtrl'
            })
            .when('/locationAddr', {
                templateUrl:'js/templates/locationAddr.html',
                controller:'LocationAddrCtrl'
            })
            .when('/login', {
                templateUrl:'js/templates/login.html',
                controller:'LoginCtrl'
            })
            .when('/orderConfirm', {
                templateUrl:'js/templates/orderConfirm.html',
                controller:'OrderConfirmCtrl'
            })

            .otherwise('/home')
    }])
})