const fs = require('fs');

function isInvalidLocation(gridSize, location){
/*
 * This function takes in one of the locations of the dirt piles and
 * and checks if it is within the bounds of the grid dimensions.
 */

  var locationX = parseInt(location[0]);
  var locationY = parseInt(location[1]);

  var gridXMax = parseInt(gridSize[0])-1;
  var gridYMax = parseInt(gridSize[1])-1;

  if(locationX > gridXMax || locationY > gridYMax){
    return true;
  } else {
    return false;
  }
}

function processFile(){
/*
 * This function takes in the name of the file containing the data from the
 * command line and processes that file.
 *
 * It populates the fileObj, the main object in which the contents of the file are stored.
 * The fileObj contains the following fields:
 *
 * gridSize, which contains the size of the grid
 * initialPosition, which contains the starting position of the Roomba
 * dirtLocations, a Set containing the locations of every dirt pile within the grid
 * directions, which contains a list of all the directions that the Roomba will take to move about the room
 *
 * The function also calls the function isInvalidLocation to validate the locations of the initial position
 * and dirt patches.
 *
 * It then returns the file object for use later in the program.
 */

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
      if(isInvalidLocation(fileObj['gridSize'], fileObj['initialPosition'])){
        throw new Error('the initial position of the Roomba is outside the bounds of the room.');
      }
    } else if(i == fileArray.length-1){
      fileObj['directions'] = fileArray[i].split('');

    } else {
      if(isInvalidLocation(fileObj['gridSize'], fileArray[i].split(' '))){
        throw new Error('dirt patch is outside the bounds of the grid.');
      } else{
        fileObj['dirtLocations'].add(fileArray[i]);
      }
    }
  }

  return fileObj;
}

function cleanRoom(inputObj) {
/*
 * This function takes in the object resulting from processing the file.
 *
 * It prints out the size of the grid and prints out the initial position of the roomba
 * before printing following the directions to move the Roomba around the grid and clean up dirt piles.
 *
 * Once the Roomba has completed the directions, this function prints out the final position of the Roomba
 * and the number of dirt patches cleaned up along the way.
 *
 * This function also validates the directions and throws an error if there are any directions outside of N, S, E, W
 */

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
      throw new Error('Roomba can only accept N, S, E, and W as valid directions.');
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
