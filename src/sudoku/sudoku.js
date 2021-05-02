import {solveSudoku} from '../components/SudokuSolver'

//Creates sudoku grid (2d array structure to handle logic). Parameters allow to pass in a premade solution as well as boolean for usergenerated
export function create_grid(grid, userGenerated, solution = null) {
  const result = { 
    rows: [], 
    solution : !userGenerated ? solveSudoku(grid) : solution ? solution : null,
    time: 0,
    solved: false,
    solveByAlgo: false
  };

  //Create 9x9 grid and pass grid values into results[rows]
  for (let i=0; i<9; ++i){
    const row = { cols : [], index : i}
    for(let j=0; j<9; ++j){
      const value = grid[i][j];
      const readonly = (!userGenerated || solution) && value !== 0;
      const col = {
        row: i,
        col: j,
        value: value,
        readonly: readonly,
        
        given : readonly, //want to initialize given and readOnly separately because readonly will get updated when sudoku is solved
        correct : false,
        zero : false,

        top_left : i%3===0 && j%3===0,
        top_mid : i%3===0 && j%3===1,
        top_right : i%3===0 && j%3===2 && j!==8,
        top_right_end: i%3===0 && j===8,

        mid_left : (i%3===1 && j%3===0) || (i%3===2 && j%3===0 && i!==8),
        mid_right_end : (i%3===1 && j===8) || (i%3===2 && j===8 && i!==8),

        bottom_left : i===8 && j%3===0,
        bottom_mid : i===8 && j%3===1,
        bottom_right : i===8 && j%3===2 && j!==8,
        bottom_right_end : i===8 && j===8,
      };
      row.cols.push(col);
    }
    result.rows.push(row);
  }
  return result;
}

//Takes string (from text file) and converts to 2d grid to pass into create sudoku grid function
export function generateSudoku(text, userGenerated = false) {
  
  let temp_grid = String(text).replace(/\s/g, '').split(""); //splits elements by space
  temp_grid = temp_grid.map(el => parseInt(el));
  
  if (temp_grid.length === 81 && temp_grid.every(el => el < 10 && el >= 0)){    
    const grid = [];
    while (temp_grid.length) grid.push(temp_grid.splice(0,9));
    /*
    const grid = [ 
      [ 0, 0, 9, 2, 0, 0, 0, 0, 3 ],
      [ 0, 7, 0, 0, 8, 0, 0, 6, 0 ],
      [ 3, 0, 0, 0, 0, 9, 7, 0, 0 ],
      [ 5, 0, 0, 0, 0, 2, 4, 0, 0 ],
      [ 0, 1, 0, 0, 3, 0, 0, 5, 0 ],
      [ 0, 0, 3, 7, 0, 0, 0, 0, 2 ],
      [ 0, 0, 5, 8, 0, 0, 0, 0, 1 ],
      [ 0, 2, 0, 0, 7, 0, 0, 9, 0 ],
      [ 6, 0, 0, 0, 0, 4, 3, 0, 0 ],
    ];*/
    
    return create_grid(grid, userGenerated);
  }
  
  return false;
}

//Check if current state of sudoku matches solution
export function checkSolution(sudoku, e) {
  let candidate = sudoku.rows.map((row) => row.cols.map((col) => col.value));
  candidate[e.row][e.col] = e.value;

  for (let i=0; i<candidate[0].length; i++){
    for(let j=0; j<candidate.length; j++ )
      if(candidate[i][j] === 0 || candidate[i][j] !== sudoku.solution[i][j]){
        return false;
      }
  }
  return true
}


  