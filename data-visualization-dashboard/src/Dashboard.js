import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        // Simulating a fetch call with a timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = [
          { label: "A", value: 30 },
          { label: "B", value: 80 },
          { label: "C", value: 45 },
          { label: "D", value: 60 },
          { label: "E", value: 20 },
        ];

        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? <p>Loading...</p> : <BarChart data={data} />}
    </div>
  );
};

export default Dashboard;
