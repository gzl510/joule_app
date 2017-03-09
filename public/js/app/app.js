/**
 * /**
 * angular应用module模块
 * 1. 指定应用模块名(启动时需对应)
 * 2. 引入用于路由和验证的2个angular模块
 */
define(['angular'], function (angular) {
    return angular.module('jouleApp', ['ngRoute', 'ngMessages'])
})
