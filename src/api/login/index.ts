import * as Router from 'koa-router';
import { ResultEnum } from '../../typescript/enums/httpEnum';
// const trackModel = require('../../utils/sql/track');
// const userAnonymousModel = require('../../utils/sql/userAnonymous');
const userModel = require('../../utils/sql/user');
const fs = require('fs');
let router = new Router();
/**
 * @swagger
 * /api/login:
 *   get:
 *     tags:
 *       - 登录
 *     summary: 用户登录
 *     description:
 *     parameters:
 */
router.get('/login', async function (ctx, next) {
    let categoryRes;
    if(ctx.request.body && ctx.request.body.title) {
        categoryRes = await userModel.getCategory(ctx.request.body.title)
    } else {
        categoryRes = await userModel.getCategory()
    }
    ctx.body = {
        baseInfo: {
            code: ResultEnum.SUCCESS,
            message: ResultEnum.SUCCESS_TEXT,
        },
        data: categoryRes
    };
    return ctx;
});

export const LoginApi = router;