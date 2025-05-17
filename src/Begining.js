export default function Begining({ dispatch }) {
  return (
    <>
      <h2>Welcome to the React Quiz</h2>
      <h4>How proficient do you think your react skill is. Choose a difficulty.</h4>
      <div className="options">
        <button className="btn btn-option" onClick={() => dispatch({ type: 'begin', payload: 'easy' })}>Begginer Level</button>
        <button className="btn btn-option" onClick={() => dispatch({ type: 'begin', payload: 'intermediate' })}>intermediate Level</button>
        <button className="btn btn-option" onClick={() => dispatch({ type: 'begin', payload: 'advanced' })}>Advanced Level</button>
        <button className="btn btn-option" onClick={() => dispatch({ type: 'begin', payload: 'extremely difficult' })}>Expert Level</button>
      </div>
    </>
  )
}
