# jjLog（浏览器环境）
- jjLog---前端日志保存方案

[toc]

- 引用库
    ```js
    import jjLog from 'jj-browser-log'
    ```
- html直接引用
    ```html
    <script src="./common/$fn.js"></script>
    ```
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

- [初始化](#%E5%88%9D%E5%A7%8B%E5%8C%96)
- [保存日志](#%E4%BF%9D%E5%AD%98%E6%97%A5%E5%BF%97)
  - [直接保存](#%E7%9B%B4%E6%8E%A5%E4%BF%9D%E5%AD%98)
  - [输出成功日志](#%E8%BE%93%E5%87%BA%E6%88%90%E5%8A%9F%E6%97%A5%E5%BF%97)
  - [输出警告日志](#%E8%BE%93%E5%87%BA%E8%AD%A6%E5%91%8A%E6%97%A5%E5%BF%97)
  - [输出错误日志](#%E8%BE%93%E5%87%BA%E9%94%99%E8%AF%AF%E6%97%A5%E5%BF%97)
- [获取日志当前行数](#%E8%8E%B7%E5%8F%96%E6%97%A5%E5%BF%97%E5%BD%93%E5%89%8D%E8%A1%8C%E6%95%B0)
- [获取全部日志内容](#%E8%8E%B7%E5%8F%96%E5%85%A8%E9%83%A8%E6%97%A5%E5%BF%97%E5%86%85%E5%AE%B9)
- [清空日志](#%E6%B8%85%E7%A9%BA%E6%97%A5%E5%BF%97)

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
####  直接保存
```js
jjLog.save(obj)
```
#### 输出成功日志
```js
jjLog.log(obj)
```
#### 输出警告日志
```js
jjLog.warn(obj)
```
#### 输出错误日志
```js
jjLog.error(obj)
```
### 获取日志当前行数
```js
jjLog.lines()
```
### 获取全部日志内容
```js
jjLog.getLog()
```
### 清空日志
```js
jjLog.clear()
```
