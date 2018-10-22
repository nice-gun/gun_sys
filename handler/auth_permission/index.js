var express = require('express');
var hd = express.Router();
var dao = require('./dao')
var assert = require('assert');
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart({ uploadDir: './public/source' });
var Sequelize = require('sequelize');
var orm = require('../../orm/orm');
var fs = require("fs");
var path = require('path');

// 登录页
hd.get('/rolePage', function (req, res, next) {
  res.render('test')
});

// 设置角色
hd.post('/setPermission', function (req, res, next) {
  dao.writePermission({
    ...req.body
  }, function (err, vals) {
    if (err) return res.json({ info: '增加错误', status: "1" });
    res.json({ info: "操作成功", status: "0" })
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
  default: '/permission',
  hd
};
