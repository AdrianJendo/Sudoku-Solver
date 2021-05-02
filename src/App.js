import { useEffect, useState, useRef } from 'react';
import {generateSudoku, checkSolution, create_grid} from './sudoku/sudoku';
import {SudokuBoard} from './components/SudokuBoard';
import './App.css';
import { GridOptions } from './components/GridOptions';
import {solveSudoku } from './components/SudokuSolver';


//Min number of values for user-created grid
const MIN_GRID_VALUES = 17;

function App() {
  //For managing user sudoku
  const grid = useRef([]); //Used to correctly update count of elements on grid
  const userSudokuValues = useRef(0); //Count of elements on grid
  const [userSudoku, setUserSudoku] = useState([]);
  const [userSudokuSolution, setUserSudokuSolution] = useState([]);
  //Normal sudoku related states
  const [sudoku, setSudoku] = useState([]);
  const [reset, setReset] = useState(true);
  //File upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  /*
  //run only once on render
  useEffect( () => {
  }, []);
  */

  //Update time continuously in case sudoku gets solved
  const updateTime = (elapsed) => {
    //time not nested in state so can update sudoku state like this
    setSudoku(prevState => {
      return{...prevState, time : elapsed}
    })
  }

  //Reset board after solving
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

  //Updates the board after user input
  const handleChange = (e) => {    
    e.value = isNaN(e.value) ? 0 : e.value;

    //https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/#howtoupdatestateinanestedobjectinreactwithhooks
    //Nested objects must be updated like this
    //We create an additional item in the state object {...all_the_other_propertyies, sudoku : {value : new_value } } but this is neccessary since we need to do multiple nests
    setSudoku(prevState => ({
      ...prevState,     //copies the previous values of sudoku
      sudoku: {         //recreate the object that contains the field to update
        //...prevState.sudoku,  //copy all the fields of the object <- only required if there are other fields in the nested object
        value: prevState.rows[e.row].cols[e.col].value = e.value, //overwrite the value of the field to update
        //and assignment operator in "prevState.rows[e.row].cols[e.col].value = e.value" immediately updates the value of the grid in state
        //if console.log(sudoku) at the bottom of this function, the grid will show the immediate value while the sudoku : {value:new_value} will be one iteration behind
      }
    }));
    if(!sudoku.solved){
      const solved = checkSolution(sudoku, e);
      if (solved){
        setSudoku(prevState => ({
          ...prevState,
          solved:true,
          sudoku: {
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
    //console.log(sudoku);
  }


  //Updates user board while creating new grid
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
      ...prevState,     
      event: {
        value: prevState.rows[e.row].cols[e.col].value = e.value, 
        e_row: e.row,
        e_col : e.col
      }
    }));
  }

  // whenever new value is added to grid
  useEffect(() => {
    if(userSudoku.rows && grid.current.length > 0 && userSudoku.event){
      //Update the number of elements in the grid
      //Need to account for changing/spamming the same value in the same space <-- only increment / decrement count if below conditions are true
      const updateCount = (grid.current[userSudoku.event.e_row][userSudoku.event.e_col] === userSudoku.event.value) || 
                          (grid.current[userSudoku.event.e_row][userSudoku.event.e_col] > 0 && userSudoku.event.value !== 0) ? false : true;
      
      if(updateCount){
        if(userSudoku.event.value !== 0){
          userSudokuValues.current += 1;
        }
        else{
          userSudokuValues.current -= 1;
        }
      }

      //Only allow user to submit sudoku if exceeds min amount
      if(userSudokuValues.current >= MIN_GRID_VALUES){
        grid.current[userSudoku.event.e_row][userSudoku.event.e_col] = userSudoku.event.value; //Must update grid.current before trying solution
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
  

  //Solve sudoku when solve button pressed
  const solveSudokuGrid = () => {
    if(sudoku.solution !== null){
      setSudoku(prevState => ({
        ...prevState,
        sudoku: {
          value: prevState.rows.forEach((row) => row.cols.forEach((col) => { //Traverse through each grid space and set to readonly and set properties (ie: readOnly and colour of text)
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
    }
    else{ //Code should never reach here but just in case
      setSudoku(prevState => ({
        ...prevState,
        solved:true,
        sudoku: {
          value: prevState.rows.forEach((row) => row.cols.forEach((col) => {
            col.value = -1
            col.correct = false;
            col.readonly = true;
          }))
        }
      }))
    }
  }

  //Handle file upload
  const fileUploadHandler = (e) => {
    const file = e.target.files[0];
    let fileReader = new FileReader();
    try{
      fileReader.readAsText(file);
      setFileName(file.name);
    }
    catch{}
    fileReader.onloadend = (e) => {
      const content = e.target.result;
      setSelectedFile(content);
    }
  }

  //Handles when user clicks 'Upload' for file upload
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

  //Handle when user wants to create new board
  const handleUserReset = () => {
    setReset(true);
    setSelectedFile(null);
    setFileName(null);
    setFileUploaded(false);
    setUserSudoku([]);
    userSudokuValues.current = 0;
    setUserSudokuSolution([]);
  }

  //Handles user grid actions (create/reset, upload)
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
      <header className={!fileUploaded || !(sudoku.solution === null && selectedFile) ? "App-header" : "App-header fail"}>
        {!fileUploaded || !(sudoku.solution === null && selectedFile) ? <h1>Sudoku Solver</h1> :<h1>Not Solvable</h1>  }
      </header> 
      
      <GridOptions 
        fileUploadHandler = {fileUploadHandler} 
        selectedFile = {selectedFile} 
        fileName = {fileName}
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
      <span className={sudoku.solution === null ? 'not-allowed' : ''}>
        {(selectedFile !== null || userSudokuSolution) && fileUploaded && !sudoku.solved && 
          <button className={sudoku.solution === null ? 'solve_sudoku button unclickable' : 'solve_sudoku button'} onClick={solveSudokuGrid}>Solve</button>
        }         
      </span>
    </div>
  );
}

export default App;
