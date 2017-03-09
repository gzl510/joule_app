/**
 * 向后台发送ajax请求的Service模块
 */
define(['app'], function (app) {
    return app.factory('serverService', ['$http', '$q', function ($http, $q) {
        /**
         * 发送验证码
         * @param phone
         *
         */
        function sendCode(phone) {
            const defer = $q.defer()
            $http.get('/sendcode?phone='+phone)
                .success(function (result) {
                    //调用成功的回调
                    defer.resolve(result)
                })
            return defer.promise
        }

        /**
         * 处理登录
         * @param user
         * @returns {Promise}
         */
        function login(user) {
            const defer = $q.defer()
            $http({
                method:'POST',
                url:'/login',
                // data : 'phone='+user.phone+'&code='+user.code,
                data: user  //如果不是跨域请求, 才可以
                // headers :  {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (result) {
                    //调用成功的回调
                    defer.resolve(result)
                })
                .error(function () {
                    alert('登陆请求异常')
                })
            return defer.promise
        }

        /**
         * 提交意见反馈
         * @param feedback
         * @returns {Promise}
         */
        function feedback(feedback) {
            const defer = $q.defer()
            $http({
                method:'GET',
                url:'/feedback',
                //data数据为feedback,控制器定义
                params:{data:feedback}
            })
                .success(function (result) {
                    //调用成功的回调
                    defer.resolve(result)
                })
                .error(function () {
                    alert('提交意见反馈异常')
                })
            return defer.promise
        }

        /**
         * 根据用户id得到用户地址数组
         * @param userId
         * @returns {Promise}
         */
        function getAddrsByUserId (userId) {
            const defer = $q.defer()
            $http.get(`/getAddrsByUserId?userId=${userId}`)
                .success((result) => {
                    defer.resolve(result.data)
                })
                .error(() => {
                    alert('获取地址列表失败')
                })
            return defer.promise
        }

        /**
         * 根据id删除对应地址
         * @param id
         * @returns {Promise}
         */
        function deleteAddr (id) {
            const defer = $q.defer()
            $http.get(`/deleteAddr?_id=${id}`)
                .success((result) => {
                    defer.resolve()
                })
                .error(() => {
                    alert('删除地址失败')
                })
            return defer.promise
        }

        /**
         * 添加地址
         * @param address
         * @returns {Promise}
         */
        function addAddr (address) {
            const defer = $q.defer()
            $http({
                method:'GET',
                url:'/insertAddr',
                params:{address}
            })
                .success((result) => {
                    defer.resolve(result.data)
                })
                .error(() => {
                    alert('保存地址失败')
                })
            return defer.promise
        }

        /**
         * 修改地址
         * @param address
         * @returns {Promise}
         */
        function updateAddr(address) {
            const defer = $q.defer()
            $http({
                method:'GET',
                url:'/updateAddr',
                params:{address}
            })
                .success((result) => {
                    defer.resolve()
                })
                .error(() => {
                    alert('修改地址失败')
                })
            return defer.promise
        }

        /**
         * 获取轮播图数组
         * @returns {Promise}
         */
        function getBanners() {
            const defer = $q.defer()
            $http.get('/index/banners')
                .success((result) => {
                    defer.resolve(result.data)
                })
                .error(() => {
                    alert('获取轮播图数据失败')
                })
            return defer.promise
        }

        /**
         * 获取首页meals/restaurant/address
         * @returns {Promise}
         */
        function getDate() {
            const defer = $q.defer()
            $http.get('/index/data')
                .success((result) => {
                    defer.resolve(result.data)
                })
                .error(() => {
                    alert('获取菜品相关数据失败')
                })
            return defer.promise
        }

        /**
         * 查询指定用户的默认地址
         * @param userId
         * @returns {Promise|*}
         */
        function getNewestAddress(userId) {
            const defer = $q.defer()
            $http.get('/order/getNewestAddress?userId=' + userId)
                .success((result) => {
                    if(result.code === 1){
                        defer.resolve()
                    }else{
                        defer.resolve(result.data)
                    }
                })
                .error(() => {
                    alert('获取地址数据失败')
                })
            return defer.promise
        }

        /**
         * 下单
         * @param order
         */
        function makeOrder(order) {
            const defer = $q.defer()
            $http({
                method:'POST',
                url:'/order/createOrder',
                data:{order}
            })
                .success((result) => {
                    defer.resolve(result.data)
                })
                .error(() => {
                    alert('下单失败')
                })
            return defer.promise
        }
        return {sendCode, login, feedback, getAddrsByUserId, deleteAddr, addAddr, updateAddr,
            getBanners, getDate, getNewestAddress, makeOrder}
    }])
})