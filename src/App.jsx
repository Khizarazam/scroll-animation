import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const canvasRef = useRef(null);

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
      maxIndex: 382
    };

    let imagesLoaded = 0;
    const images = [];

    function preloadImages() {
      for (let i = 1; i <= frames.maxIndex; i++) {
        const imageUrl =  `/scroll-animation/compressed_images/frame_0028.jpg`;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          imagesLoaded++
          if (imagesLoaded === frames.maxIndex) {
            LoadImage(frames.currentIndex);
            startAnimation();
          }
        };
        images.push(img);
      }
    }

    function LoadImage(index) {
      if (index >= 0 && index <= frames.maxIndex) {
        const img = images[index];

        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.max(scaleX, scaleY);

        const newWidth = img.width * scale;
        const newHeight = img.height * scale;

        const offsetX = (canvas.width - newWidth) / 2;
        const offsetY = (canvas.height - newHeight) / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
        frames.currentIndex = index;
      }
    }

    function startAnimation() {

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".parent",
          start: "top top",
          scrub: 2,
          end: "bottom bottom",

        }
      });

      tl.to(frames, {
        currentIndex: frames.maxIndex,
        onUpdate: function () {
          LoadImage(Math.floor(frames.currentIndex));
        }
      });
    }

    preloadImages()
  }, [])

  return (
    <>
      <div className="w-full bg-zinc-900">

        <div className="parent relative top-0 left-0 w-full h-[1400vh]">
          <div className="w-full sticky top-0 left-0 h-screen">
            <canvas ref={canvasRef} id="frame" className="w-full h-screen"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
