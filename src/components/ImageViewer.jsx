import { useImageOverlay } from './ImageOverlayContext';


export default function ImageViewer({ src, alt = "thumbnail" }) {

  const { open } = useImageOverlay();

  return (
    <img
      src={src}
      alt={alt}
      onClick={() => open(src, alt)}
      className="viewer-thumbnail"
    />
  );
}