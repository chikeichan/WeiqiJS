var express   = require('express');
var app       = express();

var DBURL     = process.env.CLEARDB_DATABASE_URL || 'mysql://localhost:3306/test';
var Sequelize = require('sequelize');
var sequelize = new Sequelize(DBURL,{});


app.use(express.static(__dirname+'/../client'));

var Room = sequelize.define('Rooms', {
  roomName: Sequelize.STRING,
  currentPlay: Sequelize.STRING,
  lastPlay: Sequelize.STRING,
  board: Sequelize.STRING
})

// Implement later
// sequelize.sync().then(function(){
//   Room.create({
//     roomName: 'test',
//     currentPlay: 'test',
//     lastPlay: 'test',
//     board: 'test'
//   })
// });


module.exports = app;