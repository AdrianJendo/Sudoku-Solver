import React from 'react';
import {SudokuField} from "./SudokuField";
import {Timer} from "./Timer";
import {Result} from "./Result";

export function SudokuBoard(props) {
    const {sudoku, onChange, onReset} = props;

    //console.log(sudoku.solvedTime)
    //cannot render objects... must break down to smallest components
    return (
        <div>
            {!sudoku.solvedTime && <Timer time = {sudoku.count} onReset = {onReset}/>}
            {sudoku.solvedTime && <Result sudoku = {sudoku}/>}
            {sudoku.length !== 0 && sudoku.rows && sudoku.rows.map(row => (
                    <div className = 'row' key = {row.index}>
                        {row.cols.map(field => (
                            <SudokuField field = {field} key={field.col} onChange = {onChange}/>
                        ))}
                    </div>
                )
                )}
        </div>
    );
}