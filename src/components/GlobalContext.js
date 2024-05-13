import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [allData, setAllData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/data');
        setAllData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Fetch data every second

    return () => clearInterval(intervalId);
  }, []);

  return (
    <GlobalContext.Provider value={allData}>
      {children}
    </GlobalContext.Provider>
  );
};
