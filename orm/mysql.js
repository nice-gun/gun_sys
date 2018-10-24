var mysqls = require('mysql');
var pool = mysqls.createPool({
    host: '118.89.64.12',
    user: 'root',
    password: 'wangweijun',
    database: 'Share'
});
module.exports = {
    common: {
        // 写入资源
        insert: function (parameter, callback) {
            pool.getConnection(function (err, conn) {
                if (err) {
                    callback(err, null, null);
                } else {
                    conn.query(`insert into ${parameter.name} (${(function () {
                        let field = '', i = 0;
                        for (let ins in parameter.data) {
                            i++
                            if (i == Object.keys(parameter.data).length) {
                                field += ` \`${ins}\` `
                            } else {
                                field += ` \`${ins}\` ,`
                            }
                        }
                        return field
                    })()}) VALUES( ${(function () {
                        let field = '', i = 0;
                        for (let ins in parameter.data) {
                            i++
                            if (i == Object.keys(parameter.data).length) {
                                field += ` ${parameter.data[ins]} `
                            } else {
                                field += ` ${parameter.data[ins]} ,`
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
        select: function (parameter, callback) {
            parameter.sort ? '' : parameter.sort = {
                field:'id',
                order:'desc'
            }
            pool.getConnection(function (err, conn) {
                if (err) {
                    callback(err, null, null);
                } else {
                    conn.query(`select * from ${parameter.name} ${parameter.sort ? '' : `order by \`${parameter.sort.field}\` ${parameter.sort.order}`} where ${(function () {
                        let field = '', i = 0;
                        for (let ins in parameter.data) {
                            i++
                            if (i == Object.keys(parameter.data).length) {
                                field += `${ins} = ${parameter.data[ins]}`
                            } else {
                                field += `${ins} = ${parameter.data[ins]} ${parameter.mode} `
                            }
                        }
                        return field
                    })()}`, function (qerr, vals, fields) {
                        //释放连接
                        conn.release();
                        //事件驱动回调
                        callback(qerr, vals, fields);
                    });
                }
            });
        },
        // 删除资源
        delete: function (parameter, callback) {
            pool.getConnection(function (err, conn) {
                if (err) {
                    callback(err, null, null);
                } else {
                    conn.query(`delete from ${parameter.name} where id = ${pool.escape(parameter.data.id)} `, function (qerr, vals, fields) {
                        //释放连接
                        conn.release();
                        //事件驱动回调
                        callback(qerr, vals, fields);
                    });
                }
            });
        },
        // 编辑资源
        update: function (parameter, callback) {
            pool.getConnection(function (err, conn) {
                if (err) {
                    callback(err, null, null);
                } else {
                    conn.query(`update ${parameter.name} set ${
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
    },
    pool
}
