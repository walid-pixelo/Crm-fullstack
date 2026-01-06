import React from "react";

const FilterSidebar = ({ filters, setFilters, clearFilters }) => {
  return (
    <div style={sidebarStyle}>
      <h2>Filters</h2>
      <div style={filterBlockStyle}>
        {/* Status */}
        <FilterBlock label="Status">
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
            }}
            style={selectStyle}
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Working">Working</option>
            <option value="Contacted">Contacted</option>
            <option value="Nurture">Nurture</option>
          </select>
        </FilterBlock>

        {/* Location */}
        <FilterBlock label="Location">
          <input
            type="text"
            placeholder="City / Region"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            style={inputStyle}
          />
        </FilterBlock>

        {/* Company Headcount */}
        <FilterBlock label="Company Headcount">
          <select
            value={filters.companyHeadcount}
            onChange={(e) => {
              setFilters({ ...filters, companyHeadcount: e.target.value });
            }}
            style={selectStyle}
          >
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="500+">500+</option>
          </select>
        </FilterBlock>

        {/* Other Filters */}
        {/* Add similar blocks for job title, email status, etc. */}

        <button onClick={clearFilters} style={clearButtonStyle}>
          Clear filters
        </button>
      </div>
    </div>
  );
};

const sidebarStyle = {
  width: 260,
  borderRight: "1px solid #eee",
  padding: 16,
  background: "#fafafa",
  overflowY: "auto",
};

const filterBlockStyle = {
  marginBottom: 20,
};

const selectStyle = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 13,
  background: "#fff",
};

const inputStyle = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #ddd",
  fontSize: 13,
};

const clearButtonStyle = {
  marginTop: 8,
  width: "100%",
  padding: "7px 10px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
};

const FilterBlock = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#555" }}>{label}</div>
    {children}
  </div>
);

export default FilterSidebar;
