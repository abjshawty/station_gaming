import { Gamepad2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer () {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-8 h-8 text-primary" />
              <h3>Soul Gaming</h3>
            </div>
            <p className="text-muted-foreground">
              Votre destination ultime pour des expériences de jeux classiques, rétro et deluxe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Shop</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#standard" className="hover:text-primary transition-colors">Standard Games</a></li>
              <li><a href="#premium" className="hover:text-primary transition-colors">Premium Games</a></li>
              <li><a href="#deluxe" className="hover:text-primary transition-colors">Deluxe Games</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">New Releases</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-muted hover:bg-primary rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-muted hover:bg-primary rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-muted hover:bg-primary rounded-lg transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-muted hover:bg-primary rounded-lg transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; 2025 Station Gaming. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
