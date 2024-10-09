import React, { useState, useEffect } from "react";

const DataGrid = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setFilteredData(data);
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  const handleFilterChange = (event) => {
    const text = event.target.value.toLowerCase();
    setFilterText(text);
    const filtered = data.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(text)
      )
    );
    setFilteredData(filtered);
  };

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedArray = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredData(sortedArray);
    setSortConfig({ key, direction });
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <input
        type="text"
        placeholder="Filter..."
        value={filterText}
        onChange={handleFilterChange}
        className="mb-4 p-2 border border-gray-300"
      />
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {filteredData.length > 0 && Object.keys(filteredData[0]).map((key) => (
              <th
                key={key}
                onClick={() => sortData(key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b cursor-pointer"
              >
                {key}
                {sortConfig.key === key && (
                  <span>{sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} className="border-b">
              {Object.values(row).map((value, i) => (
                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {value === null || value === undefined 
                   ? ''
                   : typeof value === 'object' 
                   ? JSON.stringify(value) 
                   : String(value)
                   }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataGrid;