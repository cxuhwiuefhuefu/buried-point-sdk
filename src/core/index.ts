/*
 * @Author: Sunny
 * @Date: 2022-08-18 10:48:13
 * @LastEditors: Suuny
 * @LastEditTime: 2022-09-03 22:19:31
 * @Description:
 * @FilePath: /buried-point-sdk/src/core/index.ts
 */


import { DefaultOptions, TrackerConfig, Options } from "../types/index";
import { createHistoryEvent } from '../utils/pv'


// 需要监听的事件
const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover'];

export default class Tracker {

    public data: Options; // 用户传递的值需要有一个接收
    constructor(options: Options) { // 用户传的自定义选项
        this.data = Object.assign(this.initDef, options)
        this.installTracker()
    }
    private initDef(): DefaultOptions { // 初始化 兜底的
        window.history['pushState'] = createHistoryEvent('pushState')
        window.history['replaceState'] = createHistoryEvent('replaceState')
        return <DefaultOptions>{ // 默认
            sdkVersion: TrackerConfig.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
        }
    }


    public setUserId<T extends DefaultOptions['uuid']>(uuid: T) {
        this.data.uuid = uuid;
    }
    public setExtra<T extends DefaultOptions['extra']>(extra: T) {
        this.data.extra = extra;
    }

    // 手动上报
    public sendTracker<T>(data: T) {
        this.reportTracker(data);
    }

    // dom 上报
    private targetKeyReport() {
        console.log('dom 上报', MouseEventList)
        MouseEventList.forEach(ev => {
            window.addEventListener(ev, (e) => {

                const target = e.target as HTMLElement;
                const targetKey = target.getAttribute('target-key');

                console.log("target, targetKey", target, targetKey)
                if (targetKey) {
                    this.reportTracker({
                        event: ev,
                        targetKey
                    })
                }
            })
        })
    }

    // 事件捕获器 自动上报
    private captureEvents<T>(MouseEventList: string[], targetKey: string, data?: T) { // targetKey 需要和后端去协商 后端去定义的
        MouseEventList.forEach(event => {
            window.addEventListener(event, () => {
                this.reportTracker({ // 上报给后台
                    event,
                    targetKey,
                    data
                });
            })
        })
    }


    // 注册监控事件
    private installTracker() {
        console.log('this.data', this.data.historyTracker, this.data.hashTracker, this.data.domTracker, this.data.jsError)
        if (this.data.historyTracker) {
            console.log('触发 historyTracker')
            
            this.installhandle()

            this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv')
        }
        if (this.data.hashTracker) {
            console.log('触发 hashTracker')
            this.captureEvents(['hashchange'], 'hash-pv')
        }
        if (this.data.domTracker) {
            this.targetKeyReport()
        }
        if (this.data.jsError) {
            this.jsError();
        }
    }

    // 原生不支持监听 history 的 pushState 和 replaceState 事件，手动添加事件监听
    private installhandle() {
        const bindEventListener =  <T extends keyof History>(type: T) => {
            const historyEvent = history[type];
            return  () => {
                const newEvent = historyEvent.apply(this, arguments);
                const e: any = new Event(type);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return newEvent;
            };
        };
        history.pushState = bindEventListener('pushState');
        history.replaceState = bindEventListener('replaceState');
    }

    // 监控错误事件
    private jsError() {
        this.errorEvent();
        this.promiseReject();
    }

    // 监听JS错误事件
    private errorEvent() {
        window.addEventListener('error', (event) => {
            this.reportTracker({
                event: 'error',
                targetkeyof: 'message',
                message: event.message
            })
        })
    }

    // 监听promise 
    private promiseReject() {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error => {
                this.reportTracker({
                    event: "promise",
                    targetKey: 'message',
                    message: error
                })
            })
        })
    }


    // 上报方法
    private reportTracker<T>(data: T) {
        const params = Object.assign(this.data, data, { time: new Date().getTime() }) // 加个时间戳

        let headers = {
            type: "application/x-www-form-urlencoded"
        }
        let blob = new Blob([JSON.stringify(params)], headers);

        navigator.sendBeacon(this.data.requestUrl, blob)
    }

}