import { categoryFace, anyObject } from '../../typescript/interface/interface';
const { escape } = require("mysql");
const Model = require("./mysql");
class userModel extends Model {
    constructor(){
        super()
    }
    static async checkHaveCategory(options:categoryFace){
        let list = await this.query(`select * from category where id = ${escape(options.id)}`)
        return list.length > 0
    }

    // 创建分类
    static async createCategory(options:categoryFace){
        let uuid = await this.createUUID()
        console.log(uuid,options, 1616)
        return this.query(`insert into category (title) value (${escape(options.name)})`).then((res)=>{
            return uuid
        })
    }
    // 查询分类
    static async getCategory(title){
        let sql = '';
        if(title) {
            sql = `select * from category where is_del = 0 and title = ${escape(title)}`
        } else {
            sql = `select * from category where is_del = 0`
        }
        let list = await this.query(sql);
        console.log(list, title, 2929)
        return list;
    }
    // 删除分类
    static async deleteCategory(id,options={}){
        let obj = <categoryFace>{id: id}
        let have = this.checkHaveCategory(obj)
        if(!have){
            return {
                baseInfo: {
                    status: 1,
                    message: "未找到该分类"
                }
            }
        }else{
            console.log(id, 124)
            await this.query(`update category set is_del = 1 where id=${escape(id)}`)
            return {
                baseInfo: {
                    status: 0,
                    message: "删除成功"
                }
            }
        }
    }
    // 更新分类
    static async updateCategory(id,options=<categoryFace>{}){
        let obj = <categoryFace>{id: id}
        let have = this.checkHaveCategory(obj)
        if(!have){
            return {
                baseInfo: {
                    status: 1,
                    message: "未找到该分类"
                }
            }
        }else{
            console.log(id, 124)
            await this.query(`update category set title = ${escape(options.title)} where id=${escape(id)}`)
            return {
                baseInfo: {
                    status: 0,
                    message: "更新成功"
                }
            }
        }
    }
}

module.exports = userModel