# node-koa-history-vue3-vite
nodejs+koa，vite+vue3+ts 使用router的history模式，需要注意的点

> 背景：公司内部要构建一个在线文档中，方便各个系统的引用以及用户的阅读，且方便及时修改，用户不必再更新文档链接，即可用历史链接访问最新的文档内容
> 
> 技术点：前端是vite + vue3 + ts + md-editor-v3；后端是nodejs + koa + connect-history-api-fallback

## 前端的修改
> 需要在router的配置文件里做一些修改：router/index.ts

> vue之前控制浏览器中url显示#，是通过使用哈希

> import { createRouter, createWebHashHistory,createWebHistory } from 'vue-router'
> const router = createRouter({
>   history: createWebHashHistory(),
>   routes: routes,
>   ...
> })
> 
> 现在不显示#，就需要用history，修改如下:
> 
import { createRouter, createWebHashHistory,createWebHistory } from 'vue-router'
const router = createRouter({
   history: import.meta.env.VITE_NODE_NEV_TYPE == 'location' ? createWebHistory() : createWebHistory('/childApp/docServer/'),
   routes: routes,
   ...
})

