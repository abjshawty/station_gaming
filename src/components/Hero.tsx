import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

const BACKGROUND_IMAGES = [
  "https://ik.imagekit.io/abjshawty/soul/red_dead.jpeg?updatedAt=1761047707571",
  "https://ik.imagekit.io/abjshawty/soul/bo3.jpeg?updatedAt=1761047706855",
  "https://ik.imagekit.io/abjshawty/soul/battlefield_6.jpeg?updatedAt=1761047707422"
];

export function Hero () {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Wait for fade out, then change image
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % BACKGROUND_IMAGES.length
        );
        setIsTransitioning(false);
      }, 500); // Half of transition duration for smooth crossfade
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Fade Transition */}
      <div className="absolute inset-0 z-0">
        {BACKGROUND_IMAGES.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex && !isTransitioning
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={image}
              alt={`Gaming Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/45"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl mb-6 tracking-tight">
            <span className="text-primary">Le meilleur du jeu vidéo</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Découvrez des jeux de tous genres. Augmentez votre collection aujourd'hui.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
