import React, { useState, useEffect } from "react";

const DataGrid = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [filterTypes, setFilterTypes] = useState({});
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

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  const handleFilterTypeChange = (key, type) => {
    setFilterTypes(prevTypes => ({
      ...prevTypes,
      [key]: type
    }));
  };

  const applyFilters = () => {
    let filtered = [...data];
    for (let key in filters) {
      const filterValue = filters[key]?.toLowerCase();
      const filterType = filterTypes[key] || 'contains';
      filtered = filtered.filter(item => {
        const itemValue = item[key]?.toString().toLowerCase() || '';
        switch (filterType) {
          case 'start with':
            return itemValue.startsWith(filterValue);
          case 'end with':
            return itemValue.endsWith(filterValue);
          case 'contains':
            return itemValue.includes(filterValue);
          case 'does not contain':
            return !itemValue.includes(filterValue);
          case 'equals':
            return itemValue === filterValue;
          case 'does not equal':
            return itemValue !== filterValue;
          default:
            return true;
        }
      });
    }
    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, filterTypes]);

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
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead className="bg-gray-100">
          <tr>
            {filteredData.length > 0 && Object.keys(filteredData[0]).map((key) => (
              <th
                key={key}
                onClick={() => sortData(key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b cursor-pointer"
              >
                <div className="flex flex-col space-y-2">
                  <span>{key}</span>
                  <select
                    value={filterTypes[key] || 'contains'}
                    onChange={(e) => handleFilterTypeChange(key, e.target.value)}
                    className="border border-gray-300 rounded-md p-1 text-xs"
                  >
                    <option value="contains">Contains</option>
                    <option value="start with">Start With</option>
                    <option value="end with">End With</option>
                    <option value="does not contain">Does Not Contain</option>
                    <option value="equals">Equals</option>
                    <option value="does not equal">Does Not Equal</option>
                  </select>
                  <input
                    type="text"
                    placeholder={`Filter ${key}...`}
                    value={filters[key] || ''}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="border border-gray-300 rounded-md p-1 text-xs"
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
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
