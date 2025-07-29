// src/pages/HomePage.jsx

import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../store/slices/catalogSlice"; // Import the new thunk
import ProductCard from "../components/ProductCard";
import { addToCart } from "../store/slices/cartSlice";
import heroDog from "../assets/banners/hero-dog.png";
import DarkModeToggle from "../components/DarkModeToggle";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";

// No more direct imports from 'firebase/firestore' or 'firebase.js' needed here!

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.catalog);
  const [categories, setCategories] = useState([]);
  // setCategories([products.map(product=>product.category)])

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  useEffect(() => {
    products?.map((product) =>
      setCategories([...categories, product.category])
    );
    console.log(categories);
  }, [products]);

  useEffect(() => {
    // We only fetch products if they haven't been loaded yet.
    // This prevents re-fetching every time the user visits the home page.
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-14">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-secondary-light to-secondary dark:from-secondary-dark dark:to-secondary-dark rounded-2xl overflow-hidden mb-8">
        <div className="container mx-auto px-6 py-12 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 max-md:order-last mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral dark:text-white mb-4">
                Taking care of <span className="text-primary">your pet</span>
              </h1>
              <p className="text-lg dark:text-gray-300 mb-6">
                Find everything your pet needs - from premium food to toys and
                accessories.
              </p>
              <Link to="/catalog" className="btn-primary inline-block">
                Shop Now
              </Link>
            </div>
            <div className="md:w-1/2 max-md:order-first lg:h-[500px] md:h-auto flex justify-center">
              <img
                src={heroDog}
                alt="Happy dog"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Featured Products</h2>
          <Link to="/catalog" className="text-primary hover:underline">
            View All
          </Link>
        </div>

        {loading ? (
         <LoadingAnimation />
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      {/*<section className="mb-12">*/}
      {/*  <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>*/}
      {/*  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">*/}
      {/*    /!* You may want to dynamically generate these from your data *!/*/}
      {/*    {*/}
      {/*      categories.map((category,index)=>{*/}
      {/*    return <Link to={`/${category}/`} className="block group" key={index}>*/}
      {/*      <div className="aspect-square bg-primary-light rounded-lg flex items-center justify-center p-4">*/}
      {/*        <img*/}
      {/*            src="https://placehold.co/100x100/"*/}
      {/*            alt="Electronics"*/}
      {/*            className="w-full h-full group-hover:scale-110 transition-transform object-contain"*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*      <p className="text-center mt-2 font-medium">category</p>*/}
      {/*    </Link>*/}
      {/*      })*/}
      {/*    }*/}
      {/*    /!* Other category links *!/*/}
      {/*  </div>*/}
      {/*</section>*/}
    </div>
  );
};

export default HomePage;