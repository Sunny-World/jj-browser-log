# jjLog（浏览器环境）
- jjLog---前端日志保存方案

[TOC]

- 引用库
    ```js
    import jjLog from 'jjLog'
    ```
- html直接引用
    ```html
    <script src="jjLog/common/$fn.js"></script>
    ```
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO 
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### 初始化
```js
jjLog.init({
      isConsole: true, // 是否在保存时实时转发
      useTimestamps: true, // 每条日志前面是否插入时间戳
      useLocalStorage: true, //是否使用localstorage保存, 是否使用localstorage存储
      recordLogs: true, // 是否开启保存日志模式，调试完成后设置为false以避免日志占用内存
      autoTrim: true, //自动获取指定行数的日志， 避免日志占用潜在的无限内存
      maxLines: 2500, //保存最大行数， 如果autotrim为true，则保存指定行数
      tailNumLines: 100, // 检索行数
      logFilename: 'debugout.txt', // 下载时的默认文件名
      maxDepth: 25, // 日志对象最大递归深度
})
```
### 保存日志
####直接保存
```js
jjLog.save(obj)
````
####输出成功日志
```js
jjLog.log(obj)
```
####输出警告日志
```js
jjLog.warn(obj)
```
####输出错误日志
```js
jjLog.error(obj)
```
###获取日志当前行数
```js
jjLog.lines()
```
###获取全部日志内容
```js
jjLog.getLog()
```
###清空日志
```js
jjLog.clear()
```
