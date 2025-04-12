import { useState, useEffect } from "react";
import PeaceImg from "../assets/peace-mind.jpg";
import BikeImg from "../assets/bike.jpg";
import VideoImg from "../assets/video-game.jpg";

const ImageSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const illustrations = [
    {
      image: PeaceImg,
      text: "When your tasks are in order, your mind follows — clarity begins with a good system.",
    },
    {
      image: VideoImg,
      text: "Automate the routine, so your focus can fuel the remarkable.",
    },
    {
      image: BikeImg,
      text: "A fast task done well today is better than a perfect one postponed for tomorrow.",
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) =>
      prev === illustrations.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };
  const dotsIndicator = illustrations.length;

  // Auto-rotate slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  // Function to detect screen size
  let screenSize = `translateX(-${(activeSlide * 100) / 1}%)`;

  return (
    <div className="overflow-hidden  relative h-full rounded-2xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: screenSize,
        }}
      >
        {illustrations.map((illustration, index) => (
          <div key={index} className="w-full relative flex-shrink-0">
            <img
              src={illustration.image}
              className="w-full h-full object-cover"
            />

            <p className="text-gray-900 font-medium text-center left-0 right-0 text-3xl flex justify-center  absolute top-10 ">
              {illustration.text}
            </p>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center  absolute bottom-5 left-0 right-0  space-x-2">
        {Array(dotsIndicator)
          .fill(0)
          .map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                index === activeSlide ? "bg-green-400" : "bg-gray-800"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
      </div>
    </div>
  );
};

export default ImageSlider;
