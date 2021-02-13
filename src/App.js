import { useEffect, useState } from 'react';
import {generateSudoku, checkSolution} from './sudoku/sudoku';
import {SudokuBoard} from './components/SudokuBoard';
import './App.css';


function App() {

  const [sudoku, setSudoku] = useState([]);

  useEffect( () => {
    setSudoku(generateSudoku())
  }, []);

  const updateTime = (via) => {
    //We can use this approach since solvedTime is not nested in the state object
    setSudoku(prevState => {
      return{...prevState, solvedTime : via}
    })
  }

  const handleReset = (e) => {    
    setSudoku(prevState => {
      return{...prevState, time : 0 }
    })
  }

  const handleChange = (e) => {    
    //https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/#howtoupdatestateinanestedobjectinreactwithhooks
    //This method is required for nested objects
    //We create an additional item in the state object < sudoku : {sudoku : value } > but this is neccessary since we need to do multiple nests
    setSudoku(prevState => ({
      ...prevState,     //copy all other fields/objects
      sudoku: {         //recreate the object that contains the field to update
        ...prevState.sudoku,  //copy all the fields of the object
        value: prevState.rows[e.row].cols[e.col].value = e.value //overwrite the value of the field to update
      }
    }));


    if(!sudoku.solvedTime){
      const solved = checkSolution(sudoku, e);
      if (solved){
        updateTime(new Date());
      }
    }
  }

  const solveSudoku = (e) => {
    if(sudoku.solution !== null){
      setSudoku(prevState => ({
        ...prevState,
        sudoku: {
          ...prevState.sudoku,
          value: prevState.rows.forEach((row) => row.cols.forEach((col) => {
            if(col.readonly === false) {
              col.value = prevState.solution[col.row][col.col]
            }
          }))
        }
      }))
      console.log(sudoku)
      if(!sudoku.solvedTime){
        updateTime(new Date());
        sudoku.solveByAlgo = true;
        console.log(sudoku)
      }
    }
    else{
      setSudoku(prevState => ({
        ...prevState,
        sudoku: {
          ...prevState.sudoku,
          value: prevState.rows.forEach((row) => row.cols.forEach((col) => {
            col.value = -1
          }))
        }
      }))
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {sudoku.solution !== null ? <h1>Sudoku Solver</h1> :<h1>Not Solvable</h1>  }
      </header>
      <SudokuBoard sudoku = {sudoku} onChange={handleChange} onReset = {handleReset}/>
      <button className='solve_sudoku' onClick={solveSudoku}>Solve</button>
    </div>
  );
}

export default App;
