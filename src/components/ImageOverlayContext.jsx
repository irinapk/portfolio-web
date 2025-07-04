import {createContext, useContext, useEffect, useState} from 'react';

const ImageOverlayContext = createContext();

export function ImageOverlayProvider({ children }) {
  const [imageSrc, setImageSrc] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const open = (src, alt) => {
    setImageSrc(src);
    setImageAlt(src);
  };
  const close = () => {
    setImageSrc("");
    setImageAlt("");
  }

  useEffect(() => {
    if (imageSrc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [imageSrc]);

  return (
    <ImageOverlayContext.Provider value={{ imageSrc, open, close }}>
      {children}
      {imageSrc!=="" && (
        <div className="viewer-overlay" onClick={close}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="viewer-overlay-image"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="viewer-close-btn" onClick={close}>×</button>
        </div>
      )}
    </ImageOverlayContext.Provider>
  );
}

export function useImageOverlay() {
  return useContext(ImageOverlayContext);
}