import './App.css'

function App() {

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/take-picture');
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <>
      <div className='app-container'>
        <h2>Buildmasters Raspberry Pi</h2>
        <button onClick={handleButtonClick}>Take picture</button>
        <h4>Picture of the day:</h4>
        <img src="test.jpg" className='groep-container' />
        <p>Raspberry stats:</p>
      </div>
    </>
  )
}

export default App
