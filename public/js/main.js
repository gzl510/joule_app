/**
 * 入口主js
 * 1. 配置requirejs
 * 2. 加载所有模块, 启动应用
 */
// 1. 配置requirejs
require.config({
    //基本路径
    baseUrl:'js/',
    //映射模块: name:path
    paths:{
        //libs
        angular:'libs/angular',
        'angular-messages':'libs/angular-messages',
        'angular-route':'libs/angular-route',
        'Swiper':'libs/swiper.min',

        //自定义模板
        'app':'app/app',
        //controllers
        'HomeCtrl':'controllers/HomeCtrl',
        'PersonalCenterCtrl':'controllers/PersonalCenterCtrl',
        'AddNewAddrCtrl':'controllers/AddNewAddrCtrl',
        'AddrManageCtrl':'controllers/AddrManageCtrl',
        'ChooseCoordinateCtrl':'controllers/ChooseCoordinateCtrl',
        'FeedbackCtrl':'controllers/FeedbackCtrl',
        'LocationAddrCtrl':'controllers/LocationAddrCtrl',
        'LoginCtrl':'controllers/LoginCtrl',
        'OrderConfirmCtrl':'controllers/OrderConfirmCtrl',
        //routes
        'appRoute':'routes/appRoute',
        //services
        'serverService':'services/serverService',
        'mapService':'services/mapService',
        //utils
        'storageUtil':'utils/storageUtil'
    },
    shim:{
        'angular':{
            exports:'angular'
        },
        'angular-messages':{
            exports:'angular-messages',
            deps:['angular']

        },
        'angular-route':{
            exports:'angular-route',
            deps:['angular']
        }
    }
})
// 2. 加载所有模块, 启动应用
require(['angular', 'angular-messages', 'angular-route', 'app', 'HomeCtrl',
        'PersonalCenterCtrl', 'AddNewAddrCtrl', 'AddrManageCtrl', 'FeedbackCtrl',
        'appRoute', 'ChooseCoordinateCtrl', 'LocationAddrCtrl', 'LoginCtrl',
        'OrderConfirmCtrl', 'serverService', 'storageUtil', 'Swiper', 'mapService'],
    // 当模块加载完后调用
    function (angular) {
//启用当前angular应用
        angular.bootstrap(document, ['jouleApp'])
})