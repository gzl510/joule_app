/**
 * 收货地址管理.
 */
define(['app', 'storageUtil'], function (app, storageUtil) {
    return app.controller('AddrManageCtrl', ['$scope', '$rootScope', 'serverService',
        function ($scope, $rootScope, serverService ) {
            //设置首页title
            $rootScope.appTitle = '地址管理'

        //    删除session中的edit_addr
            storageUtil.session.remove(storageUtil.KEYS.EDIT_ADDR)
        //1.显示地址列表
        //    得到保存的用户
            let user = storageUtil.local.get(storageUtil.KEYS.USER)
        //    根据用户id发送Ajax请求，得到对应的地址列表并显示
            serverService.getAddrsByUserId(user._id)//返回的是promise对象
                .then((addrs) => {
                    $scope.addrs = addrs
                })

        //    2.删除地址
            $scope.deleteAddr = function (index) {
                const addr = $scope.addrs[index]
                if(confirm(`确认删除${addr.contactor}吗?`)){
                //    发送Ajax请求， 删除数据库中对应的数据
                    serverService.deleteAddr(addr._id)
                        .then(() => {
                            //更新页面
                            alert('删除成功')
                            $scope.addrs.splice(index, 1)
                        })
                }
            }
        //    3.进入添加页面
            $scope.toAddUI = function () {
                window.location = '#/addNewAddr'
            }

        //    4，进入修改页面
            $scope.toEditUI = function (addr) {
                //点修改需把地址带过去，所以需保存，保存addr到sessionStorage
                storageUtil.session.set(storageUtil.KEYS.EDIT_ADDR, addr)
                window.location = '#/addNewAddr'
            }

        //    选择地址
            $scope.selectAddr = function (addr) {
            //    保存
                storageUtil.session.set(storageUtil.KEYS.ORDER_ADDR, addr)
            //    跳转
                window.location = '#/orderConfirm'
            }
        }])
})