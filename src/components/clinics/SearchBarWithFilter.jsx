import React from "react";

const SearchBarWithFilter = ({ value, onChange, onFilterClick }) => (
  <div className="flex items-center gap-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow px-4 py-2 mt-4">
    <span className="material-icons text-gray-400 dark:text-gray-500">
      search
    </span>
    <input
      type="text"
      className="flex-1 bg-transparent outline-none text-base text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      placeholder="Search clinic or doctor name"
      value={value}
      onChange={onChange}
    />
    <button
      onClick={onFilterClick}
      className="flex items-center gap-1 focus:outline-none"
      style={{ direction: "ltr" }}
    >
      <span
        className="material-icons text-2xl text-black dark:text-white"
        style={{
          background: "transparent",
          borderRadius: "50%",
          padding: 6,
        }}
      >
        filter_list
      </span>
    </button>
  </div>
);

export default SearchBarWithFilter;
