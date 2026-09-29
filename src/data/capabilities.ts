export interface Capability {
  id: string;
  category: 'saas' | 'ai' | 'database' | 'workspace' | 'creative' | 'mobile';
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  samplePrompt: string;
  badgeText: string;
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'saas-dashboards',
    category: 'saas',
    title: 'Applications Web SaaS & Portails Métier',
    subtitle: 'Tableaux de bord, CRM, facturation et outils opérationnels',
    description: 'Conception de logiciels de gestion sur-mesure complets, avec interfaces riches, graphiques dynamiques, exports de données et contrôles d\'accès par rôles (RBAC).',
    features: [
      'Gestion d\'utilisateurs, profils et permissions multi-rôles',
      'Tableaux de bord analytiques avec métriques chiffrées en temps réel',
      'Flux de travail Kanban, calendriers interactifs et formulaires dynamiques',
      'Génération et export PDF/CSV/Excel automatisés'
    ],
    samplePrompt: 'Crée un CRM SaaS pour agences de design avec tableau de bord des devis, suivi des factures et pipeline de projets en colonnes Kanban.',
    badgeText: 'Web SaaS'
  },
  {
    id: 'ai-multimodal',
    category: 'ai',
    title: 'Intelligence Artificielle & Vision Gemini',
    subtitle: 'Modèles de pointe pour analyser, générer et automatiser',
    description: 'Intégration native des modèles Gemini (texte, images, documents, audio) pour transformer vos données brutes en analyses pertinentes et en assistants intelligents spécialisés.',
    features: [
      'Analyse multimodale de photos, plans techniques, tickets de caisse et PDF',
      'Génération assistée de contenu, synthèses automatisées et structuration JSON',
      'Recherche grounded avec Google Search pour informations actualisées',
      'Agents conversationnels contextuels dotés d\'outils et d\'actions (Function Calling)'
    ],
    samplePrompt: 'Crée une application d\'analyse de factures où l\'utilisateur télécharge une photo et l\'IA extrait automatiquement les totaux, TVA et lignes d\'articles dans un tableau.',
    badgeText: 'Gemini AI'
  },
  {
    id: 'data-storage',
    category: 'database',
    title: 'Bases de Données & Synchronisation',
    subtitle: 'Firebase Firestore & Cloud SQL PostgreSQL sécurisés',
    description: 'Mise en place de stockages persistants ultra-performants avec schémas typés, abonnements en direct et règles de sécurité strictes empêchant tout accès non autorisé.',
    features: [
      'Firebase Firestore : synchronisation multi-utilisateurs temps réel sans rechargement',
      'Cloud SQL PostgreSQL : bases relationnelles avec Drizzle ORM et requêtes complexes',
      'Règles de sécurité Firestore granulaires validées et déployées',
      'Sauvegarde automatique, pagination fluide et requêtes filtrées'
    ],
    samplePrompt: 'Configure une base de données collaborative pour une équipe de logistique avec synchronisation instantanée du stock entre plusieurs collaborateurs.',
    badgeText: 'Temps Réel & SQL'
  },
  {
    id: 'google-workspace',
    category: 'workspace',
    title: 'Écosystème Google Workspace & Maps',
    subtitle: 'Intégration directe de Sheets, Drive, Gmail, Calendar et Maps',
    description: 'Connexion directe avec vos comptes Google Workspace via OAuth 2.0 pour lire et écrire dans vos feuilles de calcul, gérer des événements et cartographier vos points d\'intérêt.',
    features: [
      'Synchronisation bidirectionnelle avec Google Sheets en temps réel',
      'Création automatique de rendez-vous dans Google Calendar',
      'Génération et archivage de documents dans Google Drive',
      'Google Maps : calculs d\'itinéraires, géocodage d\'adresses, bornes et Street View'
    ],
    samplePrompt: 'Crée une application de gestion de rendez-vous clients qui réserve automatiquement le créneau dans Google Calendar et enregistre les coordonnées dans Google Sheets.',
    badgeText: 'Workspace & Maps'
  },
  {
    id: 'creative-canvas',
    category: 'creative',
    title: 'Jeux 2D, Simulations & Outils Créatifs',
    subtitle: 'Moteurs canvas HTML5, physique interactive et éditeurs visuels',
    description: 'Développement d\'expériences visuelles immersives à 60 images par seconde : mini-jeux rétro, simulations physiques, éditeurs graphiques vectoriels et visualisations scientifiques.',
    features: [
      'Rendu Canvas 2D fluide avec détection de collisions et particules',
      'Éditeurs visuels de moodboards, diagrammes et graphiques vectoriels SVG',
      'Simulations scientifiques et éducatives interactives paramétrables',
      'Animations ultra-fluides basées sur Motion et compositing GPU'
    ],
    samplePrompt: 'Développe un jeu 2D de simulation spatiale avec physique gravitationnelle et contrôle de vaisseau au clavier avec score persistant.',
    badgeText: 'Canvas & Interactif'
  },
  {
    id: 'mobile-pwa',
    category: 'mobile',
    title: 'Progressive Web Apps (PWA) & Mobiles',
    subtitle: 'Applications installables sur smartphone avec mode hors-ligne',
    description: 'Création d\'interfaces tactiles pensées pour smartphone et tablette, installables sur l\'écran d\'accueil avec icône personnalisée et support du mode hors-connexion.',
    features: [
      'Manifest Web App complet avec installation en 1 clic sur Android et iOS',
      'Service Worker avec mise en cache stratégique pour utilisation sans réseau',
      'Ergonomie tactile soignée : zones de frappe confortables et navigation au pouce',
      'Design adaptatif 100% fluide de 360px à 1440px'
    ],
    samplePrompt: 'Conçois une application de suivi d\'entraînement sportif installable en PWA qui fonctionne parfaitement hors-ligne dans la salle de sport.',
    badgeText: 'PWA & Mobile'
  }
];

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  screens: string[];
  suggestedPrompt: string;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'crm-saas',
    name: 'Plateforme CRM & Facturation B2B',
    category: 'SaaS & Gestion',
    description: 'Portail client avec tableau de bord commercial, gestion des devis, relances et factures automatiques.',
    stack: ['React 19', 'Tailwind CSS', 'PostgreSQL / Firestore', 'Exports PDF'],
    screens: ['Dashboard Métriques', 'Pipeline Ventes (Kanban)', 'Éditeur de Factures', 'Annuaire Clients'],
    suggestedPrompt: 'Je veux créer une plateforme CRM complète pour indépendants et PME avec gestion des prospects, devis convertibles en factures, tableau de bord du chiffre d\'affaires et export comptable CSV.'
  },
  {
    id: 'ai-document-auditor',
    name: 'Auditeur Intelligent de Documents IA',
    category: 'Intelligence Artificielle',
    description: 'Application de scan et analyse automatique de contrats, factures et rapports d\'audit grâce à Gemini.',
    stack: ['React 19', 'Gemini 2.5 Flash', 'OCR Vision', 'Stockage Sécurisé'],
    screens: ['Zone de Glisser-Déposer', 'Visualiseur de Document', 'Tableau d\'Extraction Clé-Valeur', 'Rapport de Synthèse'],
    suggestedPrompt: 'Construis une application où je peux glisser-déposer des documents juridiques ou financiers, et l\'IA analyse les risques potentiels, résume les obligations et extrait les clauses clés dans une grille.'
  },
  {
    id: 'workspace-booking',
    name: 'Réservateur & Synchronisation Google Sheets',
    category: 'Google Workspace',
    description: 'Système de réservation en ligne synchronisé en temps réel avec un Google Sheet d\'équipe et Google Calendar.',
    stack: ['OAuth 2.0', 'Google Sheets API', 'Google Calendar API', 'React'],
    screens: ['Calendrier de Disponibilité', 'Formulaire de Réservation', 'Tableau Synchronisé Sheets', 'Confirmations Email'],
    suggestedPrompt: 'Développe une interface publique de prise de rendez-vous pour mon cabinet qui synchronise instantanément les créneaux disponibles avec mon Google Calendar et enregistre les réservations dans une feuille Google Sheets.'
  },
  {
    id: 'interactive-simulation',
    name: 'Laboratoire de Simulation & Canvas 2D',
    category: 'Créatif & Éducatif',
    description: 'Simulateur interactif visuel pour modéliser des systèmes complexes ou expérimenter des concepts physiques.',
    stack: ['HTML5 Canvas', 'Maths Vectoriels', 'Motion', 'React 19'],
    screens: ['Scène Interactive 60fps', 'Panneau de Contrôle des Paramètres', 'Graphiques de Données Associés', 'Préréglages'],
    suggestedPrompt: 'Crée un laboratoire interactif en Canvas 2D simulant un écosystème avec proies et prédateurs, où l\'utilisateur peut ajuster la vitesse de reproduction et observer les courbes démographiques en direct.'
  }
];
