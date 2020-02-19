'use strict';
const fs = require('fs');

function validateDirtLocation(gridSize, dirtLocation){
  var dirtX = parseInt(dirtLocation[0]);
  var dirtY = parseInt(dirtLocation[1]);

  var gridXMax = parseInt(gridSize[0])-1;
  var gridYMax = parseInt(gridSize[1])-1;

  if(dirtX > gridXMax || dirtY > gridYMax){
    throw new Error('Error: dirt patch is outside the bounds of the grid.');
  }
}

function processFile(){
  var fileName = process.argv[2];
  var file;
  try {
    file = fs.readFileSync(fileName, 'utf8');

  } catch (err){
    throw new Error(err.message);
  }
  var fileArray = file.split('\n');
  var fileObj = {
    gridSize:[],
    initialPosition:[],
    dirtLocations: new Set(),
    directions: []
  };

  for(var i = 0; i < fileArray.length; i++){
    var temp = fileArray[i].split(' ');
    if(i == 0){
      fileObj['gridSize'] = fileArray[i].split(' ');
    } else if( i == 1) {
      fileObj['initialPosition'] = fileArray[i].split(' ');
      if((parseInt(fileObj['initialPosition'][0]) > parseInt(fileObj['gridSize'][0])) || (parseInt(fileObj['initialPosition'][1]) > parseInt(fileObj['gridSize'][1]))){
        throw new Error('Error: the initial position of the Roomba is outside the bounds of the room.');
      }
    } else if(i == fileArray.length-1){
      fileObj['directions'] = fileArray[i].split('');

    } else {
      validateDirtLocation(fileObj['gridSize'], fileArray[i]);
      fileObj['dirtLocations'].add(fileArray[i]);
    }
  }

  return fileObj;
}

function cleanRoom(inputObj) {
  console.log('The room is '+inputObj['gridSize'][0]+' x '+inputObj['gridSize'][1]);
  console.log('The robot will start cleaning the room from the position '+inputObj['initialPosition'].join(' '));
  console.log(' ');

  var currPosition = [parseInt(inputObj['initialPosition'][0]), parseInt(inputObj['initialPosition'][1])];

  var totalDirtCleaned = 0;

  var currDirection;

  for(var i = 0; i <  inputObj['directions'].length; i++){
    currDirection = inputObj['directions'][i];
    if(currDirection == 'N'){
      currPosition[1] += 1;
    } else if(currDirection == 'S'){
      currPosition[1] -= 1;
    } else if(currDirection == 'E'){
      currPosition[0] += 1;
    } else if(currDirection == 'W'){
      currPosition[0] -= 1;
    } else {
      throw new Error('Error: Roomba can only accept N, S, E, and W as valid directions.');
    }

    var currentString = currPosition[0].toString()+' '+currPosition[1].toString();

    if(inputObj['dirtLocations'].has(currentString)){
      totalDirtCleaned += 1;
      inputObj['dirtLocations'].delete(currentString);
    }
  }

  console.log('Final position of the robot: '+currentString);
  console.log('Total number of dirt patches cleaned: '+totalDirtCleaned.toString());
}

var inputObj = processFile();
cleanRoom(inputObj);

