import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cHxlbnwxfHx8fDE3NjAyMzUyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Gaming Setup"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl mb-6 tracking-tight">
            Your Ultimate
            <br />
            <span style={{ color: '#0072CE' }}>Gaming Destination</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover thousands of classic, retro, and deluxe titles. Level up your collection today.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-[#0072CE] hover:bg-[#005BA8] text-white px-8 py-6">
              Explore Games
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#0072CE] rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#0072CE] rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
