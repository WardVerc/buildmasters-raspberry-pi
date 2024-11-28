import { useEffect, useState } from 'react';
import './App.css'

interface Stats {
  ip: string;
  cpu: string;
  memUsage: string;
  diskSpace: string;
  temp: string;
}

const backendURL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [pictureNames, setPictureNames] = useState<Record<string, string[]>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [takePictureButtonText, setTakePictureButtonText] = useState('Take picture 📸');
  const [selectedImage, setSelectedImage] = useState('');
  const [pictureOfTheDay, setPictureOfTheDay] = useState('');
  const [logs, setLogs] = useState('');
  const [cameraLogs, setCameraLogs] = useState('');
  const [stats, setStats] = useState<Stats>({
    ip: "N/A",
    cpu: "N/A",
    memUsage: "N/A",
    diskSpace: "N/A",
    temp: "N/A",
  })

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

    // Sort each picture by their counter, counting down from the highest counter
    for (const date in sortedPictures) {
      sortedPictures[date] = sortedPictures[date].sort((a, b) => {
        const counterA = Number(a.split('-').pop()?.replace('.jpg', ''));
        const counterB = Number(b.split('-').pop()?.replace('.jpg', ''));
        return counterB - counterA;
      });
    }
    return sortedPictures;
  }

  const handleButtonClick = async () => {
    setIsButtonDisabled(true);
    setTakePictureButtonText('Taking picture ... ⏳')
    try {
      const response = await fetch(`${backendURL}/take-picture`);
      const data = await response.json();
      console.log(data.message);
      await getPictures();
      await getStats();
    } catch (error) {
      console.log(`Error take picture: ${error}`);
    }
    setTakePictureButtonText('Take picture 📸')
    setIsButtonDisabled(false);
  };

  const handleReboot = async () => {
    await fetch(`${backendURL}/reboot`);
  }

  const getLatestLogs = async () => {
    try {
      const response = await fetch(`${backendURL}/logs`);
      const cameraresponse = await fetch(`${backendURL}/camera-logs`);
      const data = await response.json();
      const cameradata = await cameraresponse.json();
      console.log(data.message);
      console.log(cameradata.message);
      setLogs(data.results);
      setCameraLogs(cameradata.results);
    } catch (error) {
      console.log(`Error getting logs: ${error}`);
    }
  }

  const handleImageClick = (pictureName: string) => {
    setSelectedImage(pictureName);
    setIsFullScreen(true);
  }

  const closeFullScreen = () => {
    setIsFullScreen(false);
    setSelectedImage('');
  };

  const checkIfToday = (dateString: string) => {
    // Get today's date in the format YYYY-MM-DD
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Compare the provided date string with today's date
    return dateString === todayString;
  };

  const checkPictureOfTheDay = (sortedPictures: Record<string, string[]>) => {
    Object.entries(sortedPictures).some(([key, value]) => {
      if (checkIfToday(key)) {
        // The array is sorted with the most recent one first, we need the first one of the day, 
        // so we need the last element in the array
        setPictureOfTheDay(value[value.length - 1]);
        return true;
      }
      return false;
    });
  }

  const getPictures = async () => {
    try {
      const response = await fetch(`${backendURL}/pictures`);
      const data = await response.json();
      if (data.results.length > 0) {
        checkPictureOfTheDay(sortPictures(data.results));
        setPictureNames(sortPictures(data.results));
      }
    } catch (error) {
      console.log(`Error get pictures: ${error}`);
    }
  };

  const getStats = async () => {
    try {
      const response = await fetch(`${backendURL}/stats`);
      const data = await response.json();
      if (data.results) {
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
    <div className='app-container'>
      <h2>Buildmasters Raspberry Pi</h2>
      <button onClick={handleButtonClick} disabled={isButtonDisabled}>{takePictureButtonText}</button>
      {pictureOfTheDay ? (
        <>
          <h4>First picture of the day:</h4>
          <img src={`pictures/${pictureOfTheDay}`} className='image-cover' onClick={() => handleImageClick(pictureOfTheDay)} />
        </>
      ) : (
        <>
          <h4>No picture of today yet! 😭</h4>
        </>
      )}
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
                  onClick={() => handleImageClick(picture)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <h3>Raspberry stats:</h3>
      {Object.entries(stats).map(([key, value]) => (
        <p key={key}>{key}: {value}</p>
      ))}
      {isFullScreen && selectedImage && (
        <div className="full-screen-overlay" onClick={closeFullScreen}>
          <img src={`pictures/${selectedImage}`} alt="Full Screen" className="full-screen-image" />
        </div>
      )}
      <br />
      <button onClick={() => getLatestLogs()}>Get logs</button>
      {(logs || cameraLogs) && (
        <>
          <h3>Latest logs from the Pi:</h3>
          <p>{logs}</p>
          <h4>Latest cameralogs:</h4>
          <p>{cameraLogs}</p>
        </>
      )}
      <h1>{"Reboot (be careful!!)"}</h1>
      <button onClick={handleReboot}>Reboot</button>

    </div>
  )
}

export default App
