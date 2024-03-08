import React from "react";

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="categoryFilter">
      <span className="categorySpan">Filter by category:</span>
      <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
