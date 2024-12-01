import { useState } from "react";
import { backendURL } from "../utils/other";

const RaspberryLogs: React.FC = () => {
  const [logs, setLogs] = useState('');
  const [cameraLogs, setCameraLogs] = useState('');

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

  return (
    <div>
      <h3>Raspberry logs</h3>
      <button onClick={getLatestLogs}>Refresh logs</button>
      {(logs || cameraLogs) && (
        <>
          <h3>Latest logs from the Pi:</h3>
          <p>{logs}</p>
          <h4>Latest cameralogs:</h4>
          <p>{cameraLogs}</p>
        </>
      )}

    </div>
  )
}

export default RaspberryLogs;