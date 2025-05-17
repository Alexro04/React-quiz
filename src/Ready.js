export function Ready({ numQuestions, dispatch, level }) {
  return (
    <>
      <h2>Welcome to the React Quiz</h2>
      <h4>{numQuestions} {level} questions to test your react mastery</h4>
      <button className='btn' onClick={() => dispatch({ type: 'start' })}>Let's Start</button>
    </>
  );
}
