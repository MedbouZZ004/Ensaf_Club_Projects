import React, { useEffect, useState } from 'react'
import video from '../assets/start_show.mp4'

// Full-screen intro video shown on first load. Closes on end or when user skips.
// Props:
// - onFinish: () => void called when intro should close
// - minDuration: minimum ms to show before allowing auto-close (default 1200)
const Welcoming = ({ onFinish, minDuration = 1200 }) => {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCanClose(true), minDuration);
    return () => clearTimeout(t);
  }, [minDuration]);

  const maybeFinish = () => {
    if (canClose && typeof onFinish === 'function') onFinish();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <video
        src={video}
        autoPlay
        muted
        playsInline
        onEnded={maybeFinish}
        className="w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={() => typeof onFinish === 'function' && onFinish()}
        className="absolute top-4 right-4 px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20"
      >
        Skip
      </button>
    </div>
  )
}

export default Welcoming