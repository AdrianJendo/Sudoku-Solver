import { useEffect, useState } from 'react';
import {generateSudoku, checkSolution} from './sudoku/sudoku';
import {SudokuBoard} from './components/SudokuBoard';
import './App.css';
import { GridOptions } from './components/gridOptions';



function App() {

  const [sudoku, setSudoku] = useState([]);
  const [reset, setReset] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [secondFileUploaded, setSecondFileUploaded] = useState(false);

  useEffect( () => {
    //setSudoku(generateSudoku(0));
  }, []);

  const updateTime = (elapsed) => {
    //We can use this approach since time is not nested in the state object
    setSudoku(prevState => {
      return{...prevState, time : elapsed}
    })
  }

  const resetBoard = () => {
    setSudoku(generateSudoku(selectedFile));
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
    if(!sudoku.solved){
      const solved = checkSolution(sudoku, e);
      if (solved){
        setSudoku(prevState => {return{...prevState, solved:true}})
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
      if(!sudoku.solved){
        setSudoku(prevState => {return{...prevState, solved:true, solveByAlgo:true}});
        //console.log(sudoku)
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
      if (fileUploaded){
        setSecondFileUploaded(false);
      }
      
    }
  }

  const onClickHandler = () => {  
    if(selectedFile !== null){
      let s = generateSudoku(selectedFile);
      if(s){
        setSudoku(s);
        setFileUploaded(true);
        setSecondFileUploaded(true);
      }
      else{
        alert('Please upload a valid sudoku grid')
      }
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
        secondFileUploaded = {secondFileUploaded} 
        onClickHandler={onClickHandler}
        reset = {reset}
      />
      {selectedFile !== null && fileUploaded && <SudokuBoard sudoku = {sudoku} onChange={handleChange} updateTime={updateTime} resetBoard = {resetBoard}/>} 
      {selectedFile !== null && fileUploaded && !sudoku.solved && <button className='solve_sudoku button' onClick={solveSudoku}>Solve</button>}
    </div>
  );
}

export default App;
