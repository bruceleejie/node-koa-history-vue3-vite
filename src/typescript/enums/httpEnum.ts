/**
 * @description: 请求结果集
 */
export enum ResultEnum {
  SUCCESS = 0,
  SUCCESS_TEXT = '成功',
  ERROR = 1,
  ERROR_TEXT = '服务器开小差，请稍后再试',
  TIMEOUT = 10042,
  TIMEOUT_TEXT = '服务超时',
  NOT_FOUND = 404,
  NOT_FOUND_TEXT = '资源未找到'
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // json
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
