import * as Koa from 'koa';
import { config } from "./config/index";
const app = new Koa();
// import { api } from './api/index';
// import { clientApi } from './api/client/index';
import { userApi } from './api/user/index';
import koaBody from 'koa-body';
import * as Router from 'koa-router';
import * as bodyParser  from "koa-bodyparser";

import * as koaStatic from 'koa-static';
import * as koaMount from 'koa-mount';
import * as path from 'path';

const fs = require('fs');
let mime = require('mime');

// import history from 'connect-history-api-fallback';
import history from 'koa2-connect-history-api-fallback';

import { koaSwagger } from 'koa2-swagger-ui'
import swagger from './swagger/index';
import * as staticApi from './static';
import { ResultEnum } from './typescript/enums/httpEnum';
// const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

// Sentry.init({
// 	dsn: "",
// 	tracesSampleRate: 1.0,
// });

app.use(bodyParser())
app.use(koaBody({
	multipart: true,
    formLimit: "10mb",
    jsonLimit: "10mb",
    textLimit: "10mb",
	formidable: {
		maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
	},
	onError(err) {
		console.log('err', err)
	}
}))

/**
* @description: swagger相关的配置
*/
app.use(swagger.routes())
app.use(//注意这里需要看koa2-swagger-ui的版本 不然会报koaSwagger不是一个函数等错误
	koaSwagger({
		routePrefix: `/swagger`, // host at /swagger instead of default /docs
		swaggerOptions: {
			url: `../swagger/swagger.json` // example path to json
		}
	})
)


let router = new Router()

/**
* @description: 路由指向api层
*/
router.use(config.userUrl, userApi.routes())

router.get(new RegExp(config.staticUrl+'/.*'),staticApi.staticMiddleWare)

// 对于错误路径 如果用了koa2-connect-history-api-fallback 还是会重定向到docCenter下，
// 如果这不符合需要的话 就得考虑用koa-router的方式兼容；
// 匹配路径之后，判断是否存在，然后用文件流返回静态文件
router.get(/^\/onlineApp\/docCenter*/g,async (ctx, next) => {
	await next()
	let rightUrl = ctx.url.split('/onlineApp/docCenter/')[1];
	let localFilePath = path.join(__dirname, '../childApp/docCenter/',rightUrl);
	if (fs.existsSync(localFilePath)) { // 本地存在
		ctx.body = await fs.createReadStream(localFilePath)
		ctx.status = 200;
		ctx.type = await mime.getType(localFilePath)
	} else {
		let filepath = '';
		if(ctx.url.indexOf('assets') != -1) {
			let rightFile = ctx.url.split('/assets/')[1];
			filepath = path.join(__dirname, '../onlineApp/docCenter/assets/',rightFile);
		} else if(ctx.url.indexOf('img') != -1) {
			let rightFile = ctx.url.split('/img/')[1];
			filepath = path.join(__dirname, '../onlineApp/docCenter/img/',rightFile);
		} else if(ctx.url.indexOf('favicon.svg') != -1) {
			filepath = path.join(__dirname, '../onlineApp/docCenter/favicon.svg');
		} else {
			filepath = path.join(__dirname, '../onlineApp/docCenter/index.html');
		}
		ctx.body = await fs.createReadStream(filepath)
		ctx.status = 200;
		ctx.type = await mime.getType(filepath)
	}
})

/**
* @description: 测试触发匹配地址
*/
router.get(/.*/g, (ctx, next) => {
	ctx.body = {
		url: ctx.url,
		status: ResultEnum.NOT_FOUND,
		message: ResultEnum.NOT_FOUND_TEXT
	}
	ctx.status = ResultEnum.NOT_FOUND
	next()
})
/**
* @description: 测试触发匹配地址
*/
router.post(/.*/g, (ctx, next) => {
	ctx.body = {
		url: ctx.url,
		status: ResultEnum.NOT_FOUND,
		message: ResultEnum.NOT_FOUND_TEXT
	}
	ctx.status = ResultEnum.NOT_FOUND
	next()
})

// app.use(history({
// 	index: '/onlineApp/docCenter/index.html',
// 	rewrites: [
// 		// @ts-ignore
//         { from: /\/assets\/(.*)/g, to: function(context) {
// 			let url = context.parsedUrl.pathname.split('/assets/')[1];
// 			return '/onlineApp/docCenter/assets/' + url;
// 		} },
// 		// @ts-ignore
//         { from: /\/img\/(.*)/g, to: function(context) {
// 			let url = context.parsedUrl.pathname.split('/img/')[1];
// 			return '/onlineApp/docCenter/img/' + url;
// 		} },
// 		// @ts-ignore
// 		{ from: /\onlineApp\/docCenter\/(.*)/, to: '/onlineApp/docCenter/index.html' },
// 	]
// 	// rewrites: [
// 	// 	{ from: '/onlineApp/docCenter/(.*)', to: '/onlineApp/docCenter/index.html', }
// 	// 	// { from: '/onlineApp/docCenter/article', to: '/onlineApp/docCenter/index.html', },
// 	// 	// { from: '/onlineApp/docCenter/edit', to: '/onlineApp/docCenter/index.html', },
// 	// 	// { from: '/onlineApp/docCenter/view', to: '/onlineApp/docCenter/index.html', },
// 	// 	// { from: '/onlineApp/docCenter/category', to: '/onlineApp/docCenter/index.html', },
// 	// 	// { from: '/onlineApp/docCenter/md', to: '/onlineApp/docCenter/index.html', }
// 	// ]
// })).use(koaMount('/onlineApp/docCenter',koaStatic(path.join(__dirname, '../onlineApp/docCenter'))));
app.use(koaMount('/onlineApp/webComponents',koaStatic(path.join(__dirname, '../onlineApp/webComponents'))));

app.use(router.routes());
//设置监听端口
app.listen(config.port, () => {
    console.log(`服务启动开启 127.0.0.1:${config.port}`);
});
