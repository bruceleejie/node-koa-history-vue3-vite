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

app.use(history({
	index: '/onlineApp/docCenter/index.html',
	rewrites: [
		// @ts-ignore
        { from: /\/assets\/(.*)/g, to: function(context) {
			let url = context.parsedUrl.pathname.split('/assets/')[1];
			console.log(175, context, '/onlineApp/docCenter/assets/' + url);
			return '/onlineApp/docCenter/assets/' + url;
		} },
		// @ts-ignore
        { from: /\/img\/(.*)/g, to: function(context) {
			let url = context.parsedUrl.pathname.split('/img/')[1];
			console.log(180, context, '/onlineApp/docCenter/img/' + url);
			return '/onlineApp/docCenter/img/' + url;
		} },
		// @ts-ignore
		{ from: /\onlineApp\/docCenter\/(.*)/, to: '/onlineApp/docCenter/index.html' },
	]
	// rewrites: [
	// 	{ from: '/onlineApp/docCenter/(.*)', to: '/onlineApp/docCenter/index.html', }
	// 	// { from: '/onlineApp/docCenter/article', to: '/onlineApp/docCenter/index.html', },
	// 	// { from: '/onlineApp/docCenter/edit', to: '/onlineApp/docCenter/index.html', },
	// 	// { from: '/onlineApp/docCenter/view', to: '/onlineApp/docCenter/index.html', },
	// 	// { from: '/onlineApp/docCenter/category', to: '/onlineApp/docCenter/index.html', },
	// 	// { from: '/onlineApp/docCenter/md', to: '/onlineApp/docCenter/index.html', }
	// ]
})).use(koaMount('/onlineApp/docCenter',koaStatic(path.join(__dirname, '../onlineApp/docCenter'))));
app.use(koaMount('/onlineApp/webComponents',koaStatic(path.join(__dirname, '../onlineApp/webComponents'))));

app.use(router.routes());
//设置监听端口
app.listen(config.port, () => {
    console.log(`服务启动开启 127.0.0.1:${config.port}`);
});
