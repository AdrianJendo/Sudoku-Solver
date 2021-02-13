import React, { useEffect, useState } from 'react';

export function Timer(props) {

    const [elapsed, setElapsed] = useState(0);
    const [isActive, setIsActive] = useState(false);

    function toggle() {
        setIsActive(!isActive);
      }
    
      function reset() {
        setElapsed(0);
        setIsActive(false);
      }

    useEffect( () => {
        let interval = null;
        if(isActive) {
            interval = setInterval( () => {
                setElapsed(elapsed => elapsed + 1);
                console.log(props.time)
            }, 1000);
        }
        else if (!isActive && elapsed !==0){
            clearInterval(interval);
        }
        return () => clearInterval(interval)
    }, [isActive, elapsed, props]);



    return (
        <div>
            <h2>Time: {elapsed} </h2>
            <div className="row">
                <button className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
                {isActive ? 'Pause' : 'Start'}
                </button>
                <button className="button" onClick={reset}>
                Reset
                </button>
            </div>
        </div>
    );

}