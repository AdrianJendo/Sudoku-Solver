import React, { useEffect, useState } from 'react';

export function Timer(props) {

    const [timeInfo, setTimeInfo] = useState({timerStart:new Date(), prevPause: 0, elapsed: 0, isActive: false})
    const {time, updateTime} = props;

    //Logic for pause/unpausing 
    const toggle = () => {
        let temp = timeInfo.isActive
        setTimeInfo(prevState => {return {...prevState, isActive:!temp}}); //update pause/start
        if(temp){ //if previously active (ie: now paused)
            let time = (new Date() - timeInfo.timerStart + timeInfo.prevPause); //time active in milliseconds
            let time2 = Math.floor(time/1000); //time active in seconds
            setTimeInfo(prevState => {return{...prevState, prevPause:time, elapsed:time2}}); //update the time of pause and current time to display (in seconds)
            updateTime(time2); //update time to display in results (need to pass time info up props)
        }
        else{
            setTimeInfo(prevState => {return{...prevState, timerStart: new Date()}}); //continue counting on the timer
        }
    }

    //Reset timer
    const reset = () => {
        setTimeInfo(prevState => {return{...prevState, elapsed:0, prevPause:0, isActive:false}});
        updateTime(0);
    }

    //Call whenever time, updatetime, or timeinfo updated
    useEffect( () => {
        let interval = null;
        if(timeInfo.isActive) {
            //Count if timer is active -- keep track of elapsed time on the cycle
            interval = setInterval( () => {
                let time = Math.floor((new Date() - timeInfo.timerStart + timeInfo.prevPause)/1000);
                setTimeInfo(prevState => {return{...prevState, elapsed:time}});
                updateTime(time);
            }, 10);
        }
        /*
        else if (!timeInfo.isActive && timeInfo.elapsed !==0){
            clearInterval(interval);
        }*/
        //stops the timer if isActive changes
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
                <button className={`button button-primary-${timeInfo.isActive ? 'active' : 'inactive'}`} onClick={toggle}> {/* 2nd class name not used and can be deleted */}
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