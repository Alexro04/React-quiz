import { useEffect, useReducer } from 'react'
import Header from './Header'
import Loader from './Loader'
import Error from './Error'
import { Question } from './Question'
import { Ready } from './Ready'
import { Result } from './Result'
import { generateQuestions } from './openai'
import Begining from './Begining'

const initialState = {
  questions: [],
  currentQuestion: 0,
  status: 'begining', // can be also 'active', 'loading', 'error', and 'finished'
  score: 0,
  highscore: 0,
  chosenId: null,
  time: 5,
  level: ''
}

function reducer(state, action) {
  switch (action.type) {
    case 'setQuestions':
      return {
        ...state, 
        questions: action.payload,
        status: 'ready'
      }
    case 'start':
      return {...state, status: 'active', score: 0}
    case 'answered':
      const currQuestion = state['questions'].at(state.currentQuestion)
      return {
        ...state, 
        chosenId: action.payload, 
        score: currQuestion.correctOption === action.payload 
          ? state.score + 10 : state.score
      }
    case 'next':
      return {
        ...state, 
        currentQuestion: state.currentQuestion + 1, 
        chosenId: null
      }
      case 'finish':
        return {
          ...state,
          status: 'finished',
          highscore: state.score > state.highscore ? state.score : state.highscore
        }
      case 'setLoading':
        return {
          ...state,
          status: action.payload
        }

      case 'setError':
        return {
          ...state,
          status: action.payload
        }
      case 'restart':
        return {
          ...initialState,
          questions: state.questions,
          highscore: state.highscore,
          level: state.level
        }
      case 'time/running':
        return {
          ...state,
          time: state.time - 1
        }
      case 'begin':
        return {
          ...state,
          status: 'ready',
          level: action.payload
        }
  
    default:
      throw new Error('Action type not recognized');
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { currentQuestion, questions, status, chosenId, score, highscore, time, level } = state
  const maxPossibleScore = questions?.reduce((acc) => acc + 10, 0)

  const hour = Math.floor(time/60)
  const minutes = time - (hour * 60)

  useEffect(function() {
    if (!level) return 
    async function fetchQuestion() {
      try {
        dispatch({ type: 'setLoading', payload: 'loading' })
        const questions = await generateQuestions(level)
        dispatch({ type: 'setQuestions', payload: JSON.parse(questions) })
      } catch (error) {
        dispatch({ type: 'setError', payload: 'error' })
      }
    }
    fetchQuestion()
  }, [level])

  useEffect(function() {
    if (time === 0 && status === 'active') dispatch({type: 'finish'})
  }, [time, status])

  return (
    <div className="app">
      <Header />
      {status === 'begining' && <Begining dispatch={dispatch}/>}
      {status === 'loading' && <Loader />}
      {status === 'error' && <Error />}
      {status === 'ready' && <Ready numQuestions={questions.length} dispatch={dispatch} level={level}/>}
      {status === 'active' && 
        <main className='main'>
          <div className='progress'>
            <progress value={currentQuestion + Number(chosenId !== null)} max={questions.length}></progress>
            <p>Question {currentQuestion + 1}/{questions.length}</p>
            <p><strong>?</strong>/{maxPossibleScore} points</p>
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
    </div>
  );
}

export default App;
