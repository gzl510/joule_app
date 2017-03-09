/**
 * 选择所在坐标
 */
define(['app', 'storageUtil'], function (app, storageUtil) {
    return app.controller('ChooseCoordinateCtrl', ['$scope', '$rootScope','mapService',
        function ($scope, $rootScope, mapService) {
            //设置首页title
            $rootScope.appTitle = '地图所在地址'
        //    得到保存的定位地址
            let address = storageUtil.session.get(storageUtil.KEYS.LOC_ADDR)
            let lng = address.lng
            let lat = address.lat
        //    读取保存的输入的地址
            address = storageUtil.session.get(storageUtil.KEYS.INPUT_ADDR)
            if(address){
                lng = address.lng,
                lat = address.lat
            }

            var map
        //    显示地图
            mapService.loadJScript('cc', 'showMap')
            window.showMap = function () {
                map = new BMap.Map("cc_map");            // 创建Map实例
                var point = new BMap.Point(lng, lat); // 创建点坐标
                map.centerAndZoom(point,15);
                
                showAddrList()
            //    添加地图监听
                map.addEventListener('zoomend', handleEvent) //缩放结束
                map.addEventListener('dragend', handleEvent) //拖拽结束
            }
            //拖拽地图松开后显示坐标
            function handleEvent() {
                const point = map.getCenter()
                lng = point.lng
                lat = point.lat
                showAddrList()
            }

            //附近地址列表
            function showAddrList() {
            //    得到地址列表
                mapService.getAroundAddrs(lng, lat)
                    .then(addrs => {
                       $scope.addrs = addrs
                    })
            }

            $scope.selectAddr = function (addr) {
            //    保存addr
                storageUtil.session.set(storageUtil.KEYS.MAP_ADDR, addr)
                window.location = '#/addNewAddr'
            }

            $scope.search = function () {
                const searchName = $scope.searchName
                mapService.getPointByAddr(searchName)
                    .then(point => {
                        map.centerAndZoom(point,15);
                        lng = point.lng
                        lat = point.lat
                        showAddrList()
                    })
            }
        }])
})