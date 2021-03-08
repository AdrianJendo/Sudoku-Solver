const deepCopy = (arr) => {
    let copy = [];
    arr.forEach(elem => {
      if(Array.isArray(elem)){
        copy.push(deepCopy(elem))
      }else{
        copy.push(elem)
      }
    })
    return copy;
}

function isError(solution, row, col) {
    let unavailable = new Array(solution[0].length+1).fill(false); //declare length plus 1 since possible sudoku values are 1-9

    //handle left-right check
    for (let i=0;i<solution[0].length;i++) {
        if (unavailable[solution[row][i]] && solution[row][i]!==0) {//while traversing, if there is a value that is repeated (other than 0)...
            return true; //return true (meaning that there is an error)
        }
        unavailable[solution[row][i]] = true; //if the value is still available (meaning the if statement is false), make it unavailable
    }
    
    unavailable = new Array(solution[0].length+1).fill(false); 
    
    //handle up-down check
    for (let i=0; i<solution.length; i++) { 
        if (unavailable[solution[i][col]] && solution[i][col]!==0){ //if a non-zero value is repeated...
            return true; //return true (error)
        }
        unavailable[solution[i][col]] = true;
    }
    
    unavailable = new Array(solution[0].length+1).fill(false);
    
    //check 3x3 boxees
    let topleftx = Math.floor(col/3)*3; //clever integer division to always start at top left corner of 3x3 square
    let toplefty = Math.floor(row/3)*3;
    for (let i = 0; i<3; i++) {
        for (let j = 0; j<3; j++) { //nested for to traverse the 3x3 square and check for error
            if (unavailable[solution[topleftx+i][toplefty+j]] && solution[topleftx+i][toplefty+j]!==0){
                return true;
            }
            unavailable[solution[topleftx+i][toplefty+j]] = true;
        }
    }
    
    return false; //if everything is satisfied and there is no error, return false.
}

  
export function solveSudoku(grid) {
    //copy of original grid to do solution
    let start = new Date();
    let solution = deepCopy(grid);
    

    //variable stuff
    let count = 0;
    let countdir = 1; //this one determines direction to check (so if there is an error you start moving back and not forward
    let boardsize = grid.length;
    
    while(count<(boardsize*boardsize)){
        if (count === -1){
            //alert('Sudoku not solvable')
            //console.log('Sudoku not solvable');
            //break;
            return null;
        }

        if ((new Date() - start)/1000 > 7){
            alert('Timeout');
            return null;
        }

        //determines position of board
        let row = Math.floor(count/boardsize);
        let col = count%boardsize;

        if(grid[row][col] !== 0 && countdir === 1){
            count++;
        }
        else if (grid[row][col] !== 0 && countdir === -1){
            count--;
        }
        else {
            solution[row][col]++; //increase the value of empty space by one and perform check (remember starts at 0)
				
            if(solution[row][col] > boardsize){ // if the value is greater than boardsize (9) then one of the previous values must be wrong so...
                solution[row][col] = 0; // we reset it to 0...
                count--; // ...move one index back on the board...
                countdir = -1; // ... and we set countdir to -1 so we move backwards (and skip over preset values in the correct direction)
            }
            else if(!isError(solution, row, col)){ //method checks to see if the value is valid on the solution board
                count++; // if there is no error, then we can move onto the next index...
                countdir = 1; // and make sure countdir is 1 so we move in the right direction
            }
        }
    }

    return solution;
}