/**
* 浏览器端数据存储的工具模块
* sessionStorage存储
* localStorage存储
* 形式: key=value
 */
define(function () {
    return {
        KEYS:{
            USER:'_user_',
            EDIT_ADDR:'_edit_addr_', //修改
            CART:'_cart_',
            LOC_ADDR:'_loc_addr_', //定位
            INPUT_ADDR:'_input_addr_', //输入
            ORDER_ADDR:'_order_addr_' //下单
        },
        session:{
            //保存
            set(key, value) {
                //对数组对象先转换为json
                if(typeof value === 'object'){
                    value = JSON.stringify(value)
                }
                sessionStorage.setItem(key, value)
            },
            //读取
            get(key){
                let value = sessionStorage.getItem(key)
                //如果value是json对象/数组,需要先解析
                if(value !== null && (value.indexOf('{')===0 || value.indexOf('[')===0)){
                    value = JSON.parse(value)
                }
                return value
            },
            //删除
            remove(key){
                sessionStorage.removeItem(key)
            }
        },
        local:{
            //保存
            set(key, value) {
                //对数组对象先转换为json
                if(typeof value === 'object'){
                    value = JSON.stringify(value)
                }
                localStorage.setItem(key, value)
            },
            //读取
            get(key){
                let value = localStorage.getItem(key)
                //如果value是json对象/数组,需要先解析
                if(value !== null && (value.indexOf('{')===0 || value.indexOf('[')===0)){
                    value = JSON.parse(value)
                }
                return value
            },
            //删除
            remove(key){
                localStorage.removeItem(key)
            }
        }
    }
})