import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const images = [];
  let imagesLoaded = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error("Failed to get 2D context.");
      return;
    }

    const frames = {
      currentIndex: 0,
      maxIndex: 382,
    };

    function preloadInitialImages() {
      const initialLoadCount = 10; // Load first 10 images initially
      for (let i = 1; i <= initialLoadCount; i++) {
        loadImage(i);
      }
    }

    function preloadRemainingImages() {
      for (let i = 11; i <= frames.maxIndex; i++) {
        loadImage(i);
      }
    }

    function loadImage(index) {
      const imageUrl = `/scroll-animation/compressed_images/frame_${index.toString().padStart(4, "0")}.jpg`;
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        images[index - 1] = img;
        imagesLoaded++;
        if (index === 1) {
          LoadImage(0); // Load the first image initially
        }
        if (imagesLoaded === frames.maxIndex) {
          setLoading(false); // Hide loading spinner when all images are loaded
          startAnimation();
        }
      };
    }

    function LoadImage(index) {
      if (index >= 0 && index <= frames.maxIndex) {
        const img = images[index];
        if (img) {
          const scaleX = canvas.width / img.width;
          const scaleY = canvas.height / img.height;
          const scale = Math.max(scaleX, scaleY);
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
          const offsetX = (canvas.width - newWidth) / 2;
          const offsetY = (canvas.height - newHeight) / 2;
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
          frames.currentIndex = index;
        }
      }
    }

    function startAnimation() {
      gsap.timeline({
        scrollTrigger: {
          trigger: '.parent',
          start: 'top top',
          scrub: 2,
          end: 'bottom bottom',
        },
      }).to(frames, {
        currentIndex: frames.maxIndex,
        onUpdate: function () {
          LoadImage(Math.floor(frames.currentIndex));
        },
      });
    }

    preloadInitialImages();
    preloadRemainingImages();

  }, []);

  return (
    <div className="w-full bg-zinc-900">
      {loading && (
        <div className="loading-spinner fixed top-0 left-0 w-full h-full flex justify-center items-center text-white">
          Loading...
        </div>
      )}
      <div className="parent relative top-0 left-0 w-full h-[1400vh]">
        <div className="w-full sticky top-0 left-0 h-screen">
          <canvas ref={canvasRef} id="frame" className="w-full h-screen"></canvas>
        </div>
      </div>
    </div>
  );
}

export default App;
