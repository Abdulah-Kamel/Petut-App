import { useNavigate } from "react-router-dom";

const SearchBar = ({ value, onChange, onSearch, onClear }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-4">
      <div className="relative flex items-center ">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-3 text-neutral dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search products"
          className="shadow-lg w-full pl-12 pr-10 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#313340] dark:text-white placeholder:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary_app focus:border-transparent"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-14 text-neutral dark:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <button type="submit" className="absolute right-3 text-primary dark:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
