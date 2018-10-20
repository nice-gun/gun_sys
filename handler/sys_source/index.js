var express = require('express');
var hd = express.Router();
var dao = require('./dao')
var assert = require('assert');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './public/source' });
var Sequelize = require('sequelize');
var orm = require('../../orm/orm');
var fs = require("fs");
var path = require('path');

// 登录页
hd.get('/test', function (req, res, next) {
  res.render('test')
});

// 上传资源
hd.post('/fileUpload', multipartMiddleware, function (req, res, next) {
  if (req.files.file) {
    dao.writeSource({
      name: req.body.name,
      status: parseInt(req.body.status),
      index: parseInt(req.body.index),
      type: parseInt(req.body.type),
      position: parseInt(req.body.position),
      url: req.files.file.path
    }, function (err, vals) {
      if (err) return res.json({ info: '增加错误', status: "1" });
      res.json({ info: "操作成功", status: "0" })
    })
  } else {
    res.json({ info: "没有文件", status: "1" })
  }
});

// 查询所有资源
hd.post('/searchFile', function (req, res, next) {
  dao.searchSource({
    ...req.body
  }, function (err, vals) {
    if (err) return res.json({ info: '增加错误', status: "1" });
    res.json({ info: "操作成功", call: vals, status: "0" })
  })
});

// 删除资源
hd.post('/deleteFile', function (req, res, next) {
  dao.searchSource({
    ...req.body
  }, function (err, vals) {
    if (err) return res.json({ info: '未查询到该数据', status: "1" });
    fs.unlink(`${path.join(__dirname, '../../')}${vals[0].url}`, function (err) {
      if (err) return res.json({ info: "系统删除错误", call: vals, status: "1" })
      dao.deleteSource({
        id: req.body.id
      }, function (err, vals) {
        if (err) return res.json({ info: '删除错误', status: "1" });
        res.json({ info: "删除成功", call: vals, status: "0" });
      })
    })
  })
});

// 修改资源
hd.post('/editFile', function (req, res, next) {
  delete req.body.url
  dao.editSource({
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
  default: '/source',
  hd
};
