import { useState } from 'react';
import { Menu, X, LogOut, LogIn, LayoutDashboard } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

function AuthMenu() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return <div className="w-9 h-9 rounded-full border border-accent/40 animate-pulse" />;
  }

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => {
          window.location.href = getLoginUrl();
        }}
        variant="outline"
        size="sm"
        className="text-xs font-semibold border-accent/40 hover:border-accent hover:bg-accent/10"
      >
        <LogIn size={14} className="mr-1.5" />
        Connexion
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-9 h-9 rounded-full border border-accent/40 flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-300 hover:scale-110 text-accent font-semibold text-sm">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-semibold text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        {user?.role === 'admin' && (
          <>
            <DropdownMenuItem asChild>
              <a href="/admin" className="cursor-pointer flex items-center">
                <LayoutDashboard size={14} className="mr-2" />
                Tableau de bord
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
        >
          <LogOut size={14} className="mr-2" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthMenuMobile() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return <div className="h-8 rounded border border-accent/40 animate-pulse" />;
  }

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => {
          window.location.href = getLoginUrl();
        }}
        variant="outline"
        size="sm"
        className="w-full text-xs font-semibold border-accent/40 hover:border-accent hover:bg-accent/10"
      >
        <LogIn size={14} className="mr-1.5" />
        Connexion
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="px-2 py-2 rounded border border-accent/20 bg-accent/5">
        <p className="font-semibold text-sm text-foreground">{user?.name}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>
      {user?.role === 'admin' && (
        <a
          href="/admin"
          className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
        >
          <LayoutDashboard size={14} />
          Tableau de bord
        </a>
      )}
      <button
        onClick={() => logout()}
        className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <LogOut size={14} />
        Déconnexion
      </button>
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'À Propos', href: '/about' },
    { label: 'Consultations', href: '/consultations' },
    { label: 'Événements', href: '/events' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="fixed left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-accent/20 shadow-lg shadow-black/10" style={{ top: 'var(--promo-height, 0px)' }}>
      <div className="mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 shrink-0">
          <div className="flex flex-col leading-none">
            <span
              className="text-accent"
              style={{
                fontFamily: "'Pinyon Script', cursive",
                fontSize: '2rem',
                lineHeight: '1',
                letterSpacing: '0.02em',
              }}
            >
              Maelle Mars
            </span>
            <span
              className="text-muted-foreground tracking-widest whitespace-nowrap"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                marginTop: '2px',
              }}
            >
              MÉDIUM &amp; CLAIRVOYANTE
            </span>
          </div>
        </a>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`relative text-sm font-semibold whitespace-nowrap transition-colors duration-300 ${
                isActive(item.href)
                  ? 'text-accent'
                  : 'text-foreground hover:text-accent'
              }`}
              style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.5px' }}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
              )}
            </a>
          ))}
        </nav>

        {/* Auth & Icônes Sociales Desktop */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <AuthMenu />
          {/* Instagram */}
          <a
            href="https://www.instagram.com/marsmaelle?utm_source=qr&igsh=eGEzOGFoZm1iNXBt"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-accent/40 flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-300 hover:scale-110"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          {/* Facebook */}
          <a
            href="https://www.facebook.com/maelle.mars"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-accent/40 flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-300 hover:scale-110"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-accent">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
        </div>

        {/* Menu Mobile */}
        <button
          className="md:hidden text-accent hover:text-accent/80 transition-colors duration-300 shrink-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-accent/20 py-6 animate-fade-in-down">
          <nav className="container mx-auto px-4 flex flex-col gap-5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-semibold transition-colors duration-300 ${
                  isActive(item.href)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.5px' }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-accent/20">
              <AuthMenuMobile />
            </div>
            <div className="flex gap-3 pt-4">
              <a
                href="https://www.instagram.com/marsmaelle?utm_source=qr&igsh=eGEzOGFoZm1iNXBt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-accent/40 flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/maelle.mars"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-accent/40 flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-accent">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
