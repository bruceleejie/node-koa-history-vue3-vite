// import { escape } from "querystring";

const { escape } = require("mysql");
const Model = require("./mysql");
class exampleModel extends Model {
    constructor(){
        super()
    }
    static async queryList(options){
        let uuid = await this.createUUID()
        // 如何从表article中查询所有数据 且没被删除的项
        let sql = `select * from article where is_del = 0`
        let list = await this.query(sql);
        return list;
    }
    static async getInfoById(id){
        // article表是文章基本信息表，article_content表是文章内容或者文章详情表，需要根据id查询当前文章的所有数据，包括文章详情表内的所有数据
        // 这里需要用到join
        // let sqlLang = `select a.*,b.content from plugins a left join plugins_detail b on a.id = b.id`
        let sql = `select a.*,b.content from article a left join article_content b on a.id = b.id where a.id=${escape(id)}`; 
        let articleInfo = await this.query(sql);
        return articleInfo[0];
    }
    static async updateInfo(id, content, title, options) {
        // 如何修改 表article中的某一项的title, content信息
        let sql1 = `update article set content = ${escape(content)} and title = ${escape(title)} where id=${escape(id)}`
        await this.query(sql1);
        // 如何批量修改 表中的数据信息
        delete options.id
        delete options.content
        let sqlArr = []
        for (const name in options) {
            if (Object.hasOwnProperty.call(options, name)) {
                const value = options[name];
                sqlArr.push(`${name} = ${escape(value)}`)
            }
        }
        await this.query(`update category set ${sqlArr.join(",")} where id=${escape(id)}`)
        return {
            baseInfo: {
                code: 0,
                message: "成功"
            }
        }
    }
    static async deleteInfo(id) {
        // 如何删除 表中的某条数据
        await this.query(`update shopcart set is_del = 1 where id=${escape(id)}`)
        return {
            baseInfo: {
                code: 0,
                message: "删除成功"
            }
        }
    }
    static async addInfo(options, info) {
        // 如何 新增 数据
        let uuid = await this.createUUID()
        return this.query(`insert into order (id,name,create_user_id) value (${escape(uuid)},${escape(options.name)},${escape(info.userid)})`).then((res)=>{
            return uuid
        })
    }
    static async getCategoryList(options:any={}){
        // 如何 分页 查询 表中的数据信息
        options.pageCount = options.pageCount || 1
        options.pageSize = options.pageSize || 999
        let searchParams = options.searchParams || {};
        let sqlArr = []
        let sqlLang = `select a.*,b.real_name  from category a left join user b on a.create_user_id = b.userid  where a.is_del = 0`
        let countSqlLang = `select count(*) as count from category a where a.is_del = 0`
        for (const name in searchParams) {
            if (Object.hasOwnProperty.call(searchParams, name)) {
                const value = searchParams[name];
                if(value){
                    sqlArr.push(`a.${name} like ${escape(`%${value}%`)}`)
                }
            }
        }
        if(sqlArr.length>0) {
            sqlLang = `${ sqlLang } and ${sqlArr.join(' and ')}`
            countSqlLang = `${ countSqlLang } and ${sqlArr.join(' and ')}`
        }
        let pageIndex = (options.pageCount - 1);
        sqlLang = `${sqlLang} order by sort_num desc limit ${escape((pageIndex + 1) * options.pageSize)}`;
        let list = await this.query(sqlLang);
        let total = await this.query(countSqlLang)
        let result = {
            list: list.slice(pageIndex * options.pageSize),
            pageTotal: Math.ceil(total[0].count / options.pageSize)
        }
        return result
    }
}
module.exports = exampleModel
