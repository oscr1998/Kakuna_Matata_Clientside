import React, { useState, useEffect } from 'react'
import './style.css'

export default function Timer() {
  const [time, setTime] = useState();
  const [timeGuess, setTimeGuess] = useState();

var timeleft = 7
  useEffect(()=>{
    setTime(7)
    let quizTimer = setInterval(function(){
      setTime(prev => prev-1);
      timeleft -= 1
      console.log(timeleft)
      if(timeleft=== 0){
        setTime(7)
        timeleft = 7
        console.log("please")
      }
    }, 1000)
    return () => clearInterval(quizTimer)
  },[])

var timeToGuess = 5
  useEffect(()=>{
    setTimeGuess(5)
    let guessTimer = setInterval(function(){
      timeToGuess -= 1
      setTimeGuess(prev => prev-1)
      if(timeToGuess===-2){
        setTimeGuess(5)
        timeToGuess = 5
      }
    }, 1000)
    return () => clearInterval(guessTimer)
  },[])

  return (
    <>
      <div className="round-time-bar">
        <div className='timerCounter'>
          <h2>Time left of round:{time}</h2>
        </div>
        <div className='timeLeft'>
          <progress id="countdown" className="nes-progress is-primary" value={timeGuess} max="5"></progress>
        </div>
      </div>

    </>
  )
}
