import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RiZoomInLine, RiZoomOutLine, RiCheckLine, RiCloseLine, RiDragMove2Line, RiCropLine } from 'react-icons/ri';

const ImageEditor = ({ imageData, onSave, onCancel }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 300, height: 200 });
  const [resizing, setResizing] = useState(null);

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate image dimensions
    const aspectRatio = img.width / img.height;
    let drawWidth = canvas.width * zoom;
    let drawHeight = drawWidth / aspectRatio;
    
    if (drawHeight < canvas.height * zoom) {
      drawHeight = canvas.height * zoom;
      drawWidth = drawHeight * aspectRatio;
    }
    
    const x = (canvas.width - drawWidth) / 2 + position.x;
    const y = (canvas.height - drawHeight) / 2 + position.y;
    
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
    
    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clear crop area
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    
    // Draw crop border and handles
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    
    if (cropMode) {
      // Draw resize handles
      const handleSize = 8;
      ctx.fillStyle = '#3B82F6';
      // Corner handles
      ctx.fillRect(cropArea.x - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
      ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y - handleSize/2, handleSize, handleSize);
      ctx.fillRect(cropArea.x - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
      ctx.fillRect(cropArea.x + cropArea.width - handleSize/2, cropArea.y + cropArea.height - handleSize/2, handleSize, handleSize);
    }
  }, [imageLoaded, zoom, position, cropArea, cropMode]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    img.src = `data:image/jpeg;base64,${imageData}`;
  }, [imageData]);

  useEffect(() => {
    if (imageLoaded) {
      drawImage();
    }
  }, [drawImage, imageLoaded]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  const getResizeHandle = (mouseX, mouseY) => {
    const handleSize = 8;
    const tolerance = 5;
    
    // Check corner handles
    if (Math.abs(mouseX - cropArea.x) < tolerance && Math.abs(mouseY - cropArea.y) < tolerance) return 'nw';
    if (Math.abs(mouseX - (cropArea.x + cropArea.width)) < tolerance && Math.abs(mouseY - cropArea.y) < tolerance) return 'ne';
    if (Math.abs(mouseX - cropArea.x) < tolerance && Math.abs(mouseY - (cropArea.y + cropArea.height)) < tolerance) return 'sw';
    if (Math.abs(mouseX - (cropArea.x + cropArea.width)) < tolerance && Math.abs(mouseY - (cropArea.y + cropArea.height)) < tolerance) return 'se';
    
    return null;
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (cropMode) {
      const handle = getResizeHandle(mouseX, mouseY);
      if (handle) {
        setResizing(handle);
        setDragStart({ x: mouseX, y: mouseY });
        return;
      }
      
      // Check if clicking inside crop area to move it
      if (mouseX >= cropArea.x && mouseX <= cropArea.x + cropArea.width &&
          mouseY >= cropArea.y && mouseY <= cropArea.y + cropArea.height) {
        setIsDragging('crop');
        setDragStart({ x: mouseX, y: mouseY });
        return;
      }
    }
    
    setIsDragging('image');
    setDragStart({ x: mouseX, y: mouseY });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (resizing) {
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      setCropArea(prev => {
        let newArea = { ...prev };
        
        switch (resizing) {
          case 'nw':
            newArea.x = Math.max(0, prev.x + deltaX);
            newArea.y = Math.max(0, prev.y + deltaY);
            newArea.width = Math.max(50, prev.width - deltaX);
            newArea.height = Math.max(50, prev.height - deltaY);
            break;
          case 'ne':
            newArea.y = Math.max(0, prev.y + deltaY);
            newArea.width = Math.max(50, prev.width + deltaX);
            newArea.height = Math.max(50, prev.height - deltaY);
            break;
          case 'sw':
            newArea.x = Math.max(0, prev.x + deltaX);
            newArea.width = Math.max(50, prev.width - deltaX);
            newArea.height = Math.max(50, prev.height + deltaY);
            break;
          case 'se':
            newArea.width = Math.max(50, prev.width + deltaX);
            newArea.height = Math.max(50, prev.height + deltaY);
            break;
        }
        
        return newArea;
      });
      
      setDragStart({ x: mouseX, y: mouseY });
    } else if (isDragging === 'crop') {
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(400 - prev.width, prev.x + deltaX)),
        y: Math.max(0, Math.min(300 - prev.height, prev.y + deltaY))
      }));
      
      setDragStart({ x: mouseX, y: mouseY });
    } else if (isDragging === 'image') {
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragStart({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizing(null);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    
    // Create new canvas for cropped image
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    
    cropCanvas.width = cropArea.width;
    cropCanvas.height = cropArea.height;
    
    // Calculate source coordinates
    const aspectRatio = img.width / img.height;
    let drawWidth = canvas.width * zoom;
    let drawHeight = drawWidth / aspectRatio;
    
    if (drawHeight < canvas.height * zoom) {
      drawHeight = canvas.height * zoom;
      drawWidth = drawHeight * aspectRatio;
    }
    
    const sourceX = (canvas.width - drawWidth) / 2 + position.x;
    const sourceY = (canvas.height - drawHeight) / 2 + position.y;
    
    // Calculate crop area in source image coordinates
    const scaleX = img.width / drawWidth;
    const scaleY = img.height / drawHeight;
    
    const cropSourceX = Math.max(0, (cropArea.x - sourceX) * scaleX);
    const cropSourceY = Math.max(0, (cropArea.y - sourceY) * scaleY);
    const cropSourceWidth = Math.min(img.width - cropSourceX, cropArea.width * scaleX);
    const cropSourceHeight = Math.min(img.height - cropSourceY, cropArea.height * scaleY);
    
    cropCtx.drawImage(
      img,
      cropSourceX, cropSourceY, cropSourceWidth, cropSourceHeight,
      0, 0, cropArea.width, cropArea.height
    );
    
    const croppedBase64 = cropCanvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    onSave(croppedBase64);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">تحرير الصورة</h3>
        
        <div className="mb-4 text-center">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-300 rounded cursor-move max-w-full"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMouseDown(e);
            }}
            onMouseMove={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMouseMove(e);
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMouseUp(e);
            }}
            onMouseLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMouseUp(e);
            }}
            style={{ 
              cursor: resizing ? 'nw-resize' : 
                     isDragging === 'crop' ? 'move' : 
                     isDragging === 'image' ? 'grabbing' : 
                     cropMode ? 'crosshair' : 'grab' 
            }}
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
            <RiDragMove2Line size={14} />
            اسحب الصورة لتحريكها
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCropMode(!cropMode);
            }}
            className={`p-2 rounded-full transition-colors ${
              cropMode 
                ? 'bg-primary_app text-white' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <RiCropLine size={20} className={cropMode ? 'text-white' : 'text-gray-700 dark:text-gray-300'} />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleZoomOut();
            }}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            disabled={zoom <= 0.5}
          >
            <RiZoomOutLine size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(zoom * 100)}%
            </span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setZoom(parseFloat(e.target.value));
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-20 mt-1"
            />
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleZoomIn();
            }}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            disabled={zoom >= 3}
          >
            <RiZoomInLine size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mb-4 text-center">
          {cropMode ? (
            <span className="flex items-center justify-center gap-1">
              <RiCropLine size={14} />
              اسحب الزوايا لتغيير حجم منطقة القص أو اسحب المنطقة لتحريكها
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1">
              <RiDragMove2Line size={14} />
              اسحب الصورة لتحريكها
            </span>
          )}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
          >
            <RiCloseLine size={18} />
            إلغاء
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSave();
            }}
            className="flex-1 px-4 py-2 bg-primary_app text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 transition-colors"
          >
            <RiCheckLine size={18} />
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;