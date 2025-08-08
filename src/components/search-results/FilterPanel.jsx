const FilterPanel = ({ showFilters }) => {
  if (!showFilters) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-primary_app" />
              <span className="ml-2">Food</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-primary_app" />
              <span className="ml-2">Vitamins</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-primary_app" />
              <span className="ml-2">Toys</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Brands</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-primary_app" />
              <span className="ml-2">Brit</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-primary_app" />
              <span className="ml-2">Vitamax</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-primary_app" />
              <span className="ml-2">Trixie</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-primary_app" />
              <span className="ml-2">Tetra</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>€0</span>
              <span>€1000</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded-full mr-2 hover:bg-gray-300 transition-colors">
          Reset
        </button>
        <button className="px-4 py-2 bg-primary_app text-white rounded-full hover:bg-primary_app-dark transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
