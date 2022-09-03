/*
 * @Author: Sunny
 * @Date: 2022-08-18 11:42:09
 * @LastEditors: Suuny
 * @LastEditTime: 2022-08-26 17:25:25
 * @Description:
 * @FilePath: /buried-point-sdk/src/types/index.ts
 */
// 版本
var TrackerConfig;
(function (TrackerConfig) {
    TrackerConfig["version"] = "1.0.0";
})(TrackerConfig || (TrackerConfig = {}));

/*
 * @Author: Sunny
 * @Date: 2022-08-26 17:33:49
 * @LastEditors: Suuny
 * @LastEditTime: 2022-08-29 14:58:50
 * @Description:
 * @FilePath: /buried-point-sdk/src/utils/pv.ts
 */
// keyof 泛型约束
const createHistoryEvent = (type) => {
    const origin = history[type];
    // 返回高阶函数
    return function () {
        const res = origin.apply(this, arguments);
        // 创建自定义事件
        const e = new Event(type);
        window.dispatchEvent(e); // 派发事件
        console.log('res', res);
        return res;
    };
};

/*
 * @Author: Sunny
 * @Date: 2022-08-18 10:48:13
 * @LastEditors: Suuny
 * @LastEditTime: 2022-09-03 22:19:31
 * @Description:
 * @FilePath: /buried-point-sdk/src/core/index.ts
 */
// 需要监听的事件
const MouseEventList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];
class Tracker {
    constructor(options) {
        this.data = Object.assign(this.initDef, options);
        this.installTracker();
    }
    initDef() {
        window.history['pushState'] = createHistoryEvent('pushState');
        window.history['replaceState'] = createHistoryEvent('replaceState');
        return {
            sdkVersion: TrackerConfig.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
        };
    }
    setUserId(uuid) {
        this.data.uuid = uuid;
    }
    setExtra(extra) {
        this.data.extra = extra;
    }
    // 手动上报
    sendTracker(data) {
        this.reportTracker(data);
    }
    // dom 上报
    targetKeyReport() {
        console.log('dom 上报', MouseEventList);
        MouseEventList.forEach(ev => {
            window.addEventListener(ev, (e) => {
                const target = e.target;
                const targetKey = target.getAttribute('target-key');
                console.log("target, targetKey", target, targetKey);
                if (targetKey) {
                    this.reportTracker({
                        event: ev,
                        targetKey
                    });
                }
            });
        });
    }
    // 事件捕获器 自动上报
    captureEvents(MouseEventList, targetKey, data) {
        MouseEventList.forEach(event => {
            window.addEventListener(event, () => {
                this.reportTracker({
                    event,
                    targetKey,
                    data
                });
            });
        });
    }
    // 注册监控事件
    installTracker() {
        console.log('this.data', this.data.historyTracker, this.data.hashTracker, this.data.domTracker, this.data.jsError);
        if (this.data.historyTracker) {
            console.log('触发 historyTracker');
            this.installhandle();
            this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv');
        }
        if (this.data.hashTracker) {
            console.log('触发 hashTracker');
            this.captureEvents(['hashchange'], 'hash-pv');
        }
        if (this.data.domTracker) {
            this.targetKeyReport();
        }
        if (this.data.jsError) {
            this.jsError();
        }
    }
    // 原生不支持监听 history 的 pushState 和 replaceState 事件，手动添加事件监听
    installhandle() {
        const bindEventListener = (type) => {
            const historyEvent = history[type];
            return () => {
                const newEvent = historyEvent.apply(this, arguments);
                const e = new Event(type);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return newEvent;
            };
        };
        history.pushState = bindEventListener('pushState');
        history.replaceState = bindEventListener('replaceState');
    }
    // 监控错误事件
    jsError() {
        this.errorEvent();
        this.promiseReject();
    }
    // 监听JS错误事件
    errorEvent() {
        window.addEventListener('error', (event) => {
            this.reportTracker({
                event: 'error',
                targetkeyof: 'message',
                message: event.message
            });
        });
    }
    // 监听promise 
    promiseReject() {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error => {
                this.reportTracker({
                    event: "promise",
                    targetKey: 'message',
                    message: error
                });
            });
        });
    }
    // 上报方法
    reportTracker(data) {
        const params = Object.assign(this.data, data, { time: new Date().getTime() }); // 加个时间戳
        let headers = {
            type: "application/x-www-form-urlencoded"
        };
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }
}

export { Tracker as default };
