/**
 * 处理地图相关请求的服务模块
 */

define(['app'], function (app) {
    return app.factory('mapService', ['$q', '$http', function ($q, $http) {
        /**
         * 加载百度接口APIjs
         * @param containerId
         * @param callback
         */
        function loadJScript(containerId, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://api.map.baidu.com/api?v=2.0&ak=ToEGZfMGaSbwR5hA6hn6FrYOrm50km0m&callback="+callback;
            document.getElementById(containerId).appendChild(script)
        }

        /**
         * 得到当前地址
         * @returns {Promise|*}
         */
        function getCurrentAddr() {
            const defer = $q.defer()
            var geolocation = new BMap.Geolocation();
            //异步得到当前位置
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    // alert('您的位置：'+r.point.lng+','+r.point.lat)
                    //根据经纬度得到对应的位置
                    var geoc = new BMap.Geocoder();
                    geoc.getLocation(r.point, function(rs){
                        const addComp = rs.addressComponents;
                        alert(addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber);
                        defer.resolve({
                            "name":addComp.city + addComp.district + addComp.street + addComp.streetNumber,
                            "lat":r.point.lat,
                            "lng":r.point.lng
                        })
                    })
                }
                else{
                    alert('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true})
            return defer.promise
        }

        /**
         * 得到周边地址
         * @param lng
         * @param lat
         */
        function getAroundAddrs(lng, lat) {
            const defer = $q.defer()
            const url = 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location='
                +lat+','+lng+'&output=json&pois=1&ak=ONuEmWCnBnw7LA8u552jXyY6F6OGhmd8&callback=JSON_CALLBACK'
            $http.jsonp(url)
                .success((data) => {
                    console.log(data);
                    const pois = data.result.pois
                    //根据pois数组生成地址对象数组
                    const addrs = pois.map((item, index) => {
                        return {  //address对象
                           name: item.name,
                           lng:item.point.x,
                           lat:item.point.y
                        }
                    })
                    defer.resolve(addrs)
                })
                .error(() => {
                    alert('获取周边位置失败')
                })


            return defer.promise
        }

        /**
         * 根据地址获取坐标点对象
         * @param name
         */
        function getPointByAddr(name) {
            const defer = $q.defer()
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(name, function(point){
                if (point) {
                    defer.resolve(point)
                }else{
                    alert("您选择地址没有解析到结果!");
                }
            }, "北京市");
            return defer.promise
        }
        return { loadJScript, getCurrentAddr, getAroundAddrs, getPointByAddr }
    }])
})
