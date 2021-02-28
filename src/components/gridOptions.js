import React from 'react';

export function GridOptions(props) {
    
    const {fileUploadHandler, 
        selectedFile, 
        fileUploaded, 
        onClickHandler,
        reset,
        handleReset,
        handleUserGrid,
        userSudoku,
        userSudokuSolvable} = props;


    return (
        <div className = 'grid-options'>
            {reset && !userSudoku && <div>
                <input type="file" className = "input-file" id="file" accept = ".txt" onChange={fileUploadHandler}/>
                <label className = "button" htmlFor="file">Upload a sudoku grid</label>

                &nbsp;&nbsp;&nbsp;

                {selectedFile !== null && !fileUploaded && <button type="button" className="button" onClick={onClickHandler}>Upload</button>}
                {selectedFile === null && <button className="button" onClick = {() => handleUserGrid('create')}> Create Grid </button>}
            </div>}
            {!reset && <button className='button' onClick = {handleReset}>New Grid</button>}
            {userSudoku && <div style = {{padding: '15px 32px'}}>
                <button className="button" onClick = {handleReset}> Back to Options </button>
                &nbsp;&nbsp;&nbsp;
                <button className="button" onClick = {() => handleUserGrid('reset')}> Reset Board </button>
                &nbsp;&nbsp;&nbsp;
                <span className={!userSudokuSolvable ? "not-allowed":""}>
                    <button className={!userSudokuSolvable ? "button unclickable":"button"} onClick = {() => handleUserGrid('upload')}> 
                        Upload 
                    </button>
                </span>
                
            </div>}
            
            
      </div>
    );
}