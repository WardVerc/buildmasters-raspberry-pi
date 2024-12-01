import './App.css'
import Logs from './components/Logs';
import Rebooter from './components/Rebooter';
import Stats from './components/Stats';
import PictureViewer from './components/PictureViewer';
import PictureTaker from './components/PictureTaker';
import { useEffect, useState } from 'react';
import { backendURL, sortPictures } from './utils/other';

function App() {
  const [pictureNames, setPictureNames] = useState<Record<string, string[]>>({});

  const getPictures = async () => {
    try {
      const response = await fetch(`${backendURL}/pictures`);
      const data = await response.json();
      if (data.results.length > 0) {
        setPictureNames(sortPictures(data.results));
      }
    } catch (error) {
      console.log(`Error get pictures: ${error}`);
    }
  };

  useEffect(() => {
    getPictures();
  }, [])

  return (
    <div className='app-container'>
      <h2>Buildmasters Raspberry Pi</h2>
      <PictureTaker getPictures={getPictures} />
      <PictureViewer pictureNames={pictureNames} />
      <br />
      <Stats />
      <br />
      <Logs />
      <br />
      <Rebooter />
    </div>
  )
}

export default App
