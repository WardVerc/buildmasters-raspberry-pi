import { useEffect, useState } from 'react';
import './App.css'

interface Stats {
  ip: string;
  cpu: string;
  memUsage: string;
  diskSpace: string;
  temp: string;
}

function App() {
  const [pictureNames, setPictureNames] = useState<Record<string, string[]>>({});
  const [stats, setStats] = useState<Stats>({
    ip: "unknown",
    cpu: "unknown",
    memUsage: "unknown",
    diskSpace: "unknown",
    temp: "unknown",
  })

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/take-picture');
      const data = await response.json();
      console.log(data.message);
      getPictures();
      getStats();
    } catch (error) {
      console.log(`Error take picture: ${error}`);
    }
  };

  const sortPictures = (pictures: string[]) => {
    // Returns an object with dates as keys, and string arrays as values, so we can sort the pictures by date
    const sortedPictures: Record<string, string[]> = {};

    pictures.map((pictureName: string) => {
      const parts = pictureName.split('-');
      // If pictureName contains "2024-03-18-0", last part is the counter, the first three is the date
      if (parts.length == 4) {
        const date = `${parts[0]}-${parts[1]}-${parts[2]}`;

        // Initialize the date if it doesn't exist in the object yet
        if (!sortedPictures[date]) {
          sortedPictures[date] = [];
        }

        // Add the picture to the corresponding date group
        sortedPictures[date].push(pictureName);
      }
    })
    return sortedPictures;
  }

  const getPictures = async () => {
    try {
      const response = await fetch('http://localhost:4000/pictures');
      const data = await response.json();
      if (data.results.length > 0) {
        console.log(data.results);
        setPictureNames(sortPictures(data.results));
      }
    } catch (error) {
      console.log(`Error get pictures: ${error}`);
    }
  };

  const getStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/stats');
      const data = await response.json();
      if (data.results) {
        console.log(data.results);
        setStats(data.results);
      }
    } catch (error) {
      console.log(`Error get stats: ${error}`);
    }
  };

  useEffect(() => {
    getPictures();
    getStats();
  }, [])


  return (
    <>
      <div className='app-container'>
        <h2>Buildmasters Raspberry Pi</h2>
        <button onClick={handleButtonClick}>Take picture</button>
        <h4>Picture of the day:</h4>
        <img src="pictures/groep.jpg" className='image-cover' />
        <h4>Other pictures</h4>
        <div>
          {Object.keys(pictureNames).sort().reverse().map((date) => (
            <div key={date}>
              <h2>{date}</h2>
              <div style={{ gap: '10px' }}>
                {pictureNames[date].map((picture) => (
                  <img
                    key={picture}
                    src={`pictures/${picture}`}
                    alt={picture}
                    className='image-cover'
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <h3>Raspberry stats:</h3>
        {Object.entries(stats).map(([key, value]) => (
          <p>{key}: {value}</p>
        ))}
      </div>
    </>
  )
}

export default App
