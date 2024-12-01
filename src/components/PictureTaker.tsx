import { useState } from "react";
import { backendURL } from "../utils/other";
import { PictureTakerType } from "../utils/types";

const PictureTaker = ({
  getPictures
}: PictureTakerType) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [takePictureButtonText, setTakePictureButtonText] = useState('Take picture 📸');

  const handleButtonClick = async () => {
    setIsButtonDisabled(true);
    setTakePictureButtonText('Taking picture ... ⏳')
    try {
      const response = await fetch(`${backendURL}/take-picture`);
      const data = await response.json();
      console.log(data.message);
      await getPictures();
    } catch (error) {
      console.log(`Error take picture: ${error}`);
    }
    setTakePictureButtonText('Take picture 📸')
    setIsButtonDisabled(false);
  };

  return (
    <button onClick={handleButtonClick} disabled={isButtonDisabled}>{takePictureButtonText}</button>
  )
}

export default PictureTaker;