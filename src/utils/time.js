exports.currentDate = function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() > 9 ? date.getMonth() : date.getMonth() + 1;
    let day = date.getDate() > 9 ? new Date().getDate() : `0${new Date().getDate()}`;
    return year + '.' + month + '.' + day
}

export function currentTime(type) {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() > 9 ? date.getMonth() : date.getMonth() + 1;
    let day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    let hour = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
    let minute = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
    let second = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    if (type === 'yyyy-mm-dd hh:mm:ss' || type === 'YYYY-MM-DD hh:mm:ss') {
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    } else if (type === 'yyyy-mm-dd hh:mm' || type === 'YYYY-MM-DD hh:mm') {
        return `${year}-${month}-${day} ${hour}:${minute}`;
    } else if (type === 'yyyy/mm/dd hh:mm:ss' || type === 'YYYY/MM/DD hh:mm:ss') {
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    } else if (type === 'yyyy/mm/dd hh:mm' || type === 'YYYY/MM/DD hh:mm') {
        return `${year}/${month}/${day} ${hour}:${minute}`;
    } else if (type === 'yyyy.mm.dd' || type === 'YYYY.MM.DD') {
        return `${year}.${month}.${day}`;
    } else if (type === 'yyyy-mm-dd' || type === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    } else if (type === 'yyyymmdd' || type === 'YYYYMMDD') {
        return `${year}${month}${day}`;
    } else if (type === 'yyyymmddhhmmss' || type === 'YYYYMMDDhhmmss') {
        return `${year}${month}${day}${hour}${minute}${second}`;
    }
}
