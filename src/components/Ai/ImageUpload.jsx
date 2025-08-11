import React, { useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import breedsInfo from "../../data/breedsInfo.json";
import ResultCard from "./ResultCard";
import { getAuth } from "firebase/auth";
import {collection,addDoc,serverTimestamp,} from "firebase/firestore";
import { db } from "../../firebase";
import {Upload,Camera,CheckCircle,Loader,Sparkles,AlertTriangle,X,} from "lucide-react";

const ImageUpload = () => {
  const [model, setModel] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showNotAnimalError, setShowNotAnimalError] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  useEffect(() => {
    const loadModel = async () => {
      const modelURL = "/model/model.json";
      const metadataURL = "/model/metadata.json";
      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const isAnimalDetected = (predictions) => {
    const topPrediction = predictions[0];
    if (topPrediction.probability < 70) {
      return false;
    }
    const hasReasonableConfidence = predictions.some(
      (p) => p.probability >= 20
    );
    return hasReasonableConfidence;
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file processing
  const handleFile = async (file) => {
    if (file && model) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setAnalyzing(true);
      setShowNotAnimalError(false);

      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = "anonymous";

      img.onload = async () => {
        const results = await model.predict(img);
        const sorted = results
          .map((p) => ({
            className: p.className.trim(),
            probability: Math.round(p.probability * 100),
          }))
          .sort((a, b) => b.probability - a.probability);

        if (!isAnimalDetected(sorted)) {
          setAnalyzing(false);
          setShowNotAnimalError(true);
          return;
        }

        const enriched = sorted.map((pred) => ({
          ...pred,
          ...(breedsInfo[pred.className] || {}),
        }));

        setPredictions(enriched);
        setAnalyzing(false);
        setShowResults(true);
        await saveDetection(file, enriched[0]);
      };
    };
  };
  

    
     
  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const resetAnalysis = () => {
    setImagePreview(null);
    setAnalyzing(false);
    setPredictions([]);
    setShowResults(false);
    setShowNotAnimalError(false);
  };

  const dismissError = () => {
    setShowNotAnimalError(false);
  };

  const saveDetection = async (file, breedData) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
  
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      const imageBase64 = await toBase64(file);

      await addDoc(collection(db, "ai"), {
        userId: user.uid,
        userEmail: user.email,
        imageBase64, 
        breed: breedData.className || "Unknown",
        probability: breedData.probability || null,
        ...breedData, 
        createdAt: serverTimestamp(),
      });

      console.log("Data saved to Firestore ");
    } catch (error) {
      console.error(" Error saving detection:", error);
    }
  };

    


  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-8">
     
        <div className="bg-white dark:bg-[#313340] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="text-center py-8 px-6 bg-gradient-to-r from-primary_app/5 to-blue-500/5 border-b border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary_app/10 rounded-2xl mb-4">
              <Camera className="w-8 h-8 text-primary_app" />
            </div>
            <h2 className="text-2xl font-bold text-neutral dark:text-white mb-2">
              Upload Your Pet's Photo
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose a clear, high-quality image for best results
            </p>
          </div>

          <div className="p-8">
            {!imagePreview ? (
              <div className="text-center">
                <div
                  className={`relative border-2 border-dashed rounded-3xl  p-16 transition-all duration-300 cursor-pointer group ${
                    dragActive
                      ? "border-primary_app bg-primary_app/5 scale-[1.02]"
                      : "border-gray-300 dark:border-gray-600 hover:border-primary_app/60 hover:bg-primary_app/5"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("imageInput").click()}
                >
                  {/* Text Content */}
                  <div className="space-y-4">
                    <h3 className="  text-neutral dark:text-white">
                      {dragActive
                        ? "Drop your image here"
                        : "Drag & Drop or Click to Upload"}
                    </h3>

                    {/* Upload Button */}
                    <div className="pt-4">
                      <div
                        className={`inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                          dragActive
                            ? "bg-primary_app/90 text-white scale-105 shadow-lg"
                            : "bg-primary_app/80 text-white hover:bg-primary_app hover:scale-105 hover:shadow-xl"
                        }`}
                      >
                        <Upload className="h-5 mr-3" />
                        Upload Image
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 dark:text-gray-500 pt-2">
                      Maximum file size: 10MB
                    </div>
                  </div>

                  {/* Floating Elements */}
                  {dragActive && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-6 left-6 w-3 h-3 bg-primary_app/10 rounded-full animate-bounce opacity-10"></div>
                      <div
                        className="absolute top-6 right-6 w-2 h-2 bg-blue-500/10 rounded-full animate-bounce opacity-10"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="absolute bottom-6 left-6 w-2 h-2 bg-purple-500/10 rounded-full animate-bounce opacity-10"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                      <div
                        className="absolute bottom-6 right-6 w-3 h-3 bg-primary_app/10 rounded-full animate-bounce opacity-10"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                    </div>
                  )}
                </div>

                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-3 border-dashed border-primary_app/60 rounded-3xl p-6 bg-primary_app/5">
                  <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
                    <img
                      src={imagePreview}
                      className="w-full max-h-80 object-contain"
                      alt="Pet"
                    />
                    <div className="absolute top-4 right-4 w-12 h-12 bg-primary_app rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-6 text-primary_app font-semibold text-lg">
                    <CheckCircle className="w-6 h-6 mr-3" />
                    Image uploaded successfully!
                  </div>
                </div>

                {!showResults && !showNotAnimalError && (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={resetAnalysis}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                      Try Another Photo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

    
        {showNotAnimalError && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-2xl font-bold">
                      No Animal Detected in This Image
                    </h3>
                    <p className="text-red-100">
                      Please upload a clear photo of your pet
                    </p>
                  </div>
                </div>
                <button
                  onClick={dismissError}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-gray-700 dark:text-gray-300">
                <p className="mb-4 font-semibold">Tips for Best Results:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ensure the image contains a clearly visible animal</li>
                  <li>Use good lighting and avoid heavy shadows</li>
                  <li>Make sure the pet is clearly visible in the photo</li>
                  <li>Avoid blurry or unclear images</li>
                  <li>The animal should be the main focus of the image</li>
                  <li>
                    Try different angles if the first attempt doesn't work
                  </li>
                </ul>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={resetAnalysis}
                  className="btn-primary-app px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg inline-flex items-center"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Try Another Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {analyzing && (
          <div className="text-center space-y-6">
            <div className="bg-white dark:bg-[#313340] rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <button
                disabled
                className="bg-primary_app text-white px-8 py-4 rounded-2xl font-semibold cursor-not-allowed inline-flex items-center text-lg mb-6"
              >
                <Loader className="w-6 h-6 mr-3 animate-spin" />
                Analyzing Your Pet...
              </button>

              <div className="max-w-md mx-auto">
                <div className="text-primary_app mb-4 text-base flex items-center justify-center font-medium">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Our AI is carefully analyzing your pet's features...
                </div>
                <div className="w-full bg-primary_app/20 rounded-full h-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary_app to-blue-500 h-full rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results - استخدام الكومبونت الجديد */}
        {showResults && predictions.length > 0 && (
          <ResultCard
            predictions={predictions}
            onAnalyzeAnother={resetAnalysis}
          />
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
