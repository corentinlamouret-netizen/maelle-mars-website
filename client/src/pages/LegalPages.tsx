import { useLocation } from 'wouter';

const heroBackgroundUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663277894285/LJnj9egkWpcGSwAXFPWMea/violet-mystic-background-3hoXKzLFdZBK2nfHP7UerG.webp';

const LEGAL_CONTENT = {
  mentions: {
    title: 'Mentions Légales',
    sections: [
      {
        heading: '1. Éditeur du site',
        content: `Le présent site internet est édité par :

Maelle Mars, médium et clairvoyante, exerçant en tant qu'auto-entrepreneur.
Adresse e-mail : maellemarsmedium@gmail.com
Téléphone : 06 46 22 66 10

Directrice de la publication : Maelle Mars.`,
      },
      {
        heading: '2. Hébergement',
        content: `Ce site est hébergé par la société Manus, dont le siège social est situé à San Francisco, Californie, États-Unis.`,
      },
      {
        heading: '3. Propriété intellectuelle',
        content: `L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, sons, logiciels…) est la propriété exclusive de Maelle Mars, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.

Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de Maelle Mars.`,
      },
      {
        heading: '4. Limitation de responsabilité',
        content: `Les consultations proposées sur ce site sont réalisées dans un cadre de divertissement et de développement personnel. Maelle Mars ne peut en aucun cas être tenue responsable des décisions prises par les consultants sur la base des informations reçues lors d'une consultation.

Les consultations de médiumnité et de clairvoyance ne constituent pas un substitut à un avis médical, juridique, financier ou psychologique professionnel. En cas de difficultés sérieuses, il est fortement recommandé de consulter un professionnel qualifié.`,
      },
      {
        heading: '5. Droit applicable',
        content: `Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.`,
      },
    ],
  },
  privacy: {
    title: 'Politique de Confidentialité',
    sections: [
      {
        heading: '1. Responsable du traitement',
        content: `Maelle Mars est responsable du traitement des données personnelles collectées sur ce site.
Contact : maellemarsmedium@gmail.com`,
      },
      {
        heading: '2. Données collectées',
        content: `Dans le cadre de l'utilisation de ce site, les données personnelles suivantes peuvent être collectées :

— Lors d'une prise de rendez-vous : nom, prénom, adresse e-mail, numéro de téléphone, date et heure souhaitées, type de consultation.
— Lors de l'envoi d'un message via le formulaire de contact : nom, adresse e-mail, contenu du message.
— Lors d'un paiement : les données de paiement sont traitées directement par PayPal et ne sont pas stockées sur ce site.`,
      },
      {
        heading: '3. Finalités du traitement',
        content: `Les données collectées sont utilisées aux fins suivantes :

— Gestion des réservations et des consultations.
— Envoi de confirmations et de rappels par e-mail.
— Réponse aux demandes de contact.
— Amélioration du service proposé.

Ces données ne sont jamais vendues, cédées ou transmises à des tiers à des fins commerciales.`,
      },
      {
        heading: '4. Durée de conservation',
        content: `Les données personnelles sont conservées pendant une durée maximale de 3 ans à compter du dernier contact, conformément aux recommandations de la CNIL.`,
      },
      {
        heading: '5. Vos droits',
        content: `Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants :

— Droit d'accès à vos données personnelles.
— Droit de rectification des données inexactes.
— Droit à l'effacement (« droit à l'oubli »).
— Droit à la limitation du traitement.
— Droit à la portabilité de vos données.
— Droit d'opposition au traitement.

Pour exercer ces droits, contactez : maellemarsmedium@gmail.com

En cas de réclamation non résolue, vous pouvez saisir la CNIL (www.cnil.fr).`,
      },
      {
        heading: '6. Cookies',
        content: `Ce site utilise des cookies techniques nécessaires à son bon fonctionnement (gestion de session, sécurité). Aucun cookie publicitaire ou de traçage tiers n'est utilisé.

Vous pouvez configurer votre navigateur pour refuser les cookies, ce qui peut affecter certaines fonctionnalités du site.`,
      },
    ],
  },
  cgu: {
    title: "Conditions Générales d'Utilisation",
    sections: [
      {
        heading: '1. Objet',
        content: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site maellemars.fr ainsi que les services de consultation proposés par Maelle Mars, médium et clairvoyante.`,
      },
      {
        heading: '2. Nature des services',
        content: `Les consultations proposées (téléphonique, en présentiel, par e-mail) sont réalisées dans un cadre de divertissement, de développement personnel et de bien-être spirituel.

Maelle Mars s'engage à exercer son don avec sincérité et bienveillance. Toutefois, les informations transmises lors d'une consultation ne constituent pas des certitudes et ne sauraient engager la responsabilité de Maelle Mars quant aux décisions prises par le consultant.

Ces services ne remplacent en aucun cas un suivi médical, psychologique, juridique ou financier.`,
      },
      {
        heading: '3. Réservation et paiement',
        content: `La réservation d'une consultation est confirmée après paiement intégral du montant correspondant via PayPal ou carte bancaire.

Le consultant dispose d'un délai de 14 jours pour exercer son droit de rétractation, conformément à l'article L221-18 du Code de la consommation. Toutefois, ce droit de rétractation ne peut être exercé si la consultation a déjà été réalisée avec l'accord exprès du consultant.`,
      },
      {
        heading: '4. Annulation et remboursement',
        content: `Toute annulation effectuée plus de 24 heures avant la consultation donne lieu à un remboursement intégral.

Toute annulation effectuée moins de 24 heures avant la consultation ne donnera pas lieu à remboursement, sauf cas de force majeure dûment justifié.

En cas d'annulation de la part de Maelle Mars, un remboursement intégral ou un report de la consultation sera proposé.`,
      },
      {
        heading: '5. Comportement des utilisateurs',
        content: `L'utilisateur s'engage à utiliser ce site de manière loyale et à ne pas tenter de nuire au bon fonctionnement du service. Tout comportement abusif, irrespectueux ou frauduleux entraînera l'interruption immédiate de la prestation sans remboursement.`,
      },
      {
        heading: '6. Modification des CGU',
        content: `Maelle Mars se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le site. Il appartient à l'utilisateur de les consulter régulièrement.`,
      },
      {
        heading: '7. Droit applicable et juridiction',
        content: `Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.`,
      },
    ],
  },
};

type LegalKey = 'mentions' | 'privacy' | 'cgu';

export default function LegalPage({ type }: { type: LegalKey }) {
  const [, navigate] = useLocation();
  const doc = LEGAL_CONTENT[type];

  return (
    <div
      className="min-h-screen pt-24 pb-16 relative overflow-hidden"
      style={{
        backgroundImage: `url('${heroBackgroundUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-3xl">
        {/* Retour */}
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-accent hover:text-accent/80 transition-colors text-sm flex items-center gap-2"
        >
          ← Retour à l'accueil
        </button>

        {/* Titre */}
        <div className="text-center mb-12">
          <h1
            className="text-accent mb-2"
            style={{ fontFamily: "'Pinyon Script', cursive", fontSize: '3.5rem', lineHeight: 1.1 }}
          >
            {doc.title}
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4"></div>
          <p className="text-muted-foreground text-sm mt-4">Dernière mise à jour : 1er mars 2026</p>
        </div>

        {/* Contenu */}
        <div
          className="rounded-2xl border border-accent/20 p-8 md:p-12 space-y-10"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)' }}
        >
          {doc.sections.map((section, i) => (
            <div key={i}>
              <h2
                className="text-accent text-xl font-semibold mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {section.heading}
              </h2>
              <div className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm">
                {section.content}
              </div>
              {i < doc.sections.length - 1 && (
                <div className="w-full h-px bg-accent/10 mt-8"></div>
              )}
            </div>
          ))}
        </div>

        {/* Liens vers les autres documents */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          {type !== 'mentions' && (
            <button onClick={() => navigate('/legal/mentions')} className="hover:text-accent transition-colors">
              Mentions légales
            </button>
          )}
          {type !== 'privacy' && (
            <>
              <span>•</span>
              <button onClick={() => navigate('/legal/privacy')} className="hover:text-accent transition-colors">
                Politique de confidentialité
              </button>
            </>
          )}
          {type !== 'cgu' && (
            <>
              <span>•</span>
              <button onClick={() => navigate('/legal/cgu')} className="hover:text-accent transition-colors">
                Conditions d'utilisation
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function MentionsLegales() { return <LegalPage type="mentions" />; }
export function PolitiqueConfidentialite() { return <LegalPage type="privacy" />; }
export function ConditionsUtilisation() { return <LegalPage type="cgu" />; }
