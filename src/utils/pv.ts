/*
 * @Author: Sunny
 * @Date: 2022-08-26 17:33:49
 * @LastEditors: Suuny
 * @LastEditTime: 2022-08-29 14:58:50
 * @Description: 
 * @FilePath: /buried-point-sdk/src/utils/pv.ts
 */

// keyof 泛型约束
export const createHistoryEvent = <T extends keyof History>(type: T) => {
    const origin = history[type]

    // 返回高阶函数
    return function(this: any) {
        const res = origin.apply(this, arguments)

        // 创建自定义事件
        const e = new Event(type);
        window.dispatchEvent(e); // 派发事件

        console.log('res', res)

        return res;
    }
}