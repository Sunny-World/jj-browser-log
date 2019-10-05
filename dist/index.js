var jjLoger = {
    options: null,
    output: '',
    depth: 0,
    parentSizes: '',
    currentResult: '',
    startTime: '',
    isLoad: false,
    isLines: false,
    // 初始化
    init: function (options) {
        this.options = {
            isConsole: true,
            useTimestamps: true,
            useLocalStorage: true,
            recordLogs: true,
            autoTrim: true,
            maxLines: 2500,
            tailNumLines: 100,
            logFilename: 'debugout.txt',
            maxDepth: 25,
        };
        if (options) {
            this.options = Object.assign(this.options, options);
        }
        this.depth = 0;
        this.parentSizes = [0];
        this.currentResult = '';
        this.startTime = new Date();
        this.output = '';
        if (this.options.useLocalStorage) {
            var saved = window.localStorage.getItem('jjLog.js');
            if (saved) {
                saved = JSON.parse(saved);
                this.output = saved.log;
                var start = new Date(saved.startTime);
                var end = new Date(saved.lastLog);
                this.output += '\n---- Session end: ' + end + ' ----\n';
                this.output += this.formatSessionDuration(start, end);
                this.output += '\n\n';
            }
        }
        this.output += '---- Session started: ' + this.startTime + ' ----\n\n';
        if (this.isLines) {
            this.lines();
        }
        this.isLoad = true;
    },
    // 获取日志
    getLog: function () {
        var retrievalTime = new Date();
        // if recording is off, so dev knows why they don't have any logs
        if (!this.options.recordLogs) {
            this.log('[jjLog.js] log recording is off.');
        }
        // if using local storage, get values
        if (this.options.useLocalStorage) {
            var saved = window.localStorage.getItem('jjLog.js');
            if (saved) {
                saved = JSON.parse(saved);
                this.startTime = new Date(saved.startTime);
                this.output = saved.log;
                retrievalTime = new Date(saved.lastLog);
            }
        }
        return (this.output +
            '\n---- Log retrieved: ' +
            retrievalTime +
            ' ----\n' +
            this.formatSessionDuration(this.startTime, retrievalTime));
    },
    //获取指定行数日志
    tail: function (numLines) {
        var Lines = numLines || this.options.tailNumLines;
        return this.trimLog(this.getLog(), Lines);
    },
    // 搜索指定日志
    search: function (str) {
        var lines = this.output.split('\n');
        var rgx = new RegExp(str);
        var matched = [];
        // can't use a simple Array.prototype.filter() here
        // because we need to add the line number
        for (var i = 0; i < lines.length; i++) {
            var addr = '[' + i + '] ';
            if (lines[i].match(rgx)) {
                matched.push(addr + lines[i]);
            }
        }
        var result = matched.join('\n');
        if (result.length == 0)
            result = 'Nothing found for "' + str + '".';
        return result;
    },
    //获取指定行数的日志
    getSlice: function (lineNumber, numLines) {
        var lines = this.output.split('\n');
        var segment = lines.slice(lineNumber, lineNumber + numLines);
        return segment.join('\n');
    },
    //下载日志
    downLog: function (fileName) {
        var logFile = this.getLog();
        var blob = new Blob([logFile], { type: 'data:text/plain;charset=utf-8' });
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.target = '_blank';
        a.download = fileName || this.options.logFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
    },
    //清除日志
    clear: function () {
        var clearTime = new Date();
        this.output = '---- Log cleared: ' + clearTime + ' ----\n';
        var saveObject;
        if (this.options.useLocalStorage) {
            // local storage
            saveObject = {
                startTime: this.startTime,
                log: this.output,
                lastLog: clearTime,
            };
            saveObject = JSON.stringify(saveObject);
            window.localStorage.setItem('jjLog.js', saveObject);
        }
        if (this.options.isConsole)
            console.log('jjLog.js] clear()');
    },
    // 保存日志
    save: function (obj) {
        // log in real time
        var str = '';
        // record log
        var type = this.determineType(obj);
        if (type != null && this.options.recordLogs) {
            var addition = this.formatType(type, obj);
            // timestamp, formatted for brevity
            if (this.options.useTimestamps) {
                var logTime = new Date();
                this.output += this.formatTimestamp(logTime);
                str += this.formatTimestamp(logTime);
            }
            //   if(Type==='log'){
            //       addition="--"+addition
            //   }else if(Type==='warn'){
            //     addition="--"+addition
            //   }else if(Type==='error'){
            //     addition="--"+addition
            //   }
            this.output += addition + '\n';
            str += addition + '\n';
            if (this.options.autoTrim)
                this.output = this.trimLog(this.output, this.options.maxLines);
            // local storage
            var saveObject = void 0;
            if (this.options.useLocalStorage) {
                var last = new Date();
                saveObject = {
                    startTime: this.startTime,
                    log: this.output,
                    lastLog: last,
                };
                saveObject = JSON.stringify(saveObject);
                window.localStorage.setItem('jjLog.js', saveObject);
            }
        }
        this.depth = 0;
        this.parentSizes = [0];
        this.currentResult = '';
        return str;
    },
    log: function (obj) {
        var str = this.save(obj);
        if (this.options.isConsole)
            console.log('✅%c' + str, 'color:green;');
    },
    warn: function (obj) {
        var str = this.save(obj);
        if (this.options.isConsole)
            console.log('☢%c' + str, 'color:#ef8d14;');
    },
    error: function (obj) {
        var str = this.save(obj);
        if (this.options.isConsole)
            console.log('❌%c' + str, 'color:red;');
    },
    // 确定日志存储对象类型
    determineType: function (object) {
        if (object !== null) {
            var typeResult = void 0;
            var type = typeof object;
            if (type === 'object') {
                var len = object.length;
                if (!len) {
                    if (typeof object.getTime === 'function') {
                        typeResult = 'Date';
                    }
                    else if (typeof object.test === 'function') {
                        typeResult = 'RegExp';
                    }
                    else {
                        typeResult = 'Object';
                    }
                }
                else {
                    typeResult = 'Array';
                }
            }
            else {
                typeResult = type;
            }
            return typeResult;
        }
        else {
            return null;
        }
    },
    // 格式化日志
    formatType: function (type, obj) {
        if (this.options.maxDepth && this.depth >= this.options.maxDepth) {
            return '... (max-depth reached)';
        }
        switch (type) {
            case 'Object':
                this.currentResult += '{\n';
                this.depth++;
                this.parentSizes.push(this.objectSize(obj));
                var i = 0;
                for (var prop in obj) {
                    this.currentResult += this.indentsForDepth(this.depth);
                    this.currentResult += prop + ': ';
                    var subtype = this.determineType(obj[prop]);
                    var subresult = this.formatType(subtype, obj[prop]);
                    if (subresult) {
                        this.currentResult += subresult;
                        if (i != this.parentSizes[this.depth] - 1)
                            this.currentResult += ',';
                        this.currentResult += '\n';
                    }
                    else {
                        if (i != this.parentSizes[this.depth] - 1)
                            this.currentResult += ',';
                        this.currentResult += '\n';
                    }
                    i++;
                }
                this.depth--;
                this.parentSizes.pop();
                this.currentResult += this.indentsForDepth(this.depth);
                this.currentResult += '}';
                if (this.depth == 0)
                    return this.currentResult;
                break;
            case 'Array':
                this.currentResult += '[';
                this.depth++;
                this.parentSizes.push(obj.length);
                for (var i_1 = 0; i_1 < obj.length; i_1++) {
                    var subtype = this.determineType(obj[i_1]);
                    if (subtype == 'Object' || subtype == 'Array')
                        this.currentResult += '\n' + this.indentsForDepth(this.depth);
                    var subresult = this.formatType(subtype, obj[i_1]);
                    if (subresult) {
                        this.currentResult += subresult;
                        if (i_1 != this.parentSizes[this.depth] - 1)
                            this.currentResult += ', ';
                        if (subtype == 'Array')
                            this.currentResult += '\n';
                    }
                    else {
                        if (i_1 != this.parentSizes[this.depth] - 1)
                            this.currentResult += ', ';
                        if (subtype != 'Object')
                            this.currentResult += '\n';
                        else if (i_1 == this.parentSizes[this.depth] - 1)
                            this.currentResult += '\n';
                    }
                }
                this.depth--;
                this.parentSizes.pop();
                this.currentResult += ']';
                if (this.depth == 0)
                    return this.currentResult;
                break;
            case 'function':
                obj += '';
                var lines = obj.split('\n');
                for (var i_2 = 0; i_2 < lines.length; i_2++) {
                    if (lines[i_2].match(/\}/))
                        this.depth--;
                    this.currentResult += this.indentsForDepth(this.depth);
                    if (lines[i_2].match(/\{/))
                        this.depth++;
                    this.currentResult += lines[i_2] + '\n';
                }
                return this.currentResult;
                break;
            case 'RegExp':
                return '/' + obj.source + '/';
                break;
            case 'Date':
            case 'string':
                if (this.depth > 0 || obj.length == 0) {
                    return '"' + obj + '"';
                }
                else {
                    return obj;
                }
            case 'boolean':
                if (obj)
                    return 'true';
                else
                    return 'false';
            case 'number':
                return obj + '';
                break;
        }
    },
    // 计算持续时间
    formatSessionDuration: function (startTime, endTime) {
        var msec = endTime - startTime;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        var hrs = ('0' + hh).slice(-2);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        var mins = ('0' + mm).slice(-2);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        var secs = ('0' + ss).slice(-2);
        msec -= ss * 1000;
        return '---- Session duration: ' + hrs + ':' + mins + ':' + secs + ' ----';
    },
    // 截取日志
    trimLog: function (log, maxLines) {
        var lines = log.split('\n');
        if (lines.length > maxLines) {
            lines = lines.slice(lines.length - maxLines);
        }
        return lines.join('\n');
    },
    //获取日志行数
    lines: function () {
        if (this.isLoad) {
            return this.output.split('\n').length;
        }
        else {
            this.isLines = true;
        }
    },
    // 格式化时间
    formatTimestamp: function (timestamp) {
        var year = timestamp.getFullYear();
        var date = timestamp.getDate();
        var month = ('0' + (timestamp.getMonth() + 1)).slice(-2);
        var hrs = Number(timestamp.getHours());
        var mins = ('0' + timestamp.getMinutes()).slice(-2);
        var secs = ('0' + timestamp.getSeconds()).slice(-2);
        return ('[' +
            year +
            '-' +
            month +
            '-' +
            date +
            ' ' +
            hrs +
            ':' +
            mins +
            ':' +
            secs +
            ']: ');
    },
    // 获取对象属性
    objectSize: function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key))
                size++;
        }
        return size;
    },
    // 递归缩进
    indentsForDepth: function (depth) {
        var str = '';
        for (var i = 0; i < depth; i++) {
            str += '\t'; // 跳一个tab
        }
        return str;
    },
    // 性能输出日志
    performanceTest: function () {
        var timing = performance.timing, readyStart = timing.fetchStart - timing.navigationStart, redirectTime = timing.redirectEnd - timing.redirectStart, appcacheTime = timing.domainLookupStart - timing.fetchStart, unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart, lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart, connectTime = timing.connectEnd - timing.connectStart, requestTime = timing.responseEnd - timing.requestStart, initDomTreeTime = timing.domInteractive - timing.responseEnd, domReadyTime = timing.domComplete - timing.domInteractive, loadEventTime = timing.loadEventEnd - timing.loadEventStart, loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log('准备新页面时间耗时：' + readyStart);
        console.log('redirect 重定向耗时：' + redirectTime);
        console.log('Appcache 耗时' + appcacheTime);
        console.log('unload 前文档耗时：' + unloadEventTime);
        console.log('DNS 查询耗时：' + lookupDomainTime);
        console.log('TCP 连接耗时：' + connectTime);
        console.log('request 请求耗时：' + requestTime);
        console.log('请求完毕至DOM加载：' + initDomTreeTime);
        console.log('解析DOM树耗时：' + domReadyTime);
        console.log('Load事件耗时：' + loadEventTime);
        console.log('加载时间耗时：' + loadTime);
    },
};
// export default new jjLog();
// window.jjLog=new jjLog
export default jjLoger;
export var jjLog = jjLoger;
