import { Link } from 'react-router-dom';

const SortControls = ({ sortBy, onSortChange, onToggleFilters }) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="flex items-center">
        <button 
          onClick={onToggleFilters}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-full mr-3 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
        <Link 
          to="/filters"
          className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
        >
          Advanced Filters
        </Link>
      </div>
      <div className="flex items-center">
        <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
        <select 
          id="sort"
          value={sortBy}
          onChange={onSortChange}
          className="border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary_app focus:border-transparent"
        >
          <option value="default">Relevance</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="rating">Highest Rated</option>
          <option value="reviews">Most Reviewed</option>
        </select>
      </div>
    </div>
  );
};

export default SortControls;
