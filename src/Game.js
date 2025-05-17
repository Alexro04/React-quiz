import { useEffect, useReducer } from 'react'
import Header from './Header'
import Loader from './Loader'
import Error from './Error'
import { Question } from './Question'
import { Ready } from './Ready'
import { Result } from './Result'
import { generateQuestions } from './openai'
import Begining from './Begining'


function Game() {
  const [{ currentQuestion, questions, status, chosenId, score, highscore, time }, dispatch] = useReducer(reducer, initialState)
  const maxPossibleScore = questions?.reduce((acc) => acc + 10, 0)

  const hour = Math.floor(time/60)
  const minutes = time - (hour * 60)

  useEffect(function() {
    async function fetchQuestion() {
      try {
        dispatch({ type: 'setLoading', payload: 'loading' })
        const questions = await generateQuestions()
        dispatch({ type: 'setQuestions', payload: JSON.parse(questions) })
      } catch (error) {
        dispatch({ type: 'setError', payload: 'error' })
      }
    }
    fetchQuestion()
  }, [])

  useEffect(function() {
    if (time === 0) dispatch({type: 'finish'})
  })

  return (
    <>
      {status === 'loading' && <Loader />}
      {status === 'error' && <Error />}
      {status === 'ready' && <Ready numQuestions={questions.length} dispatch={dispatch}/>}
      {status === 'active' && 
        <main className='main'>
          <div className='progress'>
            <progress value={currentQuestion + Number(chosenId !== null)} max={questions.length}></progress>
            <p>Question {currentQuestion + 1}/{questions.length}</p>
            <p><strong>{score}</strong>/{maxPossibleScore} points</p>
          </div>
          <Question current={currentQuestion} questions={questions} dispatch={dispatch} chosenId={chosenId} time={time}/>
          <button className='btn timer'>{hour < 10 ? `0${hour}` : hour}:{minutes < 10 ? `0${minutes}` : minutes}</button>
          {chosenId !== null
            ? currentQuestion + 1 !== questions.length
              ? <button className='btn btn-ui' onClick={() => dispatch({ type: 'next' })}>Next</button>
              : <button className='btn btn-ui' onClick={() => dispatch({ type: 'finish' })}>Finish</button>
            : null 
          }
        </main>
      }
      {status === 'finished' && <Result score={score} maxPossibleScore={maxPossibleScore} highscore={highscore} dispatch={dispatch}/> }
    </>
  );
}

export default Game;
