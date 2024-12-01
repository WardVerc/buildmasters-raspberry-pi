import { useEffect, useState } from "react";
import { StatsType } from "../utils/types";
import { backendURL } from "../utils/other";

const Stats = () => {
  const [stats, setStats] = useState<StatsType>({
    ip: "N/A",
    cpu: "N/A",
    memUsage: "N/A",
    diskSpace: "N/A",
    temp: "N/A",
  })

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
    getStats();
  }, [])

  return (
    <div>
      <h3>Raspberry stats:</h3>
      {Object.entries(stats).map(([key, value]) => (
        <p key={key}>{key}: {value}</p>
      ))}
      <button onClick={getStats}>Refresh stats</button>
    </div>
  )
}

export default Stats;