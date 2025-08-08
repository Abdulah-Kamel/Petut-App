import React from "react";
import ImageUpload from "../components/Ai/ImageUpload";

const BreedIdentifierPage = () => {
  return (
    <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark relative overflow-hidden">
  
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
    
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary_app rounded-full opacity-60 animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-60 left-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-50 animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 right-1/4 w-2 h-2 bg-pink-400 rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary_app/5 to-purple-500/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/5 to-pink-500/10 rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
      
        <div className="text-center mb-16">
     
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary_app/20 via-purple-500/20 to-blue-500/20 rounded-3xl animate-pulse"></div>
            <div className="relative w-28 h-28 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-2xl backdrop-blur-sm border border-primary_app/30 flex items-center justify-center">
              {/* Neural Network Icon */}
              <div className="relative">
                <div className="text-6xl">🧠</div>
                <div
                  className="absolute -top-1 -right-1 text-2xl animate-spin"
                  style={{ animationDuration: "3s" }}
                >
                  ⚡
                </div>
                <div className="absolute -bottom-1 -left-1 text-xl animate-bounce">
                  🔬
                </div>
              </div>
            </div>
            {/* Orbiting Elements */}
            <div
              className="absolute w-36 h-36 border border-primary_app/20 rounded-full animate-spin"
              style={{ animationDuration: "8s" }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary_app rounded-full"></div>
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary_app via-purple-500 to-blue-500 bg-clip-text text-transparent">
              AI Pet Breed
            </span>
            <br />
            <span className="text-neutral dark:text-white">Identifier</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Upload a photo of your pet and let our AI detect the breed with{" "}
            <span className="text-primary_app font-semibold">95% accuracy</span>
            . Get personalized care tips and product suggestions tailored to
            your pet.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <ImageUpload />
        </div>

      </div>
    </div>
  );
};

export default BreedIdentifierPage;
