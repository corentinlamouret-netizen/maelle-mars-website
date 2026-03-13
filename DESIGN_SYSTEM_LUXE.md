# Design System Luxe & Professionnel - Maelle Mars

## 1. PALETTE DE COULEURS

### Couleurs Primaires
- **Bleu Profond** : #0d1b2a (fond principal)
- **Or Lumineux** : #e8b84f (accents, CTA)
- **Blanc Pur** : #f5f5f5 (texte principal)

### Couleurs Secondaires
- **Bleu Clair** : #1a2f45 (cards, sections)
- **Gris Élégant** : #b8c8d8 (texte secondaire)
- **Or Sombre** : #c9a961 (hover states)

## 2. TYPOGRAPHIES

### Titres (H1, H2, H3)
- **Font** : Playfair Display (serif élégant)
- **Weight** : 700 (bold)
- **Letter Spacing** : 1px
- **Sizes** :
  - H1 : 3.5rem (desktop), 2.5rem (mobile)
  - H2 : 2.5rem (desktop), 1.75rem (mobile)
  - H3 : 2rem (desktop), 1.5rem (mobile)

### Sous-titres & Accents
- **Font** : Great Vibes (cursive élégante)
- **Weight** : 400
- **Letter Spacing** : 2px
- **Size** : 2.5rem

### Corps de Texte
- **Font** : Cormorant Garamond (serif classique)
- **Weight** : 400
- **Letter Spacing** : 0.5px
- **Line Height** : 1.8
- **Size** : 1.125rem (desktop), 1rem (mobile)

### Interface & Boutons
- **Font** : Montserrat (sans-serif moderne)
- **Weight** : 600
- **Letter Spacing** : 0.5px
- **Size** : 1rem

## 3. COMPOSANTS LUXE

### Boutons
```
Primaire (CTA) :
- Background : Gradient or (#e8b84f → #c9a961)
- Padding : 1rem 2rem
- Border Radius : 0.5rem
- Box Shadow : 0 10px 30px rgba(232, 184, 79, 0.3)
- Hover : Scale 1.05, Shadow augmente

Secondaire :
- Border : 2px solid #e8b84f
- Color : #e8b84f
- Hover : Background #e8b84f, Color white
```

### Cards
```
- Background : #1a2f45
- Border : 1px solid rgba(232, 184, 79, 0.2)
- Border Radius : 0.75rem
- Padding : 2rem
- Box Shadow : 0 4px 15px rgba(0, 0, 0, 0.2)
- Hover : Border color change, Shadow augmente, Translate Y -4px
```

### Sections
```
- Padding : 4rem 2rem (desktop), 2rem 1rem (mobile)
- Max Width : 1200px
- Margin : auto
- Background : Gradient subtle (optional)
```

## 4. ESPACEMENT

- **XS** : 0.5rem
- **SM** : 1rem
- **MD** : 1.5rem
- **LG** : 2rem
- **XL** : 3rem
- **2XL** : 4rem

## 5. ANIMATIONS

### Fade In
```
Duration : 0.6s
Easing : ease-out
Opacity : 0 → 1
```

### Slide In
```
Duration : 0.8s
Easing : ease-out
Transform : translateX(-50px) → translateX(0)
```

### Glow Pulse
```
Duration : 2s
Box Shadow : 0 0 10px rgba(232, 184, 79, 0.3) → 0 0 25px rgba(232, 184, 79, 0.6)
```

### Float
```
Duration : 3s
Transform : translateY(0) → translateY(-10px) → translateY(0)
```

## 6. IMAGES

### Portrait Professionnel
- **Aspect Ratio** : 3:4 (portrait)
- **Border Radius** : 0.5rem
- **Box Shadow** : 0 10px 40px rgba(0, 0, 0, 0.3)
- **Frame** : Border 2px gold avec rotation 3deg

### Sections Background
- **Overlay** : Gradient bleu semi-transparent
- **Opacity** : 0.6 - 0.8
- **Blend Mode** : multiply

## 7. RESPONSIVE DESIGN

### Breakpoints
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

### Font Sizes Responsive
```
Mobile : 90% of desktop size
Tablet : 95% of desktop size
Desktop : 100%
```

## 8. MICRO-INTERACTIONS

### Hover States
- Boutons : Scale 1.05, Shadow augmente
- Cards : Translate Y -4px, Border color change
- Links : Color change to gold, Underline appears

### Focus States
- Outline : 2px solid #e8b84f
- Box Shadow : 0 0 0 3px rgba(232, 184, 79, 0.1)

### Loading States
- Spinner : Rotation animation, Color gold
- Duration : 1s

## 9. ACCESSIBILITÉ

- **Contrast Ratio** : Minimum 4.5:1 (WCAG AA)
- **Font Size** : Minimum 16px pour lisibilité
- **Line Height** : Minimum 1.5 pour accessibilité
- **Focus Indicators** : Toujours visibles

## 10. PERFORMANCE

- **Image Optimization** : WebP format, lazy loading
- **Bundle Size** : < 500KB (gzip)
- **Fonts** : 2-3 fonts maximum
- **Animations** : GPU-accelerated (transform, opacity)
