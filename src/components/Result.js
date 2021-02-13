import React from 'react';

export function Result(props) {
    const {sudoku} = props;
    
    if(sudoku.solveByAlgo){
        const elapsed = Math.floor((sudoku.solvedTime.getTime() - sudoku.startTime.getTime()) / 1000);
        return <h2>Sudoku solved via algorithm, {elapsed}s</h2>
        
    }
    const elapsed = Math.floor((sudoku.solvedTime.getTime() - sudoku.startTime.getTime()) / 1000);
    return (
        <h2>Sudoku solved in {elapsed} seconds</h2>
    );
}

