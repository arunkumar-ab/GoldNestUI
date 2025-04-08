// SearchBox.js - Component for searching customers
import React from 'react';

const SearchBox = ({ searchQuery, setSearchQuery }) => {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by name, area, phone, or father's name..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 border rounded-lg"
      />
    </div>
  );
};

export default SearchBox;