import React, { useEffect, useState } from 'react';
import '../../pages-style/rocks.css';
import '../../pages-style/page.css';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
`;

const TableHead = styled.thead`
  background-color: #4CAF50;
  color: white;
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #ddd;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
`;

const InnerTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
`;

const InnerTableCell = styled.td`
  padding: 8px;
  border: none;
`;

function Rocks() {
  const [rocksData, setRocksData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_rover_spec_scan');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setRocksData([data]);
      } catch (error) {
        console.error('Error fetching rocks data:', error);
      }
    };

    // Fetch data initially
    fetchData();
  }, []);

  return (
    <div className="rocks-container">
      <div className="left-section">
        <div className="top-div">Top Div Content</div>
        <div className="bottom-div">Bottom Div Content</div>
      </div>
      <div className="right-section">
        {rocksData ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>ID</TableHeader>
                <TableHeader>Data</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {rocksData.map((rock) => (
                <TableRow key={rock.id}>
                  <TableCell>{rock.name}</TableCell>
                  <TableCell>{rock.id}</TableCell>
                  <TableCell>
                    <InnerTable>
                      <tbody>
                        {Object.entries(rock.data).map(([key, value]) => (
                          <TableRow key={key}>
                            <InnerTableCell>{key}</InnerTableCell>
                            <InnerTableCell>{value}</InnerTableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </InnerTable>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          'Loading...'
        )}
      </div>
    </div>
  );
}

export default Rocks;
