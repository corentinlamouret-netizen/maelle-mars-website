import { useState } from 'react';
import { Phone, Mail, Instagram, Facebook, Send, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    privacy: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '', privacy: false });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen">

      {/* ─── HERO SECTION avec formulaire à droite ─── */}
      <div
        className="min-h-screen pt-24 pb-16 relative overflow-hidden flex items-center"
        style={{
          backgroundImage: `url('${heroBackgroundUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Texte Hero — gauche */}
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h1 className="text-script text-5xl md:text-7xl text-accent mb-4 leading-tight">
                  Me Contacter
                </h1>
                <h2 className="text-2xl md:text-3xl text-foreground font-light">
                  Chaque message est accueilli avec bienveillance.
                </h2>
              </div>

              <div className="divider-golden"></div>

              <p className="text-foreground/90 text-lg leading-relaxed max-w-md">
                Que vous souhaitiez prendre rendez-vous, poser une question ou simplement échanger, je suis là pour vous écouter avec sincérité et confidentialité.
              </p>

              {/* Canaux de contact rapides */}
              <div className="space-y-3 pt-2">
                <a
                  href="tel:+33646226610"
                  className="flex items-center gap-3 group w-fit"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
                    <Phone className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-accent font-semibold text-lg group-hover:text-accent/80 transition-colors">06 46 22 66 10</span>
                </a>

                <a
                  href="mailto:maellemars@gmail.com"
                  className="flex items-center gap-3 group w-fit"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center group-hover:bg-accent/40 transition-colors">
                    <Mail className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-foreground/80 group-hover:text-accent transition-colors">maellemars@gmail.com</span>
                </a>

                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="https://www.instagram.com/marsmaelle?utm_source=qr&igsh=eGEzOGFoZm1iNXBt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="https://www.facebook.com/maelle.mars"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Formulaire — droite */}
            <div className="animate-fade-in-up">
              <div className="bg-card/90 backdrop-blur-md border border-accent/30 rounded-2xl p-8 shadow-2xl shadow-black/40">

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Envoyez-moi un message</h3>
                    <p className="text-foreground/50 text-xs">Je vous répondrai personnellement</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto">
                      <Star className="w-7 h-7 text-accent" />
                    </div>
                    <h4 className="text-lg font-semibold text-accent">Message envoyé !</h4>
                    <p className="text-foreground/70 text-sm">Merci. Je vous répondrai dans les plus brefs délais.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nom */}
                      <div>
                        <label className="block text-xs font-medium text-foreground/70 mb-1">
                          Votre nom <span className="text-accent">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Prénom et nom"
                          className="w-full px-3 py-2.5 rounded-xl bg-background/60 border border-accent/20 text-foreground text-sm placeholder-foreground/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-medium text-foreground/70 mb-1">
                          Votre email <span className="text-accent">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="votre@email.fr"
                          className="w-full px-3 py-2.5 rounded-xl bg-background/60 border border-accent/20 text-foreground text-sm placeholder-foreground/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Sujet */}
                    <div>
                      <label className="block text-xs font-medium text-foreground/70 mb-1">
                        Objet <span className="text-accent">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-background/60 border border-accent/20 text-foreground text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                        required
                      >
                        <option value="" disabled>Choisissez un sujet...</option>
                        <option value="consultation">Demande de consultation</option>
                        <option value="conference">Informations sur une conférence</option>
                        <option value="salon">Informations sur un salon</option>
                        <option value="question">Question générale</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium text-foreground/70 mb-1">
                        Votre message <span className="text-accent">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Décrivez votre demande..."
                        rows={4}
                        className="w-full px-3 py-2.5 rounded-xl bg-background/60 border border-accent/20 text-foreground text-sm placeholder-foreground/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                        required
                      />
                    </div>

                    {/* Confidentialité */}
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name="privacy"
                        id="privacy"
                        checked={formData.privacy}
                        onChange={handleChange}
                        className="w-4 h-4 mt-0.5 accent-amber-500 cursor-pointer flex-shrink-0"
                        required
                      />
                      <label htmlFor="privacy" className="text-xs text-foreground/50 cursor-pointer leading-relaxed">
                        J'accepte que mes données soient utilisées pour traiter ma demande, conformément à la politique de confidentialité.
                      </label>
                    </div>

                    {/* Bouton */}
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-background font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
                    >
                      <Send className="w-4 h-4" />
                      Envoyer mon message
                    </Button>

                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── CITATION FINALE ─── */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="max-w-2xl mx-auto">
            <p className="text-script text-3xl md:text-4xl text-accent leading-relaxed mb-4">
              « Chaque âme qui cherche mérite d'être entendue. »
            </p>
            <footer className="text-foreground/50 text-base">— Maelle Mars</footer>
          </blockquote>
        </div>
      </div>

    </div>
  );
}
