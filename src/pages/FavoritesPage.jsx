import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFavorite } from "../store/slices/favoritesSlice";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../store/slices/cartSlice";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const {
    items: favorites,
    status,
    error,
  } = useSelector((state) => state.favorites);

  const handleRemoveFavorite = (product) => {
    if (currentUser) {
      dispatch(
        removeFavorite({ userId: currentUser.uid, productId: product.id })
      );
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (status === "loading") {
    return (
        <LoadingAnimation />
    );
  }

  if (status === "failed") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading favorites: {error}</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <h1 className="text-2xl dark:text-white font-bold mb-6">My Favorites</h1>
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h3 className="text-xl dark:text-white font-semibold mb-2">No favorites yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your favorite products will appear here.
          </p>
          <Link
            to="/catalog"
            className="inline-block bg-primary_app text-white px-6 py-3 rounded-lg hover:bg-primary_app/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
      <h1 className="text-2xl dark:text-white font-bold mb-6">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleRemoveFavorite}
            isFavorite={true} // All items on this page are favorites
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
