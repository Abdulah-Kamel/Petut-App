import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  selectedCategories: [],
  brands: [],
  selectedBrands: [],
  priceRange: { min: 0, max: 1000 },
  ageRanges: ['0-1.5 months', '1.5-6 months', '6-12 months', '1-3 years', '3-6 years', '6+ years'],
  selectedAgeRanges: [],
  animalBreedSizes: ['Giant', 'Large', 'Medium', 'Small', 'No restrictions'],
  selectedBreedSizes: [],
  sortBy: 'default', // default, price (high to low), price (low to high), newest, popular, favorite
  customerReview: 0, // 0-5 stars
  rating: 0,
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload
    },
    setSelectedCategories(state, action) {
      state.selectedCategories = action.payload
    },
    toggleCategory(state, action) {
      const category = action.payload
      if (state.selectedCategories.includes(category)) {
        state.selectedCategories = state.selectedCategories.filter(c => c !== category)
      } else {
        state.selectedCategories = [...state.selectedCategories, category]
      }
    },
    setBrands(state, action) {
      state.brands = action.payload
    },
    toggleBrand(state, action) {
      const brand = action.payload
      if (state.selectedBrands.includes(brand)) {
        state.selectedBrands = state.selectedBrands.filter(b => b !== brand)
      } else {
        state.selectedBrands = [...state.selectedBrands, brand]
      }
    },
    setSelectedBrands(state, action) {
      state.selectedBrands = action.payload
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload
    },
    setAgeRanges(state, action) {
      state.ageRanges = action.payload
    },
    toggleAgeRange(state, action) {
      const ageRange = action.payload
      if (state.selectedAgeRanges.includes(ageRange)) {
        state.selectedAgeRanges = state.selectedAgeRanges.filter(a => a !== ageRange)
      } else {
        state.selectedAgeRanges = [...state.selectedAgeRanges, ageRange]
      }
    },
    setBreedSizes(state, action) {
      state.animalBreedSizes = action.payload
    },
    toggleBreedSize(state, action) {
      const breedSize = action.payload
      if (state.selectedBreedSizes.includes(breedSize)) {
        state.selectedBreedSizes = state.selectedBreedSizes.filter(s => s !== breedSize)
      } else {
        state.selectedBreedSizes = [...state.selectedBreedSizes, breedSize]
      }
    },
    setRating(state, action) {
      state.rating = action.payload
    },
    setSortBy(state, action) {
      state.sortBy = action.payload
    },
    setSortOption(state, action) {
      state.sortOption = action.payload
    },
    setCustomerReview(state, action) {
      state.customerReview = action.payload
    },
    resetFilters(state) {
      return {
        ...initialState,
        categories: state.categories,
        brands: state.brands,
        ageRanges: state.ageRanges,
        animalBreedSizes: state.animalBreedSizes,
        rating: state.rating,
        sortOption: state.sortOption,
      }
    },
  },
})

export const {
  setCategories,
  toggleCategory,
  setBrands,
  toggleBrand,
  setPriceRange,
  toggleAgeRange,
  toggleBreedSize,
  setSortBy,
  setCustomerReview,
  resetFilters,
  setAgeRanges,
  setBreedSizes,
  setRating,
  setSelectedBrands,
  setSelectedCategories,
  setSortOption
} = filterSlice.actions

export default filterSlice.reducer