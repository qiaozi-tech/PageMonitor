# PageMonitor
> capture webpage and diff the dom change with [puppeteer](https://zhaoqize.github.io/puppeteer-api-zh_CN/)

## Class:Monitor 

* ### Monitor.capture
    - url {String | Array} 字符串或数组
    - options {Object} puppeteer.page与puppeteer.screenshop配置，看官网设置  
    - return {Promise}  包含dom JSON与二进制图片

```javascript
    var Monitor = require('pageMonitor');
    
    var url = 'http://www.google.com';
    var monitor = new Monitor(MonitorOption);
    monitor.capture(url,pageOption).then(res=>{
        console.log(res)
        //res={dom:[],screenshot:image}
    });
```
* MonitorOption
>  [puppeteer.launch([options])](https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v5.3.0&show=api-puppeteerlaunchoptions)
* pageOption  
    - page {Object} puppeteer.page.goto官方设置
    - screenshot {Object} puppeteer.page.screenshot官方设置
    - settings 
        + height {Number} 设置页面高度,height和width必须成对出现
        + width {Number} 设置页面宽度，height和width必须成对出现  
        userAgent {String} 设置userAgent，默认为客户端
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
    
    var url = ['http://www.baidu.com','http://www.google.com'];
    var monitor = new Monitor();
    monitor.capture(url,pageOption).then(arr=>{
        var left=arr[0].dom;
        var right=arr[1].dom;
        monitor.diff(left,right,diffOption);
    });
```
  
