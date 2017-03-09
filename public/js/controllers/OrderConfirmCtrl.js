/**
 * 订单确认
 */
define(['app', 'storageUtil'], function (app, storageUtil) {
    return app.controller('OrderConfirmCtrl', ['$scope', '$rootScope', 'serverService', '$filter',
        function ($scope, $rootScope, serverService, $filter) {
            //设置首页title
            $rootScope.appTitle = '订单确认'
        //    读取session中保存的用户，如果，没有提示跳转登录
            const user = storageUtil.local.get(storageUtil.KEYS.USER)
            if(!user){
                alert('请先登陆')
                window.location = '#/login'
                return
            }
            //    读取session中保存的订单地址，如果有则显示
            let address = storageUtil.session.get(storageUtil.KEYS.ORDER_ADDR)
            if(address){
                $scope.address = address
            }else{
                // 如果没有
                // 根据用户id发送ajax请求, 得到默认地址, 如果有显示, 如果没有, 提示跳转添加
                serverService.getNewestAddress(user._id)
                    .then(address => {
                        if(!address){
                            alert('没有地址，请先添加')
                            window.location = '#/addNewAddr'
                        }else{
                            $scope.address = address
                        }
                    })
            }

        //去选择地址
            $scope.toSelectAddr = function () {
               window.location = '#/addrManage'
            }

            initTimes()
            /**
             * 初始化一个用于显示下单下拉列表的time数组
             */
            function initTimes() {
                const times = []
                const date = new Date()
            //    定义送餐开始时间
                let startTime = date.getTime()
            //    添加第一个time
                times.push({
                //预计一小时送达
                   value:$filter('date')(new Date(startTime+60*60*1000), 'yyyy-MM-dd HH:mm'),
                    text:'立即配送'
                })
                //定义送餐结束时间 最晚八点
                let endTime = new Date($filter('date')(date, 'yyyy-MM-dd')+ ' 20:00').getTime()
                const intervalTime = 15*60*1000  //间隔时间
            //    循环添加其他time
              /*  console.log(startTime + ','+ endTime);
                console.log(date);*/
                while(startTime<endTime){
                    // console.log('------');
                    startTime += intervalTime //每次加上间隔时间
                    if(startTime>endTime){
                        break
                    }
                    //    加入数组
                    times.push({
                        value:$filter('date')(new Date(startTime+60*60*1000), 'yyyy-MM-dd HH:mm'),
                        text:$filter('date')(new Date(startTime), 'HH:mm')
                    })
                }
                $scope.times = times
            }
        //    显示购物车的相关数据
            $scope.cart = storageUtil.session.get(storageUtil.KEYS.CART)
        //        下单
        //     $scope.order = {}
            $scope.submit = function () {

                /*
                 "user_id": "576bbe0aa1d183c42c06c08e",

                 "contactor": "张晓飞",
                 "address": "龙隆昌科技楼",
                 "phone": "13716962779",
                 "doorplate": "3层301",

                 "total_money": 56,
                 "peisongfei": 0,

                 "remark": "加一份米饭",
                 "arrive_time": "2016-6-23 20:14",
                 */
                $scope.order.user_id = user._id

                $scope.order.contactor = $scope.address.contactor
                $scope.order.address = $scope.address.address
                $scope.order.phone = $scope.address.phone
                $scope.order.doorplate = $scope.address.doorplate

                $scope.order.total_money = $scope.cart.totalPrice
                $scope.order.peisongfei = $scope.cart.songcanfei

                $scope.order.detail = JSON.stringify({
                    data: {
                        rstId: $scope.cart.rstId,
                        money: $scope.order.total_money + $scope.order.peisongfei,
                        meals: $scope.cart.meals
                    }
                })
                //提交ajax
                serverService.makeOrder($scope.order)
                    .then(order => {
                        storageUtil.session.remove(storageUtil.KEYS.CART)
                        storageUtil.session.remove(storageUtil.KEYS.ORDER_ADDR)
                        alert('下单成功')
                        window.location = 'order/detail?id='+order._id
                    })
            }
        }])
})