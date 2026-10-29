import React, { useEffect, useState, useRef } from 'react';

export default function AnimatedWaveBackground({ children }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      setTime((prev) => prev + 0.03);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const generatePath = (layerIndex) => {
    const width = 1440;
    const height = 600;
    const points = [];
    const step = 15;
    const layerOffset = layerIndex * 1.5;
    const amp = 23 * (1 - layerIndex * 0.15);
    const freq = 0.009 * (1 + layerIndex * 0.2);
    const speed = 3;
    const isUp = 'up' === 'up';

    const baseHeight = isUp 
      ? height - (layerIndex + 1) * (height / (2 + 2))
      : (layerIndex + 1) * (height / (2 + 2));

    for (let x = 0; x <= width + step; x += step) {
      const y = baseHeight + 
        Math.sin(x * freq + time * speed * 0.05 + layerOffset) * amp +
        Math.cos((x * freq * 0.5) - time * speed * 0.03) * (amp * 0.5);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return isUp
      ? `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`
      : `M 0,0 L ${points.join(' L ')} L ${width},0 Z`;
  };

  const waveColors = ["#ffa200","#ffc800"];

  return (
    <div className="relative min-h-dvh w-full">
      <div className="fixed inset-0 w-screen h-screen overflow-hidden -z-10" style={{ backgroundColor: '#ffeed6' }}>
        {/* SVG Wave Background */}
        <div className="absolute inset-0 w-full h-full">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
          >
            <defs>
              {waveColors.map((color, i) => (
                <linearGradient key={i} id={`wave-grad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="1" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                </linearGradient>
              ))}
            </defs>
            {waveColors.map((_, i) => (
              <path
                key={i}
                d={generatePath(i)}
                fill={`url(#wave-grad-${i})`}
                className="transition-all duration-75 ease-linear"
              />
            ))}
          </svg>
        </div>
      </div>
      <div className="relative z-0 min-h-dvh flex flex-col">
        {children}
      </div>
    </div>
  );
}