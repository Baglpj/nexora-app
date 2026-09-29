# Spécifications et Architecture Révisée : NEXORA (User App vs Admin Command Center)

Ce plan révisé intègre l'ensemble de vos directives architecturales, fonctionnelles, ergonomiques et de sécurité. Les deux applications sont totalement séparées dans les dossiers `/src/user-app` et `/src/admin-app`. Tous les éléments superflus (niveaux globaux non fondés, barres de vies génériques, commutateurs de vue débug en haut) sont purgés au profit de métriques précises par jeu, d'un moteur de recherche instantané, d'un checkout mobile réel (Wave, Moov, MTN, CB), d'un flux social dynamique style TikTok/Instagram et d'une console d'administration cyber-sécurisée.

***

## User Review & Critical Decisions

> [!IMPORTANT]
> Conformément à vos instructions strictes, aucun outil développeur ou d'administration n'est accessible ni visible dans l'application utilisateur. La création de jeux, le déploiement et la modération sont réservés à 100% à l'administrateur.

- **Décision 1 : Élimination des Niveaux Globaux et Vies Fictives** :
  - Suppression complète du faux indicateur "LV 12" et des cœurs de vie dans la barre supérieure et le profil.
  - Remplacement par une **Fiche de Maîtrise Individuelle par Jeu** : chaque jeu dispose de ses propres statistiques (niveau atteint dans CyberDash, rang dans Quantum Matrix, nombre de parties jouées, meilleur score).
  - Les points de vie sont une ressource exclusive au moteur de gameplay pendant une session de jeu.
- **Décision 2 : En-tête Épuré avec Recherche Universelle Instantanée** :
  - Suppression de la barre de changement de vue en haut.
  - Intégration à côté du profil d'une barre de recherche avec sélecteur de filtres de catégories (Action, Arcade, Puzzle, Tournois, Créateurs) pour trouver et lancer un jeu en 1 clic.
- **Décision 3 : Économie Réelle & Passerelle de Paiement Mobile (Wave, Moov, MTN, CB)** :
  - L'XP s'achète avec de l'argent réel (ou se gagne en jeu) pour débloquer des artefacts, participer à des événements ou inviter des membres.
  - Module de checkout interactif avec sélection de l'opérateur (Wave, Moov Money, MTN Mobile Money, Carte Bancaire, Carte Prépayée), simulation de saisie du numéro de téléphone/code USSD, et validation avec notification de solde instantanée.
  - Distinction nette entre l'achat direct de ressources (XP / Pièces) et les abonnements mensuels étagés (2€, 4€, formule x2).
- **Décision 4 : Flux Social Gaming Hybride (Inspiration TikTok / Instagram)** :
  - Fil d'actualité visuel dynamique : publications de gameplay avec images, captures d'écran, descriptions, badges de jeu.
  - Interactions réactives : système de likes (cœurs), compteur de commentaires en direct, possibilité de commenter et partager.
  - Création de publication : ajout d'une photo + texte par l'utilisateur.
  - Hiérarchie des badges : le "Badge Bleu Vérifié" distingue les comptes d'élite (qui pourront à terme soumettre du code ou présenter leurs jeux), tandis que les comptes standards publient photos et textes. Le vocal est cantonné aux sessions de chat de partie en temps réel.
- **Décision 5 : Console Admin Développeur Exclusif & Gestionnaire de Thèmes** :
  - Seul l'administrateur via `/src/admin-app/` accède à la NEXORA Play Console pour créer, déployer, modifier des jeux, bannir des comptes ou supprimer des publications indésirables.
  - Gestionnaire de thèmes presets configuré par l'admin : palettes inspirées des plateformes mondiales (YouTube Rouge/Blanc, TikTok Sombre/Rouge-Cyan, WhatsApp Vert, Instagram Rose Sunset, Facebook Bleu, Obsidian Gold). L'utilisateur peut ensuite sélectionner parmi ces thèmes autorisés.

***

## 1. Structure Détaillée des Répertoires

```
/src/
├── user-app/                          # APPLICATION UTILISATEUR PLAY STORE
│   ├── components/
│   │   ├── UserHeader.tsx             # Barre épurée, solde XP/Pièces, recherche & filtres
│   │   ├── UserBottomNav.tsx          # Navigation mobile ergonomique (Home, Feed, Shop, Profile)
│   │   ├── UniversalSearchModal.tsx   # Recherche rapide par mot-clé et catégories
│   │   ├── MobileCheckoutModal.tsx    # Passerelle Wave, Moov, MTN, CB avec code USSD
│   │   ├── GameMasteryCard.tsx        # Fiche de progression et niveau individuel par jeu
│   │   ├── SocialFeedCard.tsx         # Carte de post style Instagram/TikTok (Likes, Comms)
│   │   └── CreatePostModal.tsx        # Modal d'ajout photo + texte pour le joueur
│   └── views/
│       ├── UserHomeView.tsx           # Grille de jeux, événements & tournois
│       ├── UserFeedView.tsx           # Flux social communautaire
│       ├── UserShopView.tsx           # Boutique XP, Pièces et abonnements 2€ / 4€
│       └── UserProfileView.tsx        # Stats par jeu, badges, thème sélectionné
│
├── admin-app/                         # APPLICATION ADMINISTRATEUR COMMANDE
│   ├── auth/
│   │   └── AdminSecurityGate.tsx      # Terminal d'accès secret et vérification de code maître
│   ├── components/
│   │   ├── AdminSidebar.tsx           # Navigation de la station de commandement
│   │   ├── AdminTopBar.tsx            # Alertes système, logs de sécurité, état serveur
│   │   ├── UserModerationTable.tsx    # Bannissement, suppression de comptes, injection solde
│   │   ├── ContentModerationGrid.tsx  # Modération des posts et photos du flux social
│   │   ├── ThemePresetManager.tsx     # Configuration des thèmes (YouTube, TikTok, Insta, etc.)
│   │   └── NexoraPlayConsole.tsx      # Console développeur exclusive de création de jeux
│   └── views/
│       ├── AdminDashboardView.tsx     # Métriques financières, revenus abonnements, volume XP
│       ├── AdminGamesManagerView.tsx  # Déploiement et réglages des jeux
│       ├── AdminCommunityView.tsx     # Gestion des posts, signalements et badges bleus
│       └── AdminSettingsView.tsx      # Paramètres système et presets graphiques
│
└── shared/                            # SCHÉMAS ET SERVICES PARTAGÉS
    ├── types/                         # Interfaces TypeScript (User, Game, Post, Payment, Theme)
    └── context/                       # Contexte de synchronisation d'état et sécurité
```

***

## 2. Parcours Utilisateur & Écrans Clés

### Application Utilisateur
1. **Écran d'Accueil (Home)** :
   - Recherche en haut avec filtres rapides (ex: "Tous", "Action", "Arcade", "Multijoueur").
   - Lancement immédiat de n'importe quel jeu en 1 clic.
   - Accès aux tournois avec cagnottes.
2. **Fil Social Gaming (Style Instagram / TikTok)** :
   - Défilement continu de posts avec captures d'écran des exploits des joueurs.
   - Bouton de like instantané avec animation visuelle.
   - Section de commentaires déroulante.
   - Bouton flottant `+ Publier` pour uploader une photo et un message.
3. **Boutique & Rechargement Mobile (Shop & Cashier)** :
   - Grille de packs d'XP et de Pièces avec conversion en monnaie locale / EUR.
   - Clic sur "Acheter XP" $\rightarrow$ Ouverture du tiroir de checkout :
     - Choix : **Wave** (logo bleu), **Moov Money** (logo orange/bleu), **MTN Mobile Money** (logo jaune), **Carte Bancaire / Prépayée**.
     - Saisie du numéro $\rightarrow$ Simulation de validation interactive $\rightarrow$ Solde mis à jour immédiatement avec reçu digital.
   - Section Abonnements Premium : Formules à 2€/mois, 4€/mois et Pro x2.
4. **Profil & Maîtrise par Jeu** :
   - Plus de niveau global trompeur : affichage d'un carrousel de badges de jeux :
     - *CyberDash* : Niveau 8 (Record : 12 450 pts)
     - *Quantum Matrix* : Niveau 4 (Record : 8 200 pts)
     - *Neon Drift* : Niveau 2 (Record : 3 100 pts)
   - Badge de statut (Standard ou Badge Bleu Vérifié).

### Application Administrateur
1. **Portail Secret** :
   - Accessible via le chemin secret `/admin` avec formulaire de sécurité sombre "Terminal de Commandement".
   - Mot de passe maître obligatoire (ex: `NEXORA-ADMIN-2026`).
2. **NEXORA Play Console Exclusif** :
   - Interface de studio de jeu pour créer un nouveau jeu, définir le type (Canvas 2D, Phaser, HTML5), configurer les règles de score et publier sur le store.
3. **Modération & Overwatch** :
   - Liste des utilisateurs avec bouton rouge "Bannir", "Débannir", et attribution manuelle du "Badge Bleu".
   - Grille des publications signalées avec bouton de suppression définitive.
4. **Studio de Thèmes Visuels** :
   - Switchers de palettes prédéfinies : YouTube (Rouge/Blanc), TikTok (Cyber Noir/Rouge), WhatsApp (Vert), Instagram (Sunset Rose), Facebook (Bleu).

***

## 3. Plan d'Exécution Technique

1. **Phase 1 : Nettoyage et Refactorisation des Répertoires** :
   - Création de la structure `/src/user-app` et `/src/admin-app`.
   - Suppression du niveau global générique et des faux cœurs de santé de l'en-tête.
   - Suppression de la barre d'onglets de debug en haut.
2. **Phase 2 : Développement du Module Utilisateur** :
   - En-tête avec barre de recherche universelle et filtres de catégories.
   - Cartes de statistiques et niveaux par jeu dans le profil.
   - Modalité de paiement mobile Wave / Moov / MTN / CB avec simulation USSD.
   - Flux social complet style TikTok / Instagram (likes, commentaires, publication photo).
3. **Phase 3 : Développement du Portail et Console Administrateur** :
   - Portail de verrouillage secret par code maître.
   - Migration de la NEXORA Play Console dans l'espace administrateur exclusif.
   - Module de gestion des utilisateurs, ban, badges et suppression de contenu.
   - Gestionnaire de thèmes prédéfinis.
4. **Phase 4 : Vérification et Sécurisation** :
   - Compilation TypeScript sans erreur (`compile_applet`).
   - Vérification du bon isolement entre l'expérience joueur et la console de commandement.
