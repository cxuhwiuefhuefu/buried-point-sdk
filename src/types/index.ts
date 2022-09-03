/*
 * @Author: Sunny
 * @Date: 2022-08-18 11:42:09
 * @LastEditors: Suuny
 * @LastEditTime: 2022-08-26 17:25:25
 * @Description: 
 * @FilePath: /buried-point-sdk/src/types/index.ts
 */


/*
 * @request: 接口地址
 * @historyTracker: history 上报
 * @hashTracker: hash 上报
 * @domTracker: 携带 Tracker-key 点击事件上报
 * @sdkVersionsdk: 版本 
 * @jsError: js 和 promise 报错异常上报
 */

export interface DefaultOptions { // 定义默认值
    uuid: string | undefined, // uv
    requestUrl: string | undefined, // 上报的后台地址
    historyTracker: boolean, // history: true   自动上报
    hashTracker: boolean, // hash: true   自动上报
    domTracker: boolean, // 点击事件是否上报
    sdkVersion: string | number, // sdk 版本
    extra: Record<string, any> | undefined, // 用户可以自定义一些参数
    jsError: boolean // 上报错误的信息
}

export interface Options extends Partial<DefaultOptions> { // Partial 非必填写的属性
    requestUrl: string // 必传的
}

// 版本
export enum TrackerConfig {
    version = '1.0.0'
}