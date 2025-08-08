import React from "react";
const FilterModal = ({
  open,
  onClose,
  sortBy,
  setSortBy,
  minRating,
  setMinRating,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end z-50">
      <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold text-primary dark:text-white">
            Sort & Filter
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary dark:text-gray-300 dark:hover:text-white"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2 text-primary dark:text-white">
            Sort by:
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-black dark:text-white">
              <input
                type="radio"
                name="sortBy"
                value="distance"
                checked={sortBy === "distance"}
                onChange={() => setSortBy("distance")}
                className="accent-primary"
              />
              Nearest
            </label>
            <label className="flex items-center gap-2 text-black dark:text-white">
              <input
                type="radio"
                name="sortBy"
                value="price_asc"
                checked={sortBy === "price_asc"}
                onChange={() => setSortBy("price_asc")}
                className="accent-primary"
              />
              Price (Low to High)
            </label>
            <label className="flex items-center gap-2 text-black dark:text-white">
              <input
                type="radio"
                name="sortBy"
                value="price_desc"
                checked={sortBy === "price_desc"}
                onChange={() => setSortBy("price_desc")}
                className="accent-primary"
              />
              Price (High to Low)
            </label>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2 text-primary dark:text-white">
            Minimum Rating:
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} onClick={() => setMinRating(i + 1)}>
                <span
                  className={`material-icons text-2xl ${
                    i < minRating
                      ? "text-primary"
                      : "text-secondary-light dark:text-gray-400"
                  }`}
                >
                  star
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
