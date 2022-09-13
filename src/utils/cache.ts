/*
 * @Author: Sunny
 * @Date: 2022-09-11 23:55:06
 * @LastEditors: Suuny
 * @LastEditTime: 2022-09-12 00:08:05
 * @Description: 
 * @FilePath: /buried-point-sdk/src/utils/cache.ts
 */

import { deepClone } from "./utils";

const cache:[] = [];

export const getCache = () => {
    return deepClone(cache)
}

export const addCache = (data: object) => {
    // cache.push(data)
}
