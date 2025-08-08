import React from "react";
import {
  Heart,
  Target,
  Sparkles,
  CheckCircle,
  Camera,
  Info,
  Clock,
  Activity,
  Scissors,
} from "lucide-react";

const ResultCard = ({ predictions, onAnalyzeAnother }) => {
  if (!predictions || predictions.length === 0) {
    return null;
  }

  const topPrediction = predictions[0];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary_app/10 rounded-2xl mb-4">
          <Target className="w-8 h-8 text-primary_app" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-2">
          Analysis Complete
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base">
          We've identified your pet's breed with high confidence
        </p>
      </div>

      {/* Main Result Card */}
      <div className="bg-white dark:bg-[#313340] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Top Header with Result */}
        <div className=" bg-gradient-to-r from-primary_app/5 to-blue-500/5  dark:from-primary_app/10 dark:to-orange-900/20 p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-primary_app/20">
                <Heart className="w-6 h-6 text-primary_app" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-neutral dark:text-white mb-1">
                  {topPrediction.className}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  {topPrediction.probability}% confidence match
                </p>
              </div>
            </div>
            <div className="w-10 h-10 bg-primary_app/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary_app" />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30">
              <div className="flex items-center mb-2">
                <Info className="w-5 h-5 text-primary_app mr-2" />
                <h4 className="font-medium text-neutral dark:text-white">
                  Type
                </h4>
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                {topPrediction.type}
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-primary_app mr-2" />
                <h4 className="font-medium text-neutral dark:text-white">
                  Lifespan
                </h4>
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-medium">
                {topPrediction.lifespan}
              </p>
            </div>
          </div>

          {/* Characteristics */}
          {topPrediction.characteristics && (
            <div className="bg-gradient-to-r from-primary_app/5 to-orange-50 dark:from-primary_app/10 dark:to-orange-900/10 rounded-xl p-5 border border-orange-100 dark:border-orange-800/30">
              <h4 className="font-medium text-neutral dark:text-white mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary_app" />
                Key Characteristics
              </h4>
              <div className="flex flex-wrap gap-2">
                {topPrediction.characteristics.map((trait, idx) => (
                  <span
                    key={idx}
                    className="bg-white dark:bg-gray-700 text-primary_app dark:text-orange-300 px-3 py-1.5 rounded-full text-sm font-medium border border-primary_app/20 shadow-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Care Information */}
          {topPrediction.care && (
            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-5 border border-orange-100 dark:border-orange-800/30">
              <h4 className="font-medium text-primary_app dark:text-orange-300 mb-3">
                Care Information
              </h4>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {topPrediction.care}
              </p>
            </div>
          )}

          {/* Exercise & Grooming */}
          {(topPrediction.exercise || topPrediction.grooming) && (
            <div className="grid md:grid-cols-2 gap-4">
              {topPrediction.exercise && (
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30">
                  <div className="flex items-center mb-2">
                    <Activity className="w-5 h-5 text-primary_app mr-2" />
                    <h4 className="font-medium text-primary_app dark:text-orange-300">
                      Exercise Needs
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                    {topPrediction.exercise}
                  </p>
                </div>
              )}

              {topPrediction.grooming && (
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30">
                  <div className="flex items-center mb-2">
                    <Scissors className="w-5 h-5 text-primary_app mr-2" />
                    <h4 className="font-medium text-primary_app dark:text-orange-300">
                      Grooming
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                    {topPrediction.grooming}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recommended Products */}
          {topPrediction.products && (
            <div className="bg-gradient-to-r from-orange-50 to-primary_app/5 dark:from-orange-900/10 dark:to-primary_app/10 rounded-xl p-5 border border-orange-100 dark:border-orange-800/30">
              <h4 className="font-medium text-neutral dark:text-white mb-4 flex items-center">
                <div className="w-6 h-6 bg-primary_app rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                Recommended Products
              </h4>
              <div className="space-y-3">
                {topPrediction.products.map((prod, idx) => (
                  <div
                    key={idx}
                    className="flex items-start bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-orange-100 dark:border-gray-600 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-primary_app rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                      {prod}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer tip */}
              <div className="mt-4 pt-3 border-t border-orange-200 dark:border-orange-800/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  💡 Recommendations based on breed characteristics
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center pt-2">
        <button
          onClick={onAnalyzeAnother}
          className="bg-primary_app hover:bg-primary_app/90 text-white px-8 py-3 rounded-xl shadow-sm hover:shadow-md inline-flex items-center font-medium transition-all duration-200 hover:scale-105"
        >
          <Camera className="w-5 h-5 mr-2" />
          Analyze Another Pet
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
