var pool = require('../../orm/mysql').pool;
module.exports = {
    // 写入数据
    writeSource: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(`insert into sys_source (name, url, status, \`index\`, type, position) VALUES(${pool.escape(parameter.name)},${pool.escape(parameter.url)},${pool.escape(parameter.status)},${pool.escape(parameter.index)},${pool.escape(parameter.type)},${pool.escape(parameter.position)}) `, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
    // 查询资源
    searchSource: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(`select * from sys_source where id = ${pool.escape(parameter.id)} or name = ${pool.escape(parameter.name)} or status = ${pool.escape(parameter.status)} or type = ${pool.escape(parameter.type)} or position = ${pool.escape(parameter.position)} order by \`index\` asc `, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
    // 删除资源
    deleteSource: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                console.log(`delete from sys_source where id = ${pool.escape(parameter.id)}`)
                conn.query(`delete from sys_source where id = ${pool.escape(parameter.id)}`, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
    // 编辑资源
    editSource: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(`update sys_source set ${(function () {
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
                })()} where id = ${parameter.where.id} `, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
}