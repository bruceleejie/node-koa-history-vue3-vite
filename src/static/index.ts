import path from 'path';
import fs from 'fs';

import  { config } from '../config/index';
var mime = require('mime');

/**
 * @description: 测试触发匹配地址
 */
export async function staticMiddleWare(ctx, next) {
    await next();
    let requestFilePath = ctx.url.replace(config.staticUrl, '');
    let localFilePath = path.join(__dirname, requestFilePath);
    if (fs.existsSync(localFilePath)) {
        // 本地存在
        ctx.body = await fs.createReadStream(localFilePath);
        ctx.status = 200;
        ctx.type = await mime.getType(localFilePath);
    } else {
        ctx.body = {
            baseInfo: {
                status: 1,
                message: '文件不存在',
            },
        };
        ctx.status = 404;
    }
}
