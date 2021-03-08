import React from 'react';

function handleChange(e, field, onChange) {
    const temp = e.target.value.length;
    const value = e.value === "" ? null : parseInt(e.target.value[temp-1], 10);
    onChange({...field, value : value});
};

export function SudokuField(props) {
    const {field, solved, onChange} = props;

    const style = field.given ? {color:'#222'} : solved ? field.zero ? {color:"#008CBA"} : field.correct ? {color:'#32CD32'} : {color:'#FF0000'} : {};

    if(field.top_left){
        return (
            <input 
                className = "field top_left" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    else if(field.top_mid){
        return (
            <input 
                className = "field top_mid" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    else if(field.top_right){
        return (
            <input 
                className = "field top_right" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    else if(field.top_right_end){
        return (
            <input 
                className = "field top_right_end" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    else if(field.mid_left){
        return (
            <input 
                className = "field mid_left" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    else if(field.mid_right_end){
        return (
            <input 
                className = "field mid_right_end" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    else if(field.bottom_left){
        return (
            <input 
                className = "field bottom_left" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    else if(field.bottom_mid){
        return (
            <input 
                className = "field bottom_mid" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    else if(field.bottom_right){
        return (
            <input 
                className = "field bottom_right" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    else if(field.bottom_right_end){
        return (
            <input 
                className = "field bottom_right_end" 
                //maxLength = '1'
                value = {field.value || ""} 
                readOnly={field.readonly}
                style = {style}
                onChange={(e) => handleChange(e, field, onChange)}
            />
        )
    }
    return (
        <input 
            className = "field" 
            //maxLength = '1'
            value = {field.value || ""} 
            readOnly={field.readonly}
            style = {style}
            onChange={(e) => handleChange(e, field, onChange)}
        />
    );
}