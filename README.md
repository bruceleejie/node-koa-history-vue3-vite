# node-koa-history-vue3-vite
nodejs+koa，vite+vue3+ts 使用router的history模式，需要注意的点

> 背景：公司内部要构建一个在线文档中，方便各个系统的引用以及用户的阅读，且方便及时修改，用户不必再更新文档链接，即可用历史链接访问最新的文档内容
> 
> 技术点：前端是vite + vue3 + ts + md-editor-v3；后端是nodejs + koa + connect-history-api-fallback

## 前端的修改

需要在router的配置文件里做一些修改：router/index.ts

> vue之前控制浏览器中url显示#，是通过使用哈希
```vue
import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
   history: createWebHashHistory(),
   routes: routes,
   ...
})
```

> 现在不显示#，就需要用history，修改如下:
``` vue
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
   history: import.meta.env.VITE_NODE_NEV_TYPE == 'location' ? createWebHistory() : createWebHistory('/onlineApp/docCenter/'),
   routes: routes,
   ...
})
```
*注意： 这里createWebHistory之所以要包一个路径是因为，可能你这个服务不只是有一个服务，可能有多个功能或服务，可能会分出多个文件，承担多项功能点。所以这里包的路径就是你那个不需要#号的vue项目打包后的地址。*

## 后端的修改

后端node服务部分需要的修改就主要是引入koa2-connect-history-api-fallback依赖，之所以没用上面提到过的connect-history-api-fallback，是因为这两个基本差不多，带koa2开头的依赖是它的补充，基本都能通用；

安装：
``` vue
npm install koa2-connect-history-api-fallback --save-dev
or
yarn add koa2-connect-history-api-fallback
```
使用可以参考这里[connect-history-api-fallback源码](https://github.com/bripkens/connect-history-api-fallback)

具体代码修改地方如下：node服务入口文件：index.ts
```
...
// import history from 'connect-history-api-fallback';
import history from 'koa2-connect-history-api-fallback';
...
// 其他配置信息省略
...
// app.use(koaMount('/onlineApp/docCenter',koaStatic(path.join(__dirname, '../childApp/docServer'))));
// 从上面修改成下面
app.use(history({
   index: '/onlineApp/docCenter/index.html',
   rewrites: [
      // @ts-ignore
        { from: /\/assets\/(.*)/g, to: function(context) {
         let url = context.parsedUrl.pathname.split('/assets/')[1];
         console.log(175, context, '/onlineApp/docCenter/assets/' + url);
         return '/onlineApp/docServer/assets/' + url;
      } },
      // @ts-ignore
        { from: /\/img\/(.*)/g, to: function(context) {
         let url = context.parsedUrl.pathname.split('/img/')[1];
         console.log(180, context, '/onlineApp/docCenter/img/' + url);
         return '/onlineApp/docCenter/img/' + url;
      } },
      // @ts-ignore
      { from: /\onlineApp\/docCenter\/(.*)/, to: '/childApp/docCenter/index.html' },
   ]
   // rewrites: [
   // 	{ from: '/onlineApp/docCenter/(.*)', to: '/childApp/docCenter/index.html', }
   // 	// { from: '/onlineApp/docCenter/article', to: '/childApp/docCenter/index.html', },
   // 	// { from: '/onlineApp/docCenter/edit', to: '/childApp/docCenter/index.html', },
   // 	// { from: '/onlineApp/docCenter/view', to: '/childApp/docCenter/index.html', },
   // 	// { from: '/onlineApp/docCenter/category', to: '/childApp/docCenter/index.html', },
   // 	// { from: '/onlineApp/docCenter/md', to: '/childApp/docCenter/index.html', }
   // ]
})).use(koaMount('/onlineApp/docCenter',koaStatic(path.join(__dirname, '../onlineApp/docCenter'))));
...
// 另外 这个history要放在app.use(router.routes());之前
```

*如果有遗漏请私信，或者去代码查看*
