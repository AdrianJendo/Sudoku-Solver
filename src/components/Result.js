import React from 'react';

export function Result(props) {
    const {sudoku, resetBoard} = props;
    const elapsed = (sudoku.time);

    return (
        <div>
            {sudoku.solveByAlgo ? <h2>Sudoku solved via algorithm, {elapsed} seconds</h2> : <h2>Sudoku solved in {elapsed} seconds</h2>}
            <button className="button" style = {{marginBottom: "5px"}} onClick={resetBoard}>Reset</button>
        </div>

    )
}

