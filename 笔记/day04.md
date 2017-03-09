## 今日任务
1. 地址模块的前台页面功能
2. 展示首页数据
3. 首页的购物车功能
4. 购物车操作动画

## 详情
1. 地址的页面功能	
  * addrManage.html
    * 地址的列表展示 : userId
    * 进入地址修改页面 : 将当前要修改的地址信息对象保存到session
    * 地址的删除 : id
  * addNewAddr.html
    * 地址添加
    * 地址修改
    * 区别是添加还是修改: session中有没有edit_addr
  * angular的一些指令: ng-repeat / ng-model /ng-click / ng-class /ng-disabled
  * 使用$http提交ajax请求进行操作/更新界面
2. 首页的菜品列表
    * 通过serverService获取菜品列表数据
    * 通过页面指令显示列表数据
    * 通过ng-class来控制显示样式
3. 购物车功能
  * 设计购物车cart对象的结构
    ```
    {
      meals : [],
      totalCount : 2
      totalPrice : 100
      songcanfei : 5
      rstId: 'xxx'
    }
    ```
	* cart的CRUD操作
    * 初始化时读取session的cart, 放到scope中显示到页面
		* 当点击页面中的+/-, 更新cart, 保存到session
		* 删除item: 当数量为0时
4. 购物车动画效果
    * 克隆出一个发生事件的<a>, 指定内容1, 指定样式, 添加到<body>
    * 计算出当前的起始坐标(根据<a>): startLeft, startTop, 并设置上
    * 计算目录位置的坐标(id为total_count的div): endLeft, endTop
    * 移动动画
        * 总移动量: moveX/moveY
        * 持续时间: totalTime = 500;
        * 移动次数: moveCount = 50
        * 单元移动的间隔时间: totalTime/moveCount
        * 计算出每小的移动的距离: 
            moveX = (endLeft-startLeft) / moveCount
            moveY = (endTop-startTop) / moveCount
        * 启动循环定时器
            * 更新startLeft/startTop
            * 设置给<a>
            * 判断是否已经到达目标处, 如果到达了, 停止定时器