import React from "react";

type LoadingAnimationProps = {
  style?: string;
};

const LoadingAnimation = ({ style }: LoadingAnimationProps) => {
  return style === "text" ? (
    <div className="animate-pulse">Yükleniyor...</div>
  ) : (
    <div className="flex gap-2">
      <div className="w-3 h-3 rounded-full animate-pulse bg-eksiCode"></div>
      <div className="w-3 h-3 rounded-full animate-pulse bg-eksiCode"></div>
      <div className="w-3 h-3 rounded-full animate-pulse bg-eksiCode"></div>
    </div>
  );
};

export default LoadingAnimation;
