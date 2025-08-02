import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  setSelectedCategories,
  setSelectedBrands,
  setPriceRange,
  setAgeRanges,
  setBreedSizes,
  setSortOption,
  setRating,
  resetFilters
} from '../store/slices/filterSlice'
import { fetchProducts } from '../store/slices/catalogSlice';
import LoadingAnimation from '../components/common/LoadingAnimation';

const FilterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const filters = useSelector(state => state.filter)
  const { products, loading: productsLoading } = useSelector(state => state.catalog);

  // Local state to track changes before applying
  const [localFilters, setLocalFilters] = useState({
    categories: [...filters.selectedCategories],
    brands: [...filters.selectedBrands],
    priceRange: {...filters.priceRange},
    ageRanges: [...filters.ageRanges],
    breedSizes: [...filters.animalBreedSizes],
    sortOption: filters.sortOption,
    rating: filters.rating
  })

  // Parse query params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get('category')
    const brand = params.get('brand')
    
    if (category) {
      setLocalFilters(prev => ({
        ...prev,
        categories: [category]
      }))
    }
    
    if (brand) {
      setLocalFilters(prev => ({
        ...prev,
        brands: [brand]
      }))
    }
  }, [location.search])

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleCategoryToggle = (category) => {
    setLocalFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }

  const handleBrandToggle = (brand) => {
    setLocalFilters(prev => {
      const brands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
      return { ...prev, brands }
    })
  }

  const handlePriceRangeChange = (min, max) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }))
  }

  const handleAgeRangeToggle = (ageRange) => {
    setLocalFilters(prev => {
      const ageRanges = prev.ageRanges.includes(ageRange)
        ? prev.ageRanges.filter(a => a !== ageRange)
        : [...prev.ageRanges, ageRange]
      return { ...prev, ageRanges }
    })
  }

  const handleBreedSizeToggle = (breedSize) => {
    setLocalFilters(prev => {
      const breedSizes = prev.breedSizes.includes(breedSize)
        ? prev.breedSizes.filter(b => b !== breedSize)
        : [...prev.breedSizes, breedSize]
      return { ...prev, breedSizes }
    })
  }

  const handleSortOptionChange = (sortOption) => {
    setLocalFilters(prev => ({
      ...prev,
      sortOption
    }))
  }

  const handleRatingChange = (rating) => {
    setLocalFilters(prev => ({
      ...prev,
      rating
    }))
  }

  const handleReset = () => {
    dispatch(resetFilters())
    setLocalFilters({
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 1000 },
      ageRanges: [],
      breedSizes: [],
      sortOption: 'popularity',
      rating: 0
    })
  }

  const handleApply = () => {
    // Dispatch all filter actions
    dispatch(setSelectedCategories(localFilters.categories));
    dispatch(setSelectedBrands(localFilters.brands));
    dispatch(setPriceRange(localFilters.priceRange));
    dispatch(setAgeRanges(localFilters.ageRanges));
    dispatch(setBreedSizes(localFilters.breedSizes));
    dispatch(setSortOption(localFilters.sortOption));
    dispatch(setRating(localFilters.rating));

    // Construct query params
    const params = new URLSearchParams();
    if (localFilters.categories.length) {
      localFilters.categories.forEach(c => params.append('category', c));
    }
    if (localFilters.brands.length) {
      localFilters.brands.forEach(b => params.append('brand', b));
    }
    if (localFilters.priceRange.min > 0 || localFilters.priceRange.max < 1000) {
      params.set('price_min', localFilters.priceRange.min);
      params.set('price_max', localFilters.priceRange.max);
    }
    if (localFilters.ageRanges.length) {
      localFilters.ageRanges.forEach(a => params.append('age', a));
    }
    if (localFilters.breedSizes.length) {
      localFilters.breedSizes.forEach(s => params.append('breed', s));
    }
    if (localFilters.sortOption !== 'popularity') {
      params.set('sort', localFilters.sortOption);
    }
    if (localFilters.rating > 0) {
      params.set('rating', localFilters.rating);
    }

    // Navigate back to catalog with applied filters in URL
    navigate(`/catalog?${params.toString()}`);
  };

  if (productsLoading) {
    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 mt-12">
            <div className="sticky top-0 bg-white z-10 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-neutral"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold">Filters</h1>
                    <button
                        onClick={handleReset}
                        className="text-primary_app text-sm font-medium"
                    >
                        Reset All
                    </button>
                </div>
            </div>
            <LoadingAnimation />
        </div>
    );
  }

  // Mock data for filters
  const availableCategories = [...new Set(products.map(p => p.category))];
  const availableBrands = [...new Set(products.map(p => p.brand))];
  const availableAgeRanges = ['Puppy', 'Adult', 'Senior']
  const availableBreedSizes = ['Small', 'Medium', 'Large']
  const availableSortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price_low_high', label: 'Price: Low to High' },
    { value: 'price_high_low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Customer Rating' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20 mt-12">
      <div className="sticky top-0 bg-white z-10 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="text-neutral"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Filters</h1>
          <button 
            onClick={handleReset}
            className="text-primary_app text-sm font-medium"
          >
            Reset All
          </button>
        </div>
      </div>

      <div className="py-6 space-y-8">
        {/* Sort By */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Sort By</h2>
          <div className="space-y-2">
            {availableSortOptions.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`sort-${option.value}`}
                  name="sortOption"
                  checked={localFilters.sortOption === option.value}
                  onChange={() => handleSortOptionChange(option.value)}
                  className="w-5 h-5 text-primary_app focus:ring-primary_app"
                />
                <label htmlFor={`sort-${option.value}`} className="ml-2 text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-full ${localFilters.categories.includes(category) ? 'bg-primary_app text-white' : 'bg-white text-neutral border border-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Brands</h2>
          <div className="space-y-2">
            {availableBrands.map(brand => (
              <div key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={localFilters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-5 h-5 text-primary_app focus:ring-primary_app rounded"
                />
                <label htmlFor={`brand-${brand}`} className="ml-2 text-gray-700">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Price Range</h2>
            <span className="text-sm text-gray-600">
              {localFilters.priceRange.min}€ - {localFilters.priceRange.max}€
            </span>
          </div>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={localFilters.priceRange.max}
              onChange={(e) => handlePriceRangeChange(localFilters.priceRange.min, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="flex justify-between mt-4">
            <div className="w-[48%]">
              <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">Min</label>
              <input
                type="number"
                id="min-price"
                value={localFilters.priceRange.min}
                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value), localFilters.priceRange.max)}
                min="0"
                max={localFilters.priceRange.max}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app"
              />
            </div>
            <div className="w-[48%]">
              <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">Max</label>
              <input
                type="number"
                id="max-price"
                value={localFilters.priceRange.max}
                onChange={(e) => handlePriceRangeChange(localFilters.priceRange.min, parseInt(e.target.value))}
                min={localFilters.priceRange.min}
                max="1000"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary_app"
              />
            </div>
          </div>
        </div>

        {/* Age Range */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Pet Age</h2>
          <div className="flex flex-wrap gap-2">
            {availableAgeRanges.map(age => (
              <button
                key={age}
                onClick={() => handleAgeRangeToggle(age)}
                className={`px-4 py-2 rounded-full ${localFilters.ageRanges.includes(age) ? 'bg-primary_app text-white' : 'bg-white text-neutral border border-gray-200'}`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Breed Size */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Breed Size</h2>
          <div className="flex flex-wrap gap-2">
            {availableBreedSizes.map(size => (
              <button
                key={size}
                onClick={() => handleBreedSizeToggle(size)}
                className={`px-4 py-2 rounded-full ${localFilters.breedSizes.includes(size) ? 'bg-primary_app text-white' : 'bg-white text-neutral border border-gray-200'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Rating */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Customer Rating</h2>
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <input
                  type="radio"
                  id={`rating-${rating}`}
                  name="rating"
                  checked={localFilters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-5 h-5 text-primary_app focus:ring-primary_app"
                />
                <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-700">{rating}+ stars</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button 
          onClick={handleApply}
          className="w-full py-3 bg-primary_app text-white font-semibold rounded-lg hover:bg-primary_app/90 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default FilterPage