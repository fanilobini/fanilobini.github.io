# CV Page - Guide d'édition

## Structure

Le CV est maintenant disponible à l'adresse : `/cv/`

Toutes les informations du CV sont facilement éditables via un seul fichier texte :
`/cv_data/info.txt`

## Comment éditer le CV

Le fichier `info.txt` utilise un format simple avec des sections délimitées par des marqueurs :

```
=section_name=
Contenu de la section
==
```

### Sections disponibles

#### 1. **name** - Nom complet
```
=name=
FANILO BINI
==
```

#### 2. **title** - Titre professionnel
```
=title=
Designer Graphique 360°
==
```

#### 3. **contact_email** - Email de contact
```
=contact_email=
fanilo.f@gmail.com
==
```

#### 4. **contact_phone** - Téléphone
```
=contact_phone=
+33 6 XX XX XX XX
==
```

#### 5. **contact_location** - Localisation
```
=contact_location=
Paris, France
==
```

#### 6. **profile** - Profil / À propos
```
=profile=
*Designer graphique 360°*, je prends plaisir à développer...
==
```

#### 7. **experience** - Expérience professionnelle
Format : Une ligne pour le titre (poste + lieu + dates), puis les lignes suivantes pour la description.
Séparez chaque expérience par une ligne vide.

```
=experience=
*Graphiste Freelance* | Paris | 2020 - Présent
Description du poste et des réalisations.

*Designer Graphique* | Agence XYZ | Paris | 2018 - 2020
Description du poste.
==
```

#### 8. **education** - Formation
Même format que l'expérience.

```
=education=
*Master Design Graphique* | École | Paris | 2015 - 2016
Description de la formation.

*Licence Arts Appliqués* | Université | Lyon | 2012 - 2015
Description de la formation.
==
```

#### 9. **skills** - Compétences
Séparez les compétences par des `|` pour les afficher sur la même ligne.

```
=skills=
*Identité Visuelle* | *Illustration* | *Design Web* | *Print*
*Typography* | *UX/UI Design* | *Branding* | *Packaging*
==
```

#### 10. **tools** - Outils / Logiciels
```
=tools=
*Adobe Creative Suite* (Photoshop, Illustrator, InDesign)
*Figma* | *Sketch*
*HTML/CSS*
==
```

#### 11. **languages** - Langues
```
=languages=
*Français* - Langue maternelle
*Anglais* - Courant
*Malgache* - Bilingue
==
```

## Mise en forme du texte

- Utilisez `*texte*` pour mettre en **gras** (ex: `*Designer Graphique*`)
- Les retours à la ligne simples créent des `<br>`
- Les doubles retours à la ligne créent de nouveaux paragraphes
- Le symbole `|` sépare les éléments sur une même ligne (utile pour les compétences)

## Exemples de modifications

### Ajouter une nouvelle expérience
```
=experience=
*Nouveau Poste* | Entreprise | Ville | 2024 - Présent
Description de ce nouveau poste avec les réalisations principales.

*Graphiste Freelance* | Paris | 2020 - 2024
Description du poste précédent.
==
```

### Modifier les compétences
```
=skills=
*Design UX/UI* | *Prototypage* | *Wireframing*
*Motion Design* | *3D Modeling* | *Video Editing*
==
```

### Changer les informations de contact
```
=contact_email=
nouveau.email@exemple.com
==

=contact_phone=
+33 7 12 34 56 78
==
```

## Fonctionnalités

- **Responsive** : S'adapte aux mobiles et tablettes
- **Impression / Export PDF** : Utilisez le bouton "Imprimer / PDF" sur la page pour générer un PDF
- **Navigation** : Le CV est accessible depuis la page Infos
- **Layout professionnel** : Mise en page en deux colonnes avec sections clairement définies

## Notes importantes

1. **Conservez toujours** les marqueurs `=section=` et `==`
2. **Respectez** le nom exact des sections (sensible à la casse)
3. **Testez** vos modifications en rafraîchissant la page `/cv/`
4. Les modifications sont **immédiates** - pas besoin de rebuild ou compilation

## Structure des fichiers

```
fanilobini.github.io/
├── cv/
│   └── index.html          # Page HTML du CV
├── cv_data/
│   └── info.txt            # ⭐ Fichier à éditer
├── assets/
│   ├── js/
│   │   └── cv.js           # JavaScript pour charger les données
│   └── css/
│       └── cv.css          # Styles du CV
```
