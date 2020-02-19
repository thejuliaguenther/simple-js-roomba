const fs = require('fs');

function processFile(){

  var file;
  try {
    file = fs.readFileSync('input.txt', 'utf8');

  } catch (err){
      console.log(err);
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
        //todo:  Check to see that the initial position makes sense given the grid size 
      } else if(i == fileArray.length-1){
        fileObj['directions'] = fileArray[i].split('');
        //todo: Validate the directions 
        //todo: validate that the last row contains directions 
      } else {
        fileObj['dirtLocations'].add(fileArray[i]);
        //todo: Check to see that the locations make sense given the grid size 
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

