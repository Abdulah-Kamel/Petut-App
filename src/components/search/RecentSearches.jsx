const RecentSearches = ({ recentSearches, onSelectRecent }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
      <ul className="space-y-2">
        {recentSearches.slice(0, 5).map((term, index) => (
          <li key={index}>
            <button
              onClick={() => onSelectRecent(term)}
              className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3 text-neutral"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-left">{term}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;
