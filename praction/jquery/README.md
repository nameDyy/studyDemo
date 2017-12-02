# jquery源码分析
## 立即执行函数
为什么使用立即执行函数
## 无New式对象构建
1. 在Jquery方法内部封装一个new init
2. 把init方法放在Jquery函数的原型上
3. 把init方法的原型与Jquery方法的原型统一
## 类数组对象结构
## 链式调用
## 插件接口设计