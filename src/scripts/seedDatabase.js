// scripts/seedDatabase.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// IMPORTANT: Paste your Firebase config here
// You can copy this from your `src/firebase.js` file.
const firebaseConfig = {
    apiKey: "AIzaSyB6pr6a6y63LvKpauCkonCqyV66WAeJEeg",
    authDomain: "petut-55f40.firebaseapp.com",
    projectId: "petut-55f40",
    storageBucket: "petut-55f40.firebasestorage.app",
    messagingSenderId: "724593819082",
    appId: "1:724593819082:web:7d5ab9881bc9de39c8a333",
    measurementId: "G-JDSBQXNWX0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Helper Functions ---

/**
 * Generates a random 6-digit hex color code.
 * @returns {string} A hex color string (e.g., "A5B4FC").
 */
const getRandomHexColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};


/**
 * Generates a random rating object for a product.
 * @returns {{rate: number, count: number}}
 */
const getRandomRating = () => {
    // Generate a random rating between 3.5 and 5.0, with one decimal place
    const rate = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
    // Generate a random number of reviews between 20 and 500
    const count = Math.floor(Math.random() * (500 - 20 + 1)) + 20;
    return {
        rate: parseFloat(rate), // Store as a number, not a string
        count: count
    };
};


// --- Mock Product Data (Original List) ---
const mockProducts = [
    // Food (10)
    { name: "Premium Dog Food - Chicken & Rice", description: "A balanced and nutritious meal for adult dogs.", price: 45.99, category: "Food", stock: 150, brand: "PetCare Essentials" },
    { name: "Gourmet Wet Cat Food - Tuna", description: "Delicious and hydrating wet food made with real tuna flakes.", price: 2.49, category: "Food", stock: 500, brand: "Purrfect Plate" },
    { name: "Grain-Free Salmon Dog Food", description: "Perfect for dogs with sensitive stomachs, rich in omega-3s.", price: 52.99, category: "Food", stock: 120, brand: "Nature's Pet" },
    { name: "Kitten Formula - Milk Replacer", description: "Gentle and easy-to-digest formula for young kittens.", price: 19.99, category: "Food", stock: 90, brand: "PetCare Essentials" },
    { name: "Senior Dog Vitality Chow", description: "Supports joint health and mobility in older dogs.", price: 48.50, category: "Food", stock: 100, brand: "Golden Paws" },
    { name: "Indoor Cat Hairball Control", description: "Helps reduce hairball formation for indoor cats.", price: 22.95, category: "Food", stock: 180, brand: "Feline Fun" },
    { name: "Puppy Growth Formula - Lamb", description: "Specially formulated for the developmental needs of puppies.", price: 25.99, category: "Food", stock: 130, brand: "PetCare Essentials" },
    { name: "Dental Care Cat Treats", description: "Crunchy treats that help clean teeth and freshen breath.", price: 6.99, category: "Food", stock: 400, brand: "Purrfect Plate" },
    { name: "Rabbit & Small Pet Pellets", description: "Timothy hay-based pellets for rabbits, guinea pigs, and chinchillas.", price: 15.99, category: "Food", stock: 110, brand: "Small Wonders" },
    { name: "Wild Bird Seed Mix", description: "A premium blend of seeds to attract a variety of wild birds.", price: 18.99, category: "Food", stock: 250, brand: "Nature's Pet" },

    // Toys (8)
    { name: "Interactive Cat Teaser Wand", description: "Engage your cat in hours of fun with this feather teaser wand.", price: 12.50, category: "Toys", stock: 200, brand: "Feline Fun" },
    { name: "Durable Rubber Chew Bone", description: "Virtually indestructible chew toy for aggressive chewers.", price: 14.99, category: "Toys", stock: 180, brand: "Tough Paws" },
    { name: "Squeaky Plush Squirrel Toy", description: "A soft and cuddly toy with an irresistible squeaker inside.", price: 9.99, category: "Toys", stock: 250, brand: "Comfort Paws" },
    { name: "Catnip-Infused Mouse Trio", description: "A three-pack of lightweight mice filled with potent catnip.", price: 7.99, category: "Toys", stock: 300, brand: "Feline Fun" },
    { name: "Dog Puzzle Feeder Toy", description: "A challenging toy that dispenses treats and stimulates your dog's mind.", price: 18.95, category: "Toys", stock: 120, brand: "Smarty Paws" },
    { name: "Floating Fetch Stick for Water", description: "Brightly colored and floats high on the water for easy fetching.", price: 11.50, category: "Toys", stock: 150, brand: "Aqua Dog" },
    { name: "Crinkle Tunnel for Cats", description: "A collapsible tunnel with a crinkly texture cats can't resist.", price: 22.00, category: "Toys", stock: 100, brand: "Feline Fun" },
    { name: "Rope Tug Toy for Dogs", description: "Great for tug-of-war and promoting healthy teeth and gums.", price: 10.99, category: "Toys", stock: 220, brand: "Tough Paws" },

    // Health (7)
    { name: "Organic Catnip Spray", description: "100% organic catnip spray to rejuvenate old toys and encourage play.", price: 8.99, category: "Health", stock: 300, brand: "Nature's Pet" },
    { name: "Hip & Joint Supplements for Dogs", description: "Chewable tablets with glucosamine to support joint health.", price: 29.99, category: "Health", stock: 100, brand: "PetCare Essentials" },
    { name: "Flea & Tick Prevention Collar", description: "Provides 8 months of continuous protection against fleas and ticks.", price: 49.99, category: "Health", stock: 150, brand: "ShieldGuard" },
    { name: "Probiotic Powder for Pets", description: "Supports digestive health and a balanced gut for dogs and cats.", price: 24.95, category: "Health", stock: 120, brand: "Nature's Pet" },
    { name: "Calming Chews for Anxious Dogs", description: "Helps reduce stress and anxiety during travel or thunderstorms.", price: 19.99, category: "Health", stock: 130, brand: "Comfort Paws" },
    { name: "Pet Ear Cleansing Wipes", description: "Gently removes dirt and wax to prevent ear infections.", price: 12.99, category: "Health", stock: 200, brand: "PetCare Essentials" },
    { name: "Skin & Coat Omega-3 Oil", description: "Liquid supplement to promote a shiny coat and healthy skin.", price: 21.50, category: "Health", stock: 110, brand: "Nature's Pet" },

    // Accessories (8)
    { name: "Heavy-Duty Retractable Leash", description: "Durable 16-foot retractable leash for dogs up to 110 lbs.", price: 24.95, category: "Accessories", stock: 120, brand: "WalkEasy" },
    { name: "Stainless Steel Food & Water Bowls", description: "Set of two non-slip, rust-resistant bowls.", price: 19.99, category: "Accessories", stock: 300, brand: "PetCare Essentials" },
    { name: "Reflective Safety Dog Collar", description: "Adjustable nylon collar with reflective stitching for night visibility.", price: 14.99, category: "Accessories", stock: 250, brand: "WalkEasy" },
    { name: "Pet Travel Carrier (Airline Approved)", description: "Soft-sided carrier with mesh ventilation and padded strap.", price: 39.99, category: "Accessories", stock: 90, brand: "JetSet Pet" },
    { name: "Customizable Pet ID Tag", description: "Engrave your pet's name and your phone number for safety.", price: 9.95, category: "Accessories", stock: 500, brand: "ID-Me" },
    { name: "Car Seat Cover for Dogs", description: "Waterproof and durable cover to protect your car's upholstery.", price: 34.99, category: "Accessories", stock: 110, brand: "Road Paws" },
    { name: "Poop Bags with Dispenser", description: "900-count of extra-thick, leak-proof waste bags.", price: 15.99, category: "Accessories", stock: 600, brand: "PetCare Essentials" },
    { name: "Silicone Licking Mat for Pets", description: "Reduces anxiety and boredom. Spread with peanut butter or yogurt.", price: 11.99, category: "Accessories", stock: 180, brand: "Comfort Paws" },

    // Grooming (7)
    { name: "Oatmeal Soothing Shampoo", description: "Gentle shampoo for dogs with dry, itchy skin.", price: 16.99, category: "Grooming", stock: 140, brand: "Nature's Pet" },
    { name: "Self-Cleaning Slicker Brush", description: "Removes loose undercoat and tangles with the push of a button.", price: 18.50, category: "Grooming", stock: 160, brand: "GroomEasy" },
    { name: "Professional Pet Nail Clippers", description: "Sharp, stainless steel clippers with a safety guard.", price: 14.95, category: "Grooming", stock: 200, brand: "GroomEasy" },
    { name: "Waterless Cat Shampoo Foam", description: "No-rinse foam to freshen up your cat's coat between baths.", price: 13.99, category: "Grooming", stock: 150, brand: "Feline Fun" },
    { name: "De-Shedding Tool for Dogs", description: "Reduces shedding by up to 95% in long and short-haired dogs.", price: 29.95, category: "Grooming", stock: 120, brand: "GroomEasy" },
    { name: "Pet Grooming Gloves", description: "Wearable gloves to gently brush and massage your pet.", price: 12.99, category: "Grooming", stock: 250, brand: "Comfort Paws" },
    { name: "Electric Pet Paw Grinder", description: "A quiet and low-vibration alternative to nail clipping.", price: 25.99, category: "Grooming", stock: 100, brand: "GroomEasy" },

    // Beds & Furniture (5)
    { name: "Cozy Pet Bed (Large)", description: "A soft, plush bed for large-breed dogs or multiple cats.", price: 55.00, category: "Beds & Furniture", stock: 80, brand: "Comfort Paws" },
    { name: "Orthopedic Memory Foam Dog Bed", description: "Relieves pressure on joints, perfect for senior or arthritic dogs.", price: 89.99, category: "Beds & Furniture", stock: 60, brand: "Comfort Paws" },
    { name: "Multi-Level Cat Tree with Scratching Posts", description: "A complete activity center for your cat to play, sleep, and scratch.", price: 129.99, category: "Beds & Furniture", stock: 40, brand: "Feline Fun" },
    { name: "Foldable Metal Dog Crate", description: "A secure and portable crate for training and travel.", price: 65.50, category: "Beds & Furniture", stock: 70, brand: "PetCare Essentials" },
    { name: "Window-Mounted Cat Perch", description: "Gives your cat a front-row seat to the world outside.", price: 28.99, category: "Beds & Furniture", stock: 110, brand: "Feline Fun" },

    // Training (5)
    { name: "Puppy Training Pads (100-Pack)", description: "Super-absorbent pads for house-training your new puppy.", price: 29.99, category: "Training", stock: 200, brand: "PetCare Essentials" },
    { name: "Dog Training Clicker with Wrist Strap", description: "A simple and effective tool for positive reinforcement training.", price: 6.95, category: "Training", stock: 400, brand: "Smarty Paws" },
    { name: "High-Value Training Treats - Beef", description: "Small, soft, and smelly treats that dogs love. Perfect for training.", price: 9.99, category: "Training", stock: 300, brand: "Nature's Pet" },
    { name: "Pet Corrector Spray", description: "Emits a harmless hiss of air to interrupt unwanted behaviors.", price: 11.99, category: "Training", stock: 150, brand: "Smarty Paws" },
    { name: "Anti-Barking Ultrasonic Device", description: "A humane device that uses ultrasonic sound to deter barking.", price: 35.99, category: "Training", stock: 80, brand: "Quiet Paws" },
];

// --- Data Enhancement ---

// Add a random rating and a dynamic placeholder image to each product
const enhancedProducts = mockProducts.map(product => {
    const bgColor = getRandomHexColor();
    const textColor = getRandomHexColor();

    return {
        ...product,
        rating: getRandomRating(),
        imageUrl: `https://placehold.co/600x400/${bgColor}/${textColor}?text=${encodeURIComponent(product.name)}`
    };
});


// --- Seeding Function ---
const seedDatabase = async () => {
    try {
        console.log('Starting to seed the database with 50 enhanced products...');
        const productsCollectionRef = collection(db, 'products');

        // Using Promise.all for slightly better performance
        const promises = enhancedProducts.map(product => {
            console.log(`Queueing product: ${product.name}`);
            return addDoc(productsCollectionRef, product);
        });

        await Promise.all(promises);

        console.log('---------------------------------');
        console.log('Database seeding completed successfully!');
        process.exit(0); // Exit the script on success
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1); // Exit with an error code
    }
};

// Run the function
seedDatabase();