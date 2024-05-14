import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GlobalContext = createContext({});

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [allData, setAllData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const response = await axios.get('http://localhost:8000/data');
        if (response.status === 200) {
          setAllData(response.data);
        } else {
          throw new Error(`Failed to fetch data with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setAllData({});
      }
    };
  
    fetchData();
    const intervalId = setInterval(fetchData, 1000);
  
    return () => clearInterval(intervalId);
  }, []);

  const value = { allData, error };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
