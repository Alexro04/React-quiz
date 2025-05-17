export function Result({ score, maxPossibleScore, highscore, dispatch }) {
  const percentage = Math.ceil((score / maxPossibleScore) * 100);
  let emoji;
  if (percentage === 100) emoji = '😆';
  if (percentage < 100 && percentage > 80) emoji = '😁';
  if (percentage < 80 && percentage > 60) emoji = '🙂';
  if (percentage < 60 && percentage > 50) emoji = '😑';
  if (percentage < 50) emoji = '🫢';

  return (
    <div>
      <p className='result'><span>{emoji}</span> You scored {score} out of {maxPossibleScore} ({percentage}%)</p>
      <p className='highscore'>(Highscore: {highscore})</p>
      <button className='btn btn-ui' onClick={() => dispatch({ type: 'restart' })}>Restart Quiz</button>
    </div>
  );
}
