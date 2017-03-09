/**
 * 定义首页控制器
 */
define(['app', 'Swiper', 'storageUtil'], function (app, Swiper, storageUtil) {
    return app.controller('HomeCtrl', ['$scope', '$rootScope', 'serverService', '$timeout', 'mapService',
        function ($scope, $rootScope, serverService, $timeout, mapService) {
        //设置首页title
            $rootScope.appTitle = '首页'
    //        初始化购物车
            initCart()

    //        发送请求  获取banners
            serverService.getBanners()
                .then((banners) => {
                    $scope.banners = banners
                    setTimeout(() => { //必须延迟执行  因为是异步加载   需进行脏数据检查  完之后才会起效果
                        new Swiper('#bannerSwiper', {
                            //分页器
                            pagination:'.swiper-pagination',
                            //循环
                            loop:true,
                        //    自动切换间隔
                            autoplay:3000,
                        //用户操作后是否禁止自动切换
                            autoplayDisableOnInteraction:false,
                        //    切换效果  立体
                            effect : 'cube',
                            cube:{
                                shadow:false //去除阴影
                            }
                        })
                    }, 20)
                })
            // 发送请求  获取meals/restaurant/address
            serverService.getDate()
                .then((data) => {
                    $scope.data = data
                //    保存商家id和送餐费
                    $scope.cart.songcanfei = data.restaurant.songcanfei
                    $scope.cart.rstId = data.restaurant._id

                //    更新data中的meals
                    updateDmeals()

                    //    保存定位的地址
                    storageUtil.session.set(storageUtil.KEYS.LOC_ADDR, $scope.data.address)
                //    定位当前位置
                    getCurrentAddr()
                })
            //更新购物车数量
            let intervalId = null
            $scope.updateCount = function(isAdd, meal, event){
                //动画正在进行中  点击没效果
                if(intervalId){
                    return
                }
                /*
                 1. 根据点击事件的<a>来克隆出一个新的<a>(flyA), 并指定内容和样式, 添加到<body>
                 2. 得到起始的坐标startLeft, startTop(从事件的<a>中取出), 并指定给flyA
                 3. 得到目标位置的坐标endLeft, endTop(从id为total_count的id上取出)
                 4. 使用循环定时器实现移动动画
                 * 持续的总时间: totalTime = 500
                 * 总共移动多少个单元小移动: moveCount = 50
                 * 单元移动的间隔时间: intervalTime = totalTime/moveCount
                 * 每个单元移动的移动量:
                 moveX = (endLeft-startLeft) / moveCount
                 moveY = (endTop-startTop) / moveCount
                 * 在循环定时器中不断更新flyA的left和top
                 *
                 */
                // 1. 根据点击事件的<a>来克隆出一个新的<a>(flyA), 并指定内容和样式, 添加到<body>
                const $a = angular.element(event.target)
                const $flyA = $a.clone().html(1).addClass('jia-fly')
                angular.element(document.body).append($flyA)
                // 2. 得到起始的坐标startLeft, startTop(从事件的<a>中取出), 并指定给flyA
                let startLeft = $a[0].getBoundingClientRect().left
                let startTop = $a[0].getBoundingClientRect().top
                $flyA.css({
                    left:startLeft + 'px',
                    top:startTop + 'px'
                })
                // 3. 得到目标位置的坐标endLeft, endTop(从id为total_count的id上取出)
                const totalDiv = document.getElementById('total_count')
                const endLeft = totalDiv.getBoundingClientRect().left
                const endTop = totalDiv.getBoundingClientRect().top
                // 4. 使用循环定时器实现移动动画
                //     * 持续的总时间:
                const totalTime = 500
                // * 总共移动多少个单元小移动:
                const moveCount = 50
                // * 单元移动的间隔时间:
                const intervalTime = totalTime/moveCount
                // * 每个单元移动的移动量:
                const moveX = (endLeft-startLeft) / moveCount
                const moveY = (endTop-startTop) / moveCount
                 //启动定时器
                intervalId = setInterval(() => {
                    startLeft += moveX
                    startTop += moveY
                //    判断是否已经到达目标位置
                    if(startLeft <= endLeft){
                        startLeft = endLeft
                        startTop = endTop
                    //    停止定时器
                        clearInterval(intervalId)
                        intervalId = null
                    //    移除flyA
                        $flyA.remove()
                    }
                    $flyA.css({
                        left:startLeft + 'px',
                        top:startTop + 'px'
                    })
                }, intervalTime)

                $timeout(() => {
                    const dMeals = $scope.data.meals //data中的meals
                    const cMeals = $scope.cart.meals //cart中的meals
                    if(isAdd){
                        if(!meal.count){ //meal没有在cMeals中
                            meal.count = 1
                            cMeals.push(meal)//将meal添加到cMeals中（购物车）
                        }else{ //meal在cMeals中
                            meal.count ++ //只用更新数量
                        }
                        //    购物车的总数量
                        $scope.cart.totalCount ++
                        //     购物车的总价格
                        $scope.cart.totalPrice += meal.price
                    }else{
                        meal.count --
                        if(meal.count === 0){ //删除购物车中的此购物项
                            cMeals.splice(cMeals.indexOf(meal), 1)
                        }
                        //    购物车的总数量
                        $scope.cart.totalCount --
                        //当购物总数量为0时，购物车隐藏
                        if($scope.cart.totalCount === 0){
                            $scope.isOpen = false
                        }
                        //     购物车的总价格
                        $scope.cart.totalPrice -= meal.price
                    }
                    //     保存cart到sessionStorage
                    storageUtil.session.set(storageUtil.KEYS.CART, $scope.cart)
                }, totalTime+20)

            }

            $scope.isOpen = false
            $scope.showCart = function () {
                $scope.isOpen = !$scope.isOpen
            }


            /**
             * 初始化购物车
             */
            function initCart() {
                let cart = storageUtil.session.get(storageUtil.KEYS.CART)
                if(cart === null){
                    cart = {
                        meals : [],
                        totalCount : 0,
                        totalPrice : 0,
                        songcanfei : 0,
                        rstId: null
                    }
                }
                $scope.cart = cart
            }

            /**
             * 更新meals
             */
            function updateDmeals(){
                const dMeals = $scope.data.meals //data中的meals
                const cMeals = $scope.cart.meals //cart中的meals
                for (var i = 0; i < cMeals.length; i++) {
                    var cMeal = cMeals[i];
                //    根据cMeal的_id查找dMeal中对应的meal
                    for (var j = 0; j < dMeals.length; j++) {
                        var dMeal = dMeals[j];
                        if(cMeal._id == dMeal._id){
                            //将购物车中购物项的数量保存到data的meal中
                            dMeal.count = cMeal.count
                            //将data中的meal替换cart中原来的meal
                            cMeals[i] = dMeal
                            break
                        }

                    }
                }
            }
            //定位当前位置
            function getCurrentAddr() {
                //修改显示的地址名称
                $scope.data.address.name = '正在定位中...'
                //加载百度API的js
                mapService.loadJScript('home', 'showAddr')
                //获取当前地址显示
                window.showAddr = function () {
                    //得到当前的经纬度
                    mapService.getCurrentAddr()
                        .then(address => {
                            $scope.data.address = address
                        //    保存定位的地址
                            storageUtil.session.set(storageUtil.KEYS.LOC_ADDR, $scope.data.address)
                        })
                }
            }

    //        跳转到订单页面
            $scope.toOrderConfirm = function () {
                if($scope.cart.totalCount > 0){
                    window.location = '#/orderConfirm'
                }
            }
    }])
})