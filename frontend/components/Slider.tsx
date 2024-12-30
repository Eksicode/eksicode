"use client";
import React, { useState, useEffect, useCallback } from "react";
import Button from "@components/Ui/Button";
import "../styles/slider.css";

interface CustomCarouselProps {
  children: React.ReactNode[];
}

const Slider: React.FC<CustomCarouselProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(true);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const storedOpenState = localStorage.getItem("slider");
    if (storedOpenState !== null) {
      setIsOpen(JSON.parse(storedOpenState));
    }
  }, []);

  useEffect(() => {
    if (isSliding) {
      const id = setTimeout(() => {
        moveToNextSlide();
      }, 5000);
      setTimerId(id);
      return () => clearTimeout(id);
    }
  }, [isSliding, activeIndex]);

  const moveToNextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % children.length);
  }, [children.length]);

  const moveToPreviousSlide = useCallback(() => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
  }, [children.length]);

  const stopAutoPlay = useCallback(() => {
    if (timerId) {
      clearTimeout(timerId);
      setIsSliding(false);
    }
  }, [timerId]);

  const startAutoPlay = useCallback(() => {
    setIsSliding(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem("slider", JSON.stringify(false));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="relative mb-3 bg-white border rounded-lg">
      <div className="absolute z-20 flex justify-between right-0 top-2 items-center mx-2 mb-2">
        <Button onClick={handleClose} variant="primary">
          Gizle
        </Button>
      </div>
      <div
        className="container__slider bg-white border rounded-lg"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        {children.map((item, index) => (
          <div
            className={`slider__item slider__item-active-${activeIndex + 1}`}
            key={index}
          >
            {item}
          </div>
        ))}

        <div className="container__slider__links">
          {children.map((_, index) => (
            <button
              key={index}
              className={
                activeIndex === index
                  ? "container__slider__links-small container__slider__links-small-active"
                  : "container__slider__links-small"
              }
              onClick={() => setActiveIndex(index)}
            ></button>
          ))}
        </div>

        <button
          className="slider__btn-next"
          onClick={moveToNextSlide}
        >
          {">"}
        </button>
        <button
          className="slider__btn-prev bg-gray-400 rounded-sm text-white"
          onClick={moveToPreviousSlide}
        >
          {"<"}
        </button>
      </div>
    </div>
  );
};

export default Slider;
