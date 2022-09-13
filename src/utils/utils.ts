/*
 * @Author: Sunny
 * @Date: 2022-09-11 23:48:00
 * @LastEditors: Suuny
 * @LastEditTime: 2022-09-11 23:54:00
 * @Description: 
 * @FilePath: /buried-point-sdk/src/utils/utils.ts
 */



// 深拷贝
export const deepClone = (target: any) {
    if(typeof target === 'object') {
        const result:any = Array.isArray(target) ? [] : {}
        for(const key in target) {
            if(typeof target[key] === 'object') {
                result[key] = deepClone(target[key]);
            }else {
                result[key] = target[key]
            }
        }
        return target;
    }
    return target;
}

