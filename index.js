let http = require('http');
let server = http.createServer();
//puppteteerjs
let pTeer = require('puppeteer');
//page-diff
let pdiff = require('page-diff');
//event class
let EventEmitter = require('./lib/EventEmitter');
//util
let util = require('util');
let _ = require('./utils');

var log = function (msg, type) {
    type = type || _.log.DEBUG;
    console.log(type + msg);
};
//puppeteer default config
const defaultSettings = {
    //puppeteer.launch  config
    launch: {
        headless: true
    },
};
//Monitor.caupture config
const captureSettings = {
    //Monitor.capture config
    page: {
        waitUntil: 'networkidle0',
    },
    walk: {},
    screenshot: {
        type: 'jpeg',
        quality: 80,
        fullPage: true,
    },
    settings: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
        delay: 5000
    }
};
//Monitor.diff config
const diff = {};

/**
 * Monitor class
 * @param {Object} options
 * */
let Monitor = function (options) {
    EventEmitter.call(this);
    this.config = _.merge(defaultSettings, options || {});
    this.browser = null;
    this.page = null;
};
util.inherits(Monitor, EventEmitter);
/**
 * init Puppeteer
 * @return null
 * */
Monitor.prototype.init = async function () {
    this.browser = await pTeer.launch(this.config.launch);
    this.page = await this.browser.newPage();
    let currentScreen = await this.page.evaluate(() => {
        return {
            width: window.screen.availWidth,
            height: window.screen.availHeight,
        };
    });
    //默认全屏
    await this.page.setViewport(currentScreen);
};
/**
 * create page goto url and snapshot
 * @param {String|Array} url
 * @param {Object} option
 * @return {Promise}
 * */
Monitor.prototype.capture = async function (url, option) {
    const {page, walk} = option;
    let status = 0,
        result = {};
    await this.init();
    // await handlePageSetting(this.page, option);
    this.emit('beforeCapture',{page:this.page,option});
    status++;
    await this.page.goto(url, page).then(async res => {
        log('open:' + url);
    }).catch(e => {
        this.emit('Error', e);
        status--;
    });
    let image = await this.page.screenshot(option.screenshot);
    await this.page.evaluate(pdiff.walk, walk).then(res => {
        result = {
            url,
            dom: res,
            screenshot: image
        }
    }).catch(e => {
        this.emit('Error', e);
        status--;
    });
    this.browser.close();
    log(`capture end`);
    return result;
};
/**
 * from Monitor.capture return JSON to diff
 * @param {Object} left
 * @param {Object} right
 * @param {Object} option
 * @return {Promise}
 * */
Monitor.prototype.diff = async function (left, right, option) {
    this.emit('beforeDiff');
    let ret = null;
    try {
        ret = pdiff.diff(left, right, option);
    } catch (e) {
        this.emit('Error', e);
    }
    log('diff end');
    return ret;
};

//todo
async function handlePageSetting(page, option) {
    let {settings} = option;
    if (typeof settings.width == 'number' && typeof settings.height == 'number') {
        await page.setViewport({width: settings.width, height: settings.height});
    } else if (settings.userAgent) {
        await page.setUserAgent(settings.userAgent);
    }
}

server.on('request', (req, res) => {
    if (req.url == '/') {
        let c = new Monitor(defaultSettings);
        c.capture('https://www.baidu.com/', captureSettings).then(res => {
            console.log(res)
        }).catch(e => {
            console.log(e)
        });
        res.end('asdddddd');
    }
});
server.listen(3000);
module.exports = Monitor;
