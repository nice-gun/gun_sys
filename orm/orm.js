var Sequelize = require('sequelize');
var sequelize = new Sequelize('Share', 'root', 'wangweijun', {
    host: '118.89.64.12',
    dialect: 'mysql',
    define: {
        raw: true  // 设置为 true，即可返回源数据
       } 
});
module.exports = sequelize