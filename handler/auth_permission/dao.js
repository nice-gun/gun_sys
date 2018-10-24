var pool = require('../../orm/mysql').pool;
module.exports = {
    // 写入资源
    writePermission: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(`insert into auth_permission (${(function () {
                    let field = '', i = 0;
                    for (let ins in parameter) {
                        i++
                        if (i == Object.keys(parameter).length) {
                            field += ` \`${ins}\` `
                        } else {
                            field += ` \`${ins}\` ,`
                        }
                    }
                    return field
                })()}) VALUES( ${(function () {
                    let field = '', i = 0;
                    for (let ins in parameter) {
                        i++
                        if (i == Object.keys(parameter).length) {
                            field += ` ${pool.escape(parameter[ins])} `
                        } else {
                            field += ` ${pool.escape(parameter[ins])} ,`
                        }
                    }
                    return field
                })()})`, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
    // 查询资源
    searchPermission: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(`select * from auth_permission where ${(function () {
                    let field = '', i = 0;
                    for (let ins in parameter) {
                        i++
                        if (i == Object.keys(parameter).length) {
                            field += `${ins} = ${pool.escape(parameter[ins])}`
                        } else {
                            field += `${ins} = ${pool.escape(parameter[ins])} or `
                        }
                    }
                    return field
                })()} order by \`index\` asc`, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
    // 删除资源
    deletePermission: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(`delete from auth_permission where id = ${pool.escape(parameter.id)} `, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
    // 编辑资源
    editPermission: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(`update auth_permission set ${
                    (function () {
                        let field = '', i = 0;
                        for (let ins in parameter.data) {
                            i++
                            if (i == Object.keys(parameter.data).length) {
                                field += ` \`${ins}\` = ${parameter.data[ins]}`
                            } else {
                                field += ` \`${ins}\` = ${parameter.data[ins]},`
                            }
                        }
                        return field
                    })()
                    } where id = ${parameter.where.id} `, function (qerr, vals, fields) {
                        //释放连接
                        conn.release();
                        //事件驱动回调
                        callback(qerr, vals, fields);
                    });
            }
        });
    },
}