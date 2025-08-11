import React, { useState } from 'react';
import { RiImageAddLine, RiEditLine, RiDeleteBin6Line } from 'react-icons/ri';
import ImageEditor from './ImageEditor';

const ImageUploadWithEditor = ({ 
  onImageChange, 
  currentImage = null, 
  label = "صورة (اختيارية)",
  className = "",
  showPreview = true 
}) => {
  const [tempImage, setTempImage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت.');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صحيح.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1];
        setTempImage(base64);
        setShowEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSave = (editedImage) => {
    onImageChange(editedImage);
    setShowEditor(false);
    setTempImage(null);
  };

  const handleImageCancel = () => {
    setShowEditor(false);
    setTempImage(null);
  };

  const handleEditExisting = () => {
    if (currentImage) {
      setTempImage(currentImage);
      setShowEditor(true);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      {!currentImage ? (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <RiImageAddLine className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">اضغط لرفع صورة</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG أو JPEG (حد أقصى 5MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        showPreview && (
          <div className="relative inline-block">
            <img
              src={`data:image/jpeg;base64,${currentImage}`}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleEditExisting}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-primary_app text-white rounded hover:bg-opacity-90 transition-colors"
              >
                <RiEditLine size={14} />
                تحرير
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <RiDeleteBin6Line size={14} />
                حذف
              </button>
            </div>
          </div>
        )
      )}

      {showEditor && tempImage && (
        <ImageEditor
          imageData={tempImage}
          onSave={handleImageSave}
          onCancel={handleImageCancel}
        />
      )}
    </div>
  );
};

export default ImageUploadWithEditor;