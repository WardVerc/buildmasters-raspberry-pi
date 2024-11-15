import './App.css'

function App() {

  return (
    <>
      <div className='app-container'>
        <h2>Buildmasters Raspberry Pi</h2>
        <button>Take picture</button>
        <h4>Picture of the day:</h4>
        <img src="pictures/groep.jpg" className='groep-container' />
        <p>Raspberry stats:</p>
      </div>
    </>
  )
}

export default App
