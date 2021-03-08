import React, { useEffect, useState } from 'react';

export function Timer(props) {

    const [timeInfo, setTimeInfo] = useState({timerStart:new Date(), prevPause: 0, elapsed: 0, isActive: false})
    const {time, updateTime} = props;

    const toggle = () => {
        let temp = timeInfo.isActive
        setTimeInfo(prevState => {return {...prevState, isActive:!temp}});
        if(temp){
            let time = (new Date() - timeInfo.timerStart + timeInfo.prevPause);
            let time2 = Math.floor(time/1000);
            setTimeInfo(prevState => {return{...prevState, prevPause:time, elapsed:time2}});
            updateTime(time2);
        }
        else{
            setTimeInfo(prevState => {return{...prevState, timerStart: new Date()}});
        }
    }

    const reset = () => {
        setTimeInfo(prevState => {return{...prevState, elapsed:0, prevPause:0, isActive:false}});
        updateTime(0);
    }

    useEffect( () => {
        let interval = null;
        if(timeInfo.isActive) {
            interval = setInterval( () => {
                let time = Math.floor((new Date() - timeInfo.timerStart + timeInfo.prevPause)/1000);
                setTimeInfo(prevState => {return{...prevState, elapsed:time}});
                updateTime(time);
            }, 10);
        }
        else if (!timeInfo.isActive && timeInfo.elapsed !==0){
            clearInterval(interval);
        }
        return () => clearInterval(interval)
    }, [time, updateTime, timeInfo]);


    /*
    const resetStyle = {
        opacity: timeInfo.elapsed === 0 ? '0.6' : '1', 
        cursor: timeInfo.elapsed === 0 ? 'not-allowed' : 'pointer'
    };
    */
    
    return (
        <div>
            <h2>Time: {timeInfo.elapsed}s </h2>
            <div className="row" style = {{marginBottom: "5px"}}>
                <button className={`button button-primary button-primary-${timeInfo.isActive ? 'active' : 'inactive'}`} onClick={toggle}>
                    {timeInfo.isActive ? 'Pause' : 'Start'}
                </button>

                &nbsp;&nbsp;&nbsp;

                <span className={timeInfo.elapsed===0 ? 'not-allowed' : ''}>
                    <button className={timeInfo.elapsed===0 ? 'button unclickable' : 'button'} onClick={reset}>
                        Reset
                    </button>
                </span>

            </div>
        </div>
    );

}