import "../styles/FilterBar.css";

export default function FilterBar({
  uniqueTags,
  activeFilters,
  onFilterChange,
  sortOrder,
  onSortChange,
}) {
  const handleTagClick = (tag) => {
    if (activeFilters.includes(tag)) {
      // Remove filter
      onFilterChange(activeFilters.filter((t) => t !== tag));
    } else {
      // Add filter
      onFilterChange([...activeFilters, tag]);
    }
  };

  const handleSortClick = (sort) => {
    onSortChange(sort);
  };

  return (
    <div className="filter-bar">
      {/* Filter by Tags */}
      <div className="filter-bar__section">
        <h3 className="filter-bar__title">Filter Berdasarkan Tag</h3>
        <div className="filter-bar__tags">
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`filter-bar__tag ${
                activeFilters.includes(tag) ? "filter-bar__tag--active" : ""
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="filter-bar__section">
        <h3 className="filter-bar__title">Urutkan</h3>
        <div className="filter-bar__sorts">
          <button
            onClick={() => handleSortClick("rating_desc")}
            className={`filter-bar__sort ${
              sortOrder === "rating_desc" ? "filter-bar__sort--active" : ""
            }`}
          >
            Rating Tertinggi
          </button>
          <button
            onClick={() => handleSortClick("rating_asc")}
            className={`filter-bar__sort ${
              sortOrder === "rating_asc" ? "filter-bar__sort--active" : ""
            }`}
          >
            Rating Terendah
          </button>
          <button
            onClick={() => handleSortClick("title_asc")}
            className={`filter-bar__sort ${
              sortOrder === "title_asc" ? "filter-bar__sort--active" : ""
            }`}
          >
            Judul A-Z
          </button>
          <button
            onClick={() => handleSortClick("title_desc")}
            className={`filter-bar__sort ${
              sortOrder === "title_desc" ? "filter-bar__sort--active" : ""
            }`}
          >
            Judul Z-A
          </button>
          <button
            onClick={() => handleSortClick("default")}
            className={`filter-bar__sort ${
              sortOrder === "default" ? "filter-bar__sort--active" : ""
            }`}
          >
            Default
          </button>
        </div>
      </div>
    </div>
  );
}
