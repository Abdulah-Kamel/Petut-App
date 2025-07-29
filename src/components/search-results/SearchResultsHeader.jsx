import { useNavigate } from 'react-router-dom';

const SearchResultsHeader = ({ query, resultsCount }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => navigate('/search')}
          className="mr-3 text-neutral"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Results for "{query}"</h1>
      </div>
      <p className="text-gray-600">{resultsCount} products found</p>
    </div>
  );
};

export default SearchResultsHeader;
