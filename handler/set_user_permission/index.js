var express = require('express');
var hd = express.Router();
var dao = require('./dao');
var assert = require('assert');
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart({ uploadDir: './public/source' });
var Sequelize = require('sequelize');
var orm = require('../../orm/orm');
var fs = require("fs");
var path = require('path');
var redis = require("../../config/application").redis;
var common = require("../../orm/mysql").common;
// 登录页
hd.get('/rolePage', function (req, res, next) {
  res.render('test')
});

// 设置角色权限
hd.post('/setPermissionRole', function (req, res, next) {
  common.select({
    // 表明
    name: 'auth_role_per',
    // 字段
    data: {
      ...req.body
    },
    // 方式
    mode: 'and'
  }, function (err, vals) {
    if (err) return res.json({ info: '增加错误', status: "1" });
    if (vals != '') {
      res.json({ info: "角色已有该权限", status: "1" })
    } else {
      common.insert({
        // 表明
        name: 'auth_role_per',
        // 字段
        data: {
          ...req.body
        }
      }, function (err, val) {
        if (err) return res.json({ info: '增加错误', status: "1" });
        dao.selectAll({
          name: 'auth_role_per'
        }, function (err, val) {
          if(err) return console.log(err)
          redis.set("rolePermission", JSON.stringify(val), function (err) {
            console.log(err)
          })
        })
        if (vals == '') {
          res.json({ info: "增加权限成功", status: "0" })
        }
      })
    }
  })
});

// 查询所有资源
hd.post('/searchPermission', function (req, res, next) {
  dao.searchPermission({
    ...req.body
  }, function (err, vals) {
    if (err) return res.json({ info: '查询错误', status: "1" });
    res.json({ info: "操作成功", call: vals, status: "0" })
  })
});

// 删除资源
hd.post('/deletePermission', function (req, res, next) {
  dao.deletePermission({
    id: req.body.id
  }, function (err, vals) {
    if (err) return res.json({ info: '未查询到该数据', status: "1" });
    res.json({ info: "删除成功", call: vals, status: "0" });
  })
});

// 修改资源
hd.post('/editPermission', function (req, res, next) {
  delete req.body.url
  dao.editPermission({
    data: {
      ...req.body
    },
    where: {
      id: req.body.id
    }
  }, function (err, vals) {
    if (err) return res.json({ info: '修改错误', status: "1" });
    res.json({ info: "修改成功", status: "0" });
  })
});

// 导出处理器带api
module.exports = {
  default: '/permissionRole',
  hd
};
