import { Star, Clock, Phone, Video, MessageCircle, Eye, Heart, Sparkles, Users } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';

const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

const mediumPortraitUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/maelle-portrait-official_6340148e.png';

const consultations = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Consultation Téléphonique',
    duration: '20 min — 1h',
    description: 'Une connexion directe et intime. Depuis chez vous, recevez des messages clairs et précis.',
    price: 'À partir de 70€',
    href: '/consultations',
    isPhone: false,
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Consultation en Groupe à domicile',
    duration: 'Sur devis',
    description: 'Vivez une expérience spirituelle unique chez vous, entouré de vos proches. 10 personnes minimum. La consultation est offerte pour l\'hôte.',
    price: 'À partir de 58€ / personne',
    href: 'tel:0646226610',
    isPhone: true,
  },
];

const differences = [
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Clairvoyance authentique',
    text: 'Des messages reçus avec précision et honnêteté, sans artifice ni mise en scène.',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Bienveillance absolue',
    text: 'Chaque consultation est un espace sûr, sans jugement, guidé par l\'amour et la lumière.',
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Contact avec les défunts',
    text: 'Une spécialité rare : transmettre les messages de vos proches disparus pour apaiser votre cœur.',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Expérience reconnue',
    text: 'Des centaines de consultations et de témoignages attestent de la justesse des messages reçus.',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'fill-accent text-accent' : 'text-white/20'}`}
        />
      ))}
    </div>
  );
}

export default function Home() {

  return (
    <div className="bg-background text-foreground">

      {/* ══════════════════════════════════════════
          HERO — plein écran
      ══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: `url('${heroBackgroundUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Texte */}
            <div className="space-y-7">
              <span
                className="inline-block px-4 py-1.5 border border-accent/50 rounded-full text-accent text-xs tracking-[0.25em] uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Médium &amp; Clairvoyante
              </span>

              <div>
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl text-white leading-none"
                  style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontWeight: 400 }}
                >
                  Maelle
                </h1>
                <h1
                  className="text-6xl sm:text-7xl md:text-8xl text-accent leading-none"
                  style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontWeight: 400 }}
                >
                  Mars
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-accent/60" />
                <p className="text-white/60 text-sm tracking-widest uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Connexion · Lumière · Vérité
                </p>
              </div>

              <p
                className="text-xl md:text-2xl text-white/85 leading-relaxed max-w-md"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300 }}
              >
                « Un message peut changer votre chemin. »
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/consultations">
                  <span
                    className="cursor-pointer px-8 py-3.5 bg-accent text-background font-semibold rounded-full hover:brightness-110 hover:shadow-[0_0_24px_rgba(212,175,55,0.45)] transition-all duration-300 inline-block"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.875rem', letterSpacing: '0.06em' }}
                  >
                    Prendre rendez-vous
                  </span>
                </Link>


              </div>
            </div>

            {/* Portrait */}
            <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80">
                <div className="absolute -inset-6 bg-accent/12 rounded-3xl blur-3xl" />
                <div className="absolute inset-0 border border-accent/30 rounded-2xl rotate-2 scale-105" />
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '3/4', background: 'transparent' }}>
                  <img
                    src={mediumPortraitUrl}
                    alt="Maelle Mars"
                    className="w-full h-full object-cover object-top block"
                    style={{ minHeight: '100%', minWidth: '100%' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.border = '2px solid red'; }}
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 z-20 bg-background/90 border border-accent/30 rounded-xl px-4 py-2.5 shadow-xl backdrop-blur-sm">
                  <p className="text-accent text-xs font-semibold tracking-wider uppercase">✦ Guidance authentique</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONSULTATIONS
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">

          {/* En-tête */}
          <div className="text-center mb-16 space-y-3">
            <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Mes services
            </span>
            <h2
              className="text-4xl md:text-5xl text-foreground"
              style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontWeight: 400 }}
            >
              Consultations
            </h2>
            <div className="flex justify-center">
              <div className="h-px w-16 bg-accent/50" />
            </div>
          </div>

          {/* Cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultations.map((c, i) => {
              const cardContent = (
                <div className="group cursor-pointer h-full border border-accent/15 rounded-2xl p-7 bg-card hover:border-accent/40 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-300 flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                    {c.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {c.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-accent/70 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{c.duration}</span>
                    </div>
                    <p className="text-foreground/60 text-sm leading-relaxed">{c.description}</p>
                  </div>
                  <div className="pt-2 border-t border-accent/10 flex items-center justify-between">
                    <span className="text-accent font-semibold text-sm">{c.price}</span>
                    <span className="text-foreground/40 text-xs group-hover:text-accent transition-colors">
                      {c.isPhone ? 'Appeler le 06 46 22 66 10 →' : 'Réserver →'}
                    </span>
                  </div>
                </div>
              );
              return c.isPhone ? (
                <a key={i} href={c.href}>{cardContent}</a>
              ) : (
                <Link key={i} href={c.href}>{cardContent}</Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CE QUI ME DIFFÉRENCIE
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-card/40 border-y border-accent/10">
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Texte gauche */}
            <div className="space-y-6">
              <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Mon approche
              </span>
              <h2
                className="text-4xl md:text-5xl text-foreground leading-tight"
                style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', fontWeight: 400 }}
              >
                Ce qui me différencie
              </h2>
              <p
                className="text-foreground/70 text-lg leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Je ne suis pas une voyante comme les autres. Chaque message que je transmets vient d'un lieu de vérité profonde — sans artifice, sans mise en scène. Mon don est au service de votre paix intérieure.
              </p>
              <Link href="/consultations">
                <span
                  className="cursor-pointer inline-block mt-2 px-7 py-3 border border-accent text-accent rounded-full text-sm font-semibold hover:bg-accent hover:text-background transition-all duration-300"
                  style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.05em' }}
                >
                  En savoir plus
                </span>
              </Link>
            </div>

            {/* Grille droite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {differences.map((d, i) => (
                <div key={i} className="p-5 rounded-xl border border-accent/15 bg-background/60 space-y-2 hover:border-accent/30 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    {d.icon}
                  </div>
                  <h4 className="text-foreground font-semibold text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem' }}>
                    {d.title}
                  </h4>
                  <p className="text-foreground/55 text-sm leading-relaxed">{d.text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


    </div>
  );
}
