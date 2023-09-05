//*- coding = utf-8 -*-
//@Time : 2022-01-17 1:25
//@Author : 沉默
//@File : userService.js
//@web  : www.php-china.com
//@Software: WebStorm
// 数据库类
const mysql = require("mysql"),//需要安装mysql拓展
    config = require("../../config/index")//配置文件
console.log(10, mysql);
class Model {
    //连接对象静态属性--静态属性是与类创建同时生成的和同时销毁
    static conn = null;
    constructor() {
    }
    //链接数据库静态方法
    static connection() {
        console.log(18, config);
        if(!Model.conn){
            let host = config.config.mysql.host;
            let user = config.config.mysql.user;
            let password = config.config.mysql.password;
            let database = config.config.mysql.database;
    
            //mysql连接池
            Model.conn = mysql.createPool({
                host,//"数据库服务器地址",
                port: "3306", // MySQL数据库端口号
                database,// "数据库名",
                user,//"连接数据库的用户名",
                password,//"连接数据库的密码",
                connectionLimit: 20,//"指定连接池中最大的链接数，默认是10",
                multipleStatements: true,//"是否运行执行多条sql语句，默认值为false"
            })
            console.log(`数据库连接成功`);
        }
    }
    /**
     * 数据库的操作--开启事务
     * @param sql 执行的操作语句
     * @param params 给sql语句的占位符进行赋值的参数数组
     * @returns {Promise<unknown>}
     */
    static async query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.connection();
            Model.conn.getConnection((err, conn) => {
                if (err) {
                    console.log(`数据库连接失败:${err.message}`);
                } else {
                    conn.query(sql, params, (err, res) => {
                        if (err) {
                            console.log('数据库查询失败', err)
                            reject(err)
                        } else {
                            resolve(res)
                        }
                    })
                    conn.release();//释放连接
                }
            })
        })
    }
    static async createUUID(){
        return this.query("select REPLACE (UUID(),'-','')").then((res)=>{
            return Object.values(res[0])[0]
        })
    }
}
module.exports = Model;