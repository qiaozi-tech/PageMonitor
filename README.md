# PageMonitor
> capture webpage and diff the dom change with [puppeteer](https://zhaoqize.github.io/puppeteer-api-zh_CN/)

## Class:Monitor 

* ### Monitor.capture
    - url {String} 字符串或数组
    - options {Object} puppeteer.page与puppeteer.screenshop配置，看官网设置  
    - return {Promise}  包含dom JSON与二进制图片

```javascript
    var Monitor = require('pageMonitor');
    
    var url = 'http://www.google.com';
    var monitor = new Monitor(MonitorOption);
    monitor.capture(url,pageOption).then(res=>{
        console.log(res)
        //{dom:[],screenshot:image}
    });

```
> #### MonitorOption  
> - launch {Object} puppeteer.launch官方配置文件
```javascript
    MonitorOption:{
        launch:{...}
    }
```

> #### pageOption  
>   - page {Object} puppeteer.page.goto官方设置
>   - screenshot {Object} puppeteer.page.screenshot官方设置
>   - settings 
>       + height {Number} 设置页面高度,height和width必须成对出现
>       + width {Number} 设置页面宽度，height和width必须成对出现 
>       + userAgent {String} 设置userAgent，默认为客户端
```javascript
    pageOption:{
        page:{...},
        walk:{...},
        screenshot:{...},
        settings:{}
    }   
```
* ### Monitor.diff 
    - left {JSON} Monitor.capture返回的dom JSON
    - right {JSON} Monitor.capture返回的dom JSON
    - option {Object} diff 配置

```javascript
    var Monitor = require('pageMonitor');
    
    var url = 'http://www.google.com';
    var monitor = new Monitor();
    monitor.capture(url,pageOption).then(arr=>{
        var left=arr[0].dom;
        var right=arr[1].dom;
        monitor.diff(left,right,diffOption).then(res=>{
                console.log(res)
        });
    });
```

## Event
#### Monitor.on('beforeCapture',function(/\*data\*/){})
* data
    - page {Object} puppeteer.page对象，可以在capture执行前设置页面参数
    - option {Object} Monitor.capture调用时传入的参数
#### Monitor.on('beforeDiff')
  
