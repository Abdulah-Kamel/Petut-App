import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";

const SearchResults = ({ loading, error, results, query }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (results.length > 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Search Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }

  if (query) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold mb-2">No results found</h3>
        <p className="text-gray-600">
          We couldn't find any products matching "{query}"
        </p>
        <div className="mt-6">
          <Link to="/catalog" className="btn-primary-app py-2 px-6">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return null;
};

export default SearchResults;
