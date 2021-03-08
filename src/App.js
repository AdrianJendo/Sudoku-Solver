import { useEffect, useState, useRef } from 'react';
import {generateSudoku, checkSolution, create_grid} from './sudoku/sudoku';
import {SudokuBoard} from './components/SudokuBoard';
import './App.css';
import { GridOptions } from './components/GridOptions';
import {solveSudoku } from './components/SudokuSolver';


const MIN_GRID_VALUES = 17;

function App() {

  const grid = useRef([]);
  const userSudokuValues = useRef(0);
  const [sudoku, setSudoku] = useState([]);
  const [userSudoku, setUserSudoku] = useState([]);
  const [userSudokuSolution, setUserSudokuSolution] = useState([]);
  const [reset, setReset] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  /*
  //run only once on render
  useEffect( () => {
  }, []);
  */

  //Keep updating the time in case the sudoku gets solved
  const updateTime = (elapsed) => {
    //We can use this approach since time is not nested in the state object
    setSudoku(prevState => {
      return{...prevState, time : elapsed}
    })
  }

  const resetBoard = () => {
    if(selectedFile){
      setSudoku(generateSudoku(selectedFile));
    }
    else if (userSudokuSolution && grid){
      setSudoku(create_grid(grid.current, true, userSudokuSolution));
    }
    else{
      alert('Error Resetting the grid');
    }
  }

  const handleChange = (e) => {    
    e.value = isNaN(e.value) ? 0 : e.value;

    //https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/#howtoupdatestateinanestedobjectinreactwithhooks
    //This method is required for nested objects
    //We create an additional item in the state object < sudoku : {sudoku : value } > but this is neccessary since we need to do multiple nests
    setSudoku(prevState => ({
      ...prevState,     //copy all other fields/objects
      sudoku: {         //recreate the object that contains the field to update
        ...prevState.sudoku,  //copy all the fields of the object
        value: prevState.rows[e.row].cols[e.col].value = e.value, //overwrite the value of the field to update
        //This is a cheeky way to update the state. "...prevState.sudoku" copies the previous state of sudoku
        //and assignment operator : "prevState.rows[e.row].cols[e.col].value = e.value" updates the vaue we want in state 
        //-> this is the reason that console.log(sudoku) at the bottom will display the updated sudoku. (notice how the 'value:' field is one iteration behind)
        //Creating a new 'value' field is a bi-product of updating state this way

      }
    }));
    if(!sudoku.solved){
      const solved = checkSolution(sudoku, e);
      if (solved){
        setSudoku(prevState => ({
          ...prevState,
          solved:true,
          sudoku: {
            ...prevState.sudoku,
            value: prevState.rows.forEach((row) => row.cols.forEach((col) => {
              if(col.readonly === false) {
                col.readonly=true;
                col.correct = true;
              }
            }))
          }
        }));          
      }
    }
    
  }


  const handleUserChange = (e) => {
    e.value = isNaN(e.value) ? 0 : e.value;

    let g = [];
    for(let i =0; i<userSudoku.rows.length; ++i){
      const arr = [];
      for(let j = 0; j<userSudoku.rows[0].cols.length; j++){
        arr.push(userSudoku.rows[i].cols[j].value);
      }
      g.push(arr);
    }
    grid.current = g;

    setUserSudoku(prevState => ({
      ...prevState,     //copy all other fields/objects
      event: {
        value: prevState.rows[e.row].cols[e.col].value = e.value, 
        e_row: e.row,
        e_col : e.col
      }
    }));

  }

  useEffect(() => {
    if(userSudoku.rows && grid.current.length > 0 && userSudoku.event){
      const updateCount = (grid.current[userSudoku.event.e_row][userSudoku.event.e_col] === userSudoku.event.value) || (grid.current[userSudoku.event.e_row][userSudoku.event.e_col] > 0 && userSudoku.event.value !== 0) ? false : true;
      
      grid.current[userSudoku.event.e_row][userSudoku.event.e_col] = userSudoku.event.value;
      if(updateCount){
        if(userSudoku.event.value !== 0){
          userSudokuValues.current += 1;
        }
        else{
          userSudokuValues.current -= 1;
        }
      }

      if(userSudokuValues.current >= MIN_GRID_VALUES){
        let solution = solveSudoku(grid.current);
        if(solution){
          setUserSudokuSolution(solution);
        }
        else{
          setUserSudokuSolution([]);
        } 
      }
      else{
        setUserSudokuSolution([]);
      } 
      
    }
  }, [userSudoku]);
  

  const solveSudokuGrid = (e) => {
    if(sudoku.solution !== null){
      setSudoku(prevState => ({
        ...prevState,
        sudoku: {
          ...prevState.sudoku,
          value: prevState.rows.forEach((row) => row.cols.forEach((col) => {
            if(col.readonly === false) {
              const temp = col.value;
              col.value = prevState.solution[col.row][col.col];
              col.readonly=true;
              col.correct = prevState.solution[col.row][col.col] === temp;
              col.zero = temp === 0;
            }
          }))
        },
        solved:true, 
        solveByAlgo:true
      }))
      //if(!sudoku.solved){
      //  setSudoku(prevState => {return{...prevState, solved: true, solveByAlgo:true}});
      //}
    }
    else{
      setSudoku(prevState => ({
        ...prevState,
        sudoku: {
          ...prevState.sudoku,
          value: prevState.rows.forEach((row) => row.cols.forEach((col) => {
            col.value = -1
            col.correct = false;
          }))
        }
      }))
    }
  }

  const fileUploadHandler = (e) => {
    const file = e.target.files[0];
    let fileReader = new FileReader();
    try{
      fileReader.readAsText(file);
    }
    catch{}
    fileReader.onloadend = (e) => {
      const content = e.target.result;
      setSelectedFile(content);
    }
  }

  const onClickHandler = () => {  
    if(selectedFile !== null){
      let s = generateSudoku(selectedFile);
      if(s){
        setSudoku(s);
        setFileUploaded(true);
        setReset(false);
      }
      else{
        alert('Please upload a valid sudoku grid')
      }
    }
  }

  const handleUserReset = () => {
    setReset(true);
    setSelectedFile(null);
    setFileUploaded(false);
    setUserSudoku([]);
    userSudokuValues.current = 0;
    setUserSudokuSolution([]);
  }

  const handleUserGrid = (input) => {
    if(input === 'create' || input === 'reset') {
      const temp_grid = '0'.repeat(81); //Create an array of 0s so that the user can insert the values they want
      const sudoku = generateSudoku(temp_grid, true);
      setUserSudoku(sudoku);
      userSudokuValues.current = 0;
    }
    else if (input === 'upload'){
      setSudoku(create_grid(grid.current, true, userSudokuSolution));
      setFileUploaded(true);
      setReset(false);
      setUserSudoku([]);
    }
  }

  return (
    <div className="App" style = {{marginBottom : "60px"}}>
      <header className="App-header">
        
        {sudoku.solution !== null ? <h1>Sudoku Solver</h1> :<h1>Not Solvable</h1>  }
      </header>
      <GridOptions 
        fileUploadHandler = {fileUploadHandler} 
        selectedFile = {selectedFile} 
        fileUploaded = {fileUploaded} 
        onClickHandler={onClickHandler}
        reset = {reset}
        handleReset = {handleUserReset}
        handleUserGrid = {handleUserGrid}
        userSudoku = {userSudoku.length !== 0}
        userSudokuSolvable = {userSudokuSolution.length !== 0}
        MIN_GRID_VALUES = {MIN_GRID_VALUES}
        count = {userSudokuValues.current}
      />
      {userSudoku.length !== 0 && <SudokuBoard sudoku = {userSudoku} onChange = {handleUserChange}/>}
      {(selectedFile !== null || userSudokuSolution) && fileUploaded && <SudokuBoard sudoku = {sudoku} onChange={handleChange} updateTime={updateTime} resetBoard = {resetBoard}/>} 
      {(selectedFile !== null || userSudokuSolution) && fileUploaded && !sudoku.solved && <button className='solve_sudoku button' onClick={solveSudokuGrid}>Solve</button>}
    </div>
  );
}

export default App;
