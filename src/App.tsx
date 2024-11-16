import { useState } from 'react';
import './App.css'

function App() {
  const [pictureNames, setPictureNames] = useState([]);

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/take-picture');
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.log(`Error take picture: ${error}`);
    }
  };

  const handleGetPictures = async () => {
    try {
      const response = await fetch('http://localhost:4000/pictures');
      const data = await response.json();
      if (data.results) {
        console.log(data.results);
        setPictureNames(data.results)
      }
    } catch (error) {
      console.log(`Error get pictures: ${error}`);
    }
  };

  return (
    <>
      <div className='app-container'>
        <h2>Buildmasters Raspberry Pi</h2>
        <button onClick={handleButtonClick}>Take picture</button>
        <button onClick={handleGetPictures}>Get pictures</button>
        <h4>Picture of the day:</h4>
        <img src="pictures/groep.jpg" className='image-cover' />
        <h4>Other pictures</h4>
        <div>
          {pictureNames.map((pictureName, index) => {
            const srcName = `pictures/${pictureName}`
            return (
              <img src={srcName} className='image-cover' key={srcName + '-' + index} />
            )
          })}
        </div>
        <p>Raspberry stats:</p>
      </div>
    </>
  )
}

export default App
