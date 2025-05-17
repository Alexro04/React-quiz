import { useEffect } from 'react';

export function Question({ current, questions, dispatch, chosenId }) {
  const currQuest = questions[current];

  useEffect(function () {
    const timer = setInterval(() => {
      dispatch({ type: 'time/running' });
    }, 1000);

    return function () {
      clearInterval(timer);
    };
  }, [dispatch]);

  return (
    <div>
      <h2>{currQuest.question}</h2>
      <div className='options'>
        {currQuest.options.map((option, index) => <button
          className={`btn btn-option 
              ${chosenId === index ? 'answer' : ''}
              ${chosenId !== null ? currQuest.correctOption === index ? 'correct' : 'wrong' : ''}`}
          key={option}
          onClick={() => dispatch({ type: 'answered', payload: index })}
          disabled={chosenId !== null}
        >{option}</button>)}
      </div>
    </div>
  );
}
