import React, { useState } from 'react';

type FilterProps = {
  label: string;
  onFilterChange: (filterName: string, value: string) => void;
};

const FilterSidebar = () => {
  const [showFilters, setShowFilters] = useState({
    company: false,
    location: false,
    jobTitle: false,
    industry: false,
    // Add more filters here
  });

  // Toggle filter visibility
  const toggleFilter = (filter: string) => {
    setShowFilters({ ...showFilters, [filter]: !showFilters[filter] });
  };

  return (
    <div style={{ padding: '16px', borderRight: '1px solid #eee', width: '260px', backgroundColor: '#f9f9f9' }}>
      <h2>Filters</h2>

      {/* Company Filter */}
      <FilterBlock label="Company" onFilterChange={handleFilterChange}>
        {showFilters.company ? (
          <div>
            <button>Include</button>
            <button>Exclude</button>
          </div>
        ) : null}
      </FilterBlock>

      {/* Location Filter */}
      <FilterBlock label="Location" onFilterChange={handleFilterChange}>
        {showFilters.location ? (
          <div>
            <button>Include</button>
            <button>Exclude</button>
          </div>
        ) : null}
      </FilterBlock>

      {/* Job Title Filter */}
      <FilterBlock label="Job Title" onFilterChange={handleFilterChange}>
        {showFilters.jobTitle ? (
          <div>
            <button>Include</button>
            <button>Exclude</button>
          </div>
        ) : null}
      </FilterBlock>

      {/* Industry Filter */}
      <FilterBlock label="Industry" onFilterChange={handleFilterChange}>
        {showFilters.industry ? (
          <div>
            <button>Include</button>
            <button>Exclude</button>
          </div>
        ) : null}
      </FilterBlock>

      {/* Add other filters here similarly */}
    </div>
  );
};

const FilterBlock = ({ label, children, onFilterChange }: FilterProps) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div>
        <strong>{label}</strong>
        <button
          onClick={() => onFilterChange(label, 'toggle')}
          style={{ marginLeft: '8px', cursor: 'pointer' }}
        >
          +
        </button>
      </div>
      {children}
    </div>
  );
};

// This function will be called when filter changes
const handleFilterChange = (filterName: string, value: string) => {
  console.log('Filter changed:', filterName, value);
};

export default FilterSidebar;
