import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Timer, Choices } from '../../Components'
import './style.css'


import { useDispatch, useSelector } from 'react-redux';
import { setScore } from '../../Actions';
import { useNavigate } from "react-router-dom";

import incorrectMP3 from '../../Components/MusicPlayer/Sound/SFX/Mario_Fail.mp3'
import correctMP3 from '../../Components/MusicPlayer/Sound/SFX/Pokemon_Item_Correct.mp3'

import { SocketContext } from '../../App';

export default function Game() {
  const [sprite, setSprite] = useState("");
  const [spriteName, setSpriteName]=useState("");
  const [wrongChoice1, setWrongChoice1]=useState("");
  const [wrongChoice2, setWrongChoice2]=useState("");
  const [wrongChoice3, setWrongChoice3]=useState("");
  const [numOfRounds, setNumOfRounds]=useState(5);
  const [roundOver, setRoundOver]=useState(1);

  const user = useSelector(state => state)
  const room = useSelector(state => state.room)
  const score = useSelector(state => state.score)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const socket = useContext(SocketContext)

  async function fetchCorrectPokemon(i) {
    const fetchApi = `https://kakunamatata.herokuapp.com/pokemon/${i}`
    try {
        const apiData = await axios.get(fetchApi);
        const dataImage = await apiData.data.image
        const dataName = await apiData.data.name
        setSprite(dataImage)
        setSpriteName(dataName)
    } catch(err){ console.error(err)
      console.log("FAIL FAIL");
    }
  }

// Round limit
let randomNumber = Math.floor(Math.random()*151)
// start round
async function fetchWrongPokemon(i) {
    const fetchApi = `https://kakunamatata.herokuapp.com/pokemon/gen/${i}`
    try {
    const apiData = await axios.get(fetchApi);
    let {data} = await apiData
    const index = data.indexOf(spriteName)
    data.splice(index, 1)

    setWrongChoice1(data[Math.floor(Math.random()*data.length)])
    data.splice(data.indexOf(wrongChoice1), 1)

    setWrongChoice2(data[Math.floor(Math.random()*data.length)])
    data.splice(data.indexOf(wrongChoice2), 1)

    setWrongChoice3(data[Math.floor(Math.random()*data.length)])
    
    // console.log("wrong choices:", wrongChoice1, wrongChoice2, wrongChoice3)
    
  } catch(err){ console.error(err)
    console.log("FAIL FAIL");
  }
}

//generate question
useEffect(() => {
  fetchCorrectPokemon(randomNumber)
  let title = document.getElementById("pokeTitle")
  title.style.height= "60px"
  title.style.width= "500px"
  title.style.marginTop= "20px"
}, [numOfRounds])

useEffect(() => {
  fetchWrongPokemon(1)
}, [spriteName])

function sendScore(){
  dispatch({
    type: "SET_SCORE", payload:(100)
  })
  socket.emit('update-score', {score, room: room.code })
}

function checkAnswer(e){
  // console.log(e.target.value)
  // console.log(e.target.id)
  let button1 = document.getElementById("1")
  let button2 = document.getElementById("2")
  let button3 = document.getElementById("3")
  let button4 = document.getElementById("4")
  let pokeImg = document.getElementById("filteredImg")
  button1.disabled = true;
  button2.disabled = true;
  button3.disabled = true;
  button4.disabled = true;
  pokeImg.style.filter= "brightness(100%)"

  if(e.target.value == spriteName){
    let button = document.getElementById(e.target.id)
    button.style.backgroundColor = "#92CC41"
    sendScore()

    let correctDisplay = document.getElementById("correct")
    correctDisplay.style.display= "block"

    let answerbox = document.getElementById("parent")
    answerbox.style.display= "none"
    // new Audio(correctMP3).play()
  } else{
    let button = document.getElementById(e.target.id)
    button.style.backgroundColor = "#E76E55"

    let incorrectDisplay = document.getElementById("incorrect")
    incorrectDisplay.style.display= "block"

    let answerbox = document.getElementById("parent")
    answerbox.style.display= "none"
    // new Audio(incorrectMP3).play()
  }
  // console.log(score)
}
function randomize(arr) {
  var i, j, tmp;
  for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
  }
  return arr;
}
// Logic:
// game starts on load
// pokemon sprite and wrong answers generated on load
let roundTimer = 5;
let rounds = 5
let possibleAnswers = [spriteName, wrongChoice1, wrongChoice2, wrongChoice3]
randomize(possibleAnswers)

// timer starts, counts down, when timer hits 0, round is over and a new one starts
useEffect(() => {
    let quizTimer = setInterval(function(){
        if(rounds >0){
        roundTimer -= 1
        // console.log("roundTimer:", roundTimer)
        // console.log("roundNum:", rounds)
        // END OF TIMER REVEAL POKEMON AND CORRECT ANSWER
        if(roundTimer === 0){
            let pokeImg = document.getElementById("filteredImg")
            pokeImg.style.filter= "brightness(100%)"
            let button1 = document.getElementById("1")
            let button2 = document.getElementById("2")
            let button3 = document.getElementById("3")
            let button4 = document.getElementById("4")
            button1.disabled = true;
            button2.disabled = true;
            button3.disabled = true;
            button4.disabled = true;
            let answerbox = document.getElementById("parent")
            answerbox.style.display= "none"
            }

        if(roundTimer === -3){
          roundTimer = 5
          rounds -= 1
          // console.log("roundNum in timer:", rounds)
          // console.log("#############")
          setRoundOver(prev => prev +1)
          setNumOfRounds(prev => prev -1)
          let button1 = document.getElementById("1")
          let button2 = document.getElementById("2")
          let button3 = document.getElementById("3")
          let button4 = document.getElementById("4")
          button1.disabled = false;
          button2.disabled = false;
          button3.disabled = false;
          button4.disabled = false;
          let pokeImg = document.getElementById("filteredImg")
          pokeImg.style.filter= "brightness(0%)"

          button1.style.backgroundColor = "#F0F0F0"
          button2.style.backgroundColor = "#F0F0F0"
          button3.style.backgroundColor = "#F0F0F0"
          button4.style.backgroundColor = "#F0F0F0"

          let answerbox = document.getElementById("parent")
          answerbox.style.display= "grid"

          let incorrectDisplay = document.getElementById("incorrect")
          incorrectDisplay.style.display= "none"
          let correctDisplay = document.getElementById("correct")
          correctDisplay.style.display= "none"
          }
        } else{
            console.log("game over")
        }
        if(rounds === 0){
          clearInterval(quizTimer);
          navigate("/Winner")
        }
        },1000)
}, [])
// when 10 rounds have been completed, end game
    return (
    <div className='Game'>
        <Timer/>
        <img id="filteredImg" src={sprite} className="whoPoke"></img>
        <div className='ImgContainer'>
        </div>
        <div className='MultipleChoice'>
        <div id="parent" className="parent">
            <button id="1" className="answer" value={possibleAnswers[0]} onClick={checkAnswer}>{possibleAnswers[0]}</button>
            <button id="2" className="answer"value={possibleAnswers[1]} onClick={checkAnswer}>{possibleAnswers[1]}</button>
            <button id="3" className="answer" value={possibleAnswers[2]} onClick={checkAnswer}>{possibleAnswers[2]}</button>
            <button id="4" className="answer" value={possibleAnswers[3]} onClick={checkAnswer}>{possibleAnswers[3]}</button>
        </div>
        <br></br>
        <br></br>
        <div className="revealContainer">
          <div className="correct" id="correct">
            <h1>Correct! <i class="nes-icon is-large like"></i></h1>
          </div>
          <div className="incorrect" id="incorrect">
            <h1>Incorrect <i class="nes-icon close is-large"></i></h1>
          </div>
        </div>
    </div>
    </div>
  )
}
