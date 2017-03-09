/**
 * 定义新增收货地址
 */
define(['app', 'storageUtil'], function (app, storageUtil) {
    return app.controller('AddNewAddrCtrl', ['$scope', '$rootScope', 'serverService',
        function ($scope, $rootScope, serverService) {
            //判断是添加还是修改  根据保存的地址判断
            let editAddr = storageUtil.session.get(storageUtil.KEYS.EDIT_ADDR)
            if(editAddr === null){//添加
                $rootScope.appTitle = '新增地址'
                //通过userId知道给谁添加
                const user = storageUtil.local.get(storageUtil.KEYS.USER)
                $scope.address = {
                    userId: user._id
                }
                $scope.btnText = '保存'
            }else{  //修改
                $rootScope.appTitle = '修改地址'
            //    把保存的地址显示在页面
                $scope.address = editAddr
                $scope.btnText = '修改'
            }
        //    读取session中input_addr
            let inputAddr = storageUtil.session.get(storageUtil.KEYS.INPUT_ADDR)
            if(inputAddr) {
                $scope.address = inputAddr
        //        移除
                storageUtil.session.remove(storageUtil.KEYS.INPUT_ADDR)
        }

        //    读取session中map_addr
            let mapAddr = storageUtil.session.get(storageUtil.KEYS.MAP_ADDR)
            if(mapAddr){
                $scope.address.address = mapAddr.name
                $scope.address.lng = mapAddr.lng
                $scope.address.lat = mapAddr.lat

            //    移除
                storageUtil.session.remove(storageUtil.KEYS.MAP_ADDR)
            }

        //    提交
            $scope.submit = function () {
                if(editAddr === null){//添加
                    serverService.addAddr($scope.address)
                        .then((address) => {
                            alert('添加成功')
                            window.location = '#/addrManage'
                        })
                }else{ //修改
                    serverService.updateAddr($scope.address)
                        .then(() => {
                            alert('修改成功')
                            window.location = '#/addrManage'
                        })
                }
            }

        //    设置性别
            $scope.setSex = function (sex) {
                $scope.address.sex = sex
            }

        //    去地图选择地址
            $scope.toChooseAddr = function () {
                /*$scope.address.lat = 39.99565448448077
                $scope.address.lng = 116.32219131497217
                $scope.address.cityId = 113
                $scope.address.address = "品牌创新研究所222"*/
                //保存当前的address
                storageUtil.session.set(storageUtil.KEYS.INPUT_ADDR, $scope.address)

                window.location = '#/chooseCoordinate'
            }
        }])
})