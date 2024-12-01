import { backendURL } from "../utils/other";

const Rebooter: React.FC = () => {
  const handleReboot = async () => {
    await fetch(`${backendURL}/reboot`);
  }

  return (
    <div>
      <h3>{"Reboot (be careful!!)"}</h3>
      <button onClick={handleReboot}>Reboot</button>
    </div>
  )
};

export default Rebooter;