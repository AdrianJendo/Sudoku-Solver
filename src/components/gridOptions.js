import React from 'react';

export function GridOptions(props) {
    
    const {fileUploadHandler, 
        selectedFile, 
        fileUploaded, 
        secondFileUploaded, 
        onClickHandler,
        reset} = props;


    return (
        <div className = 'grid-options'>
            {reset && <div>
                <input type="file" className = "input-file" id="file" accept = ".txt" onChange={fileUploadHandler}/>
                <label className = "button" htmlFor="file">Upload a sudoku grid</label>

                &nbsp;&nbsp;&nbsp;

                {selectedFile !== null && !fileUploaded && <button type="button" className="button" onClick={onClickHandler}>Upload</button>}
                {selectedFile !== null && fileUploaded && !secondFileUploaded && <button type="button" className="button" onClick={onClickHandler}>Update</button>}

                {selectedFile == null && <button className="button" > Create Grid </button>}
            </div>}
            {!reset && <button>Reset</button>}
            
            
      </div>
    );
}