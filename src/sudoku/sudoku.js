import {solveSudoku} from '../components/SudokuSolver'

export function generateSudoku() {
  
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
    ];
    const result = { 
      rows: [], 
      solution : solveSudoku(grid),
      startTime: new Date(),
      count: 0,
      solvedTime: null,
      solveByAlgo: false
    };
  
    for (let i=0; i<9; ++i){
      const row = { cols : [], index : i}
      for(let j=0; j<9; ++j){
        const value = grid[i][j];
        const col = {
          row: i,
          col: j,
          value: value,
          readonly: value !== 0,

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


  