import { useEffect, useState } from "react";
import { checkIfToday } from "../utils/other";
import { PictureViewerType } from "../utils/types";

const PictureViewer = ({
  pictureNames
}: PictureViewerType) => {
  const [pictureOfTheDay, setPictureOfTheDay] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

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

  useEffect(() => {
    checkPictureOfTheDay(pictureNames);
  }, [pictureNames])

  return (
    <div>
      {pictureOfTheDay ? (
        <>
          <h4>First picture of the day:</h4>
          <img src={`pictures/${pictureOfTheDay}`} className='image-cover' onClick={() => setSelectedImage(pictureOfTheDay)} />
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
                  onClick={() => setSelectedImage(picture)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="full-screen-overlay" onClick={() => setSelectedImage('')}>
          <img src={`pictures/${selectedImage}`} alt="Full Screen" className="full-screen-image" />
        </div>
      )}
    </div>

  )
}

export default PictureViewer;