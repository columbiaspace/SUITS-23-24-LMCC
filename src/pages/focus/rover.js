import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Map from '../../components/Map.js';
import RoverCam from "../../components/RoverCamera.js";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentRover = styled.div`
  display: flex;
  flex: 1;
`;

const LeftColumnRover = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const RoverCamContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const MapContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const RightColumnRover = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableHead = styled.thead`
  background-color: #f2f2f2;
`;

const TableHeader = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

function Rover() {
  const [roverData, setRoverData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_rover_spec_scan');
        const data = await response.json();
        setRoverData(data);
      } catch (error) {
        console.error('Error fetching rover data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Set up interval to fetch data every second
    const intervalId = setInterval(fetchData, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <PageContainer>
      <ContentRover>
        <LeftColumnRover>
          <RoverCamContainer>
            <RoverCam />
          </RoverCamContainer>
          <MapContainer>
            <Map />
          </MapContainer>
        </LeftColumnRover>
        <RightColumnRover>
          {roverData ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Property</TableHeader>
                  <TableHeader>Value</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{roverData.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{roverData.id}</TableCell>
                </TableRow>
                {Object.entries(roverData.data).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            'Loading...'
          )}
        </RightColumnRover>
      </ContentRover>
    </PageContainer>
  );
}

export default Rover;
