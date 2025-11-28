# 🎨 RED PROTOCOL - Art Direction & Asset Prompts

> Guide complet pour la génération des assets visuels avec Midjourney/DALL-E/Stable Diffusion

---

## 📁 Structure des Assets

```
public/assets/
├── textures/           # Textures 3D (bureau, papier, etc.)
├── suspects/           # Mugshots des suspects
├── evidence/           # Preuves génériques
├── ui/                 # Éléments d'interface
├── day1/               # Assets Jour 1: The Crash
├── day2/               # Assets Jour 2: Frozen Door
├── day3/               # Assets Jour 3: Torn Map
├── day4/               # Assets Jour 4: Blank Card
├── day5/               # Assets Jour 5: The Signal
├── day6/               # Assets Jour 6: Vial
├── day9/               # Assets Jour 9: CCTV
├── day12/              # Assets Jour 12: Ransom Note
└── day18/              # Assets Jour 18: Suspect Wall
```

---

## 🪵 1. ENVIRONNEMENT 3D (Textures)

### A. Bureau du Détective (Sol de la scène)
**Fichier:** `textures/desk_wood.jpg` (2048x2048, seamless)

```
Seamless top down texture view of an old, dark mahogany wooden desk surface. 
The wood is worn, scratched, and stained. Details include circular coffee mug 
stains, scattered cigarette ash, and dust. Uniform lighting for texture mapping, 
high resolution, realistic wood grain. --ar 1:1 --v 6
```

### B. Dossier "Classifié" (Texture papier)
**Fichier:** `textures/folder_manila.jpg` (1024x1024)

```
Texture of an old, worn manila folder. The paper is yellowed with age. 
A red ink stamp saying "TOP SECRET" is visible in the center. Coffee stains 
on the edges. Paper grain texture, flat lighting for 3D mapping. --ar 1:1 --v 6
```

### C. Carte du Pôle Nord
**Fichier:** `textures/map_northpole.jpg` (2048x1024)

```
Vintage topographic map of the North Pole region. The map looks old, wrinkled, 
and has coffee stains. Red marker circles highlight a zone labeled "SECTEUR 9". 
Realistic paper texture, flat view. --ar 2:1 --v 6
```

### D. Cuir du Sous-main
**Fichier:** `textures/leather_pad.jpg` (1024x1024, seamless)

```
Seamless texture of old worn black leather desk pad. Scratched surface, 
visible grain, subtle reflection. Top down view, flat lighting for 3D mapping. 
--ar 1:1 --v 6
```

---

## 👤 2. LES SUSPECTS (Jour 18 - Mur des Suspects)

### Suspect 1: L'Elfe de Gang
**Fichier:** `suspects/elf_gangster.jpg` (512x768)

```
Cinematic mugshot of a gritty Christmas Elf suspect. He has a scar over one eye, 
unkempt green hair, and looks tired and dangerous. He is holding a black police 
slate with the number '98-25'. Harsh interrogation lighting, casting sharp shadows 
against a height chart background. Realistic skin texture. --ar 2:3 --v 6
```

### Suspect 2: Jack Frost (Le Tueur à gages)
**Fichier:** `suspects/jack_frost.jpg` (512x768)

```
Cinematic mugshot of a human-like suspect with pale blue icy skin and spiked 
white hair. He wears a leather trench coat. He looks cold and emotionless. 
Holding a police slate number '00-❄️'. Noir atmosphere, 35mm film grain. --ar 2:3 --v 6
```

### Suspect 3: Rudolph (Le Traître)
**Fichier:** `suspects/rudolph.jpg` (512x768)

```
Cinematic mugshot of a human-hybrid with a red nose that glows dimly but looks 
broken. He has a black eye and a band-aid on his cheek. He looks nervous and sweaty. 
Police lineup background, gritty realism. --ar 2:3 --v 6
```

### Suspect 4: Mère Noël (La Marraine)
**Fichier:** `suspects/mrs_claus.jpg` (512x768)

```
Cinematic mugshot of an elderly woman looking like a mafia godmother. She wears 
a fur coat and pearl necklace, looking arrogant and untouched. Police slate 
number 'MRS-01'. Dark moody lighting. --ar 2:3 --v 6
```

### Suspect 5: Krampus (L'Exécuteur)
**Fichier:** `suspects/krampus.jpg` (512x768)

```
Cinematic mugshot of a demonic creature with curved horns and dark fur. Yellow 
eyes, chains around his neck. Police slate number 'KR-666'. Extremely intimidating, 
noir horror atmosphere. --ar 2:3 --v 6
```

---

## 🔍 3. PREUVES PAR JOUR

### Jour 1: Photo du Crash (Polaroïd)
**Fichier:** `day1/crash_polaroid.jpg` (1024x1024)

```
Wide angle night photography of a sleigh crash site in a snowy tundra. 
Smoke is rising from the wreckage. Red and blue police lights reflect on the snow. 
A yellow "DO NOT CROSS" tape is in the foreground. Hyper realistic crime scene 
photo, polaroid frame. --ar 1:1 --v 6
```

### Jour 2: Empreinte Givrée
**Fichier:** `day2/frozen_handprint.jpg` (1024x1024)

```
Close up of a 4-finger handprint melted into thick frost on a metal door. 
The handprint is clearly missing one finger (thumb). Ice crystals around edges. 
Blue cold lighting, forensic photography style. --ar 1:1 --v 6
```

### Jour 3: Carte Déchirée (4 morceaux)
**Fichiers:** `day3/map_piece_1.png` à `day3/map_piece_4.png` (512x512 chaque)

```
Fragment of a torn military map showing part of "SECTOR 9" text. 
Old paper texture, coffee stains, red marker annotations. 
Isolated on white background for transparency. --ar 1:1 --v 6
```

### Jour 4: Carte de Visite

**Version Normale:** `day4/card_normal.jpg` (1024x512)
```
Close up texture of a plain white business card, slightly textured heavy paper, 
blank, flat lighting, high resolution. --ar 2:1 --v 6
```

**Version UV:** `day4/card_uv.jpg` (1024x512)
```
Texture of a white business card glowing under UV purple light. 
Glowing green handwritten numbers "88-21" are visible in the center. 
Ultraviolet photography style, purple ambient lighting. --ar 2:1 --v 6
```

### Jour 5: Radio Vintage
**Fichier:** `day5/radio_vintage.jpg` (1024x768)

```
Vintage 1960s military radio receiver with analog dials and frequency display. 
Worn metal casing, glowing amber dial at 94.5 FM. Moody lighting, dust particles. 
Photorealistic, noir atmosphere. --ar 4:3 --v 6
```

### Jour 6: Fiole de Poison
**Fichier:** `day6/vial_blue.png` (512x512)

```
Macro photography of a small medical glass vial containing a glowing 
electric-blue liquid. The glass is dirty. A torn label with a hazard symbol 
is visible. Dramatic backlighting, bokeh effect. Isolated on white background. 
--ar 1:1 --v 6
```

### Jour 9: Image CCTV
**Fichier:** `day9/cctv_footage.jpg` (1920x1080)

```
Grainy black and white CCTV security footage frame. Low resolution. 
It shows a hooded figure breaking into a warehouse at night. 
The figure has a distinct tattoo on their hand. Night vision green tint, 
scanlines, digital noise, timestamp "23:47:12". --ar 16:9 --v 6
```

### Jour 12: Lettre de Menace
**Fichier:** `day12/ransom_note.jpg` (1024x1024)

```
Texture of a ransom note created from letters cut out of magazines and 
newspapers pasted onto a piece of paper. The text reads "WE KNOW WHAT YOU DID". 
The paper is crumpled. Harsh flash lighting, realistic paper texture. --ar 1:1 --v 6
```

---

## 🖥️ 4. UI & ATMOSPHÈRE

### Fond Terminal CRT
**Fichier:** `ui/crt_terminal.jpg` (1920x1080)

```
Extreme close up of an old CRT computer monitor screen displaying green 
command line text on a black background. Visible RGB pixels grid, scanlines, 
screen curvature reflection. Cyberpunk noir aesthetic. --ar 16:9 --v 6
```

### Fond Dossier (Inventaire)
**Fichier:** `ui/case_file_bg.jpg` (1920x1080)

```
Texture of an open cardboard case file box filled with papers. 
Top down view. Dim lighting, moody atmosphere. Police evidence box style. 
--ar 16:9 --v 6
```

### Écran de Chargement
**Fichier:** `ui/loading_screen.jpg` (1920x1080)

```
Dark noir office desk at night. Single desk lamp illuminating scattered 
case files. Rain visible through venetian blinds. Cigarette smoke in the air. 
Cinematic, moody atmosphere. --ar 16:9 --v 6
```

### Fond Menu Principal
**Fichier:** `ui/main_menu_bg.jpg` (1920x1080)

```
Establishing shot of a snowy crime scene at the North Pole at night. 
Red and blue police lights illuminate falling snow. Dark silhouette of a 
detective in the foreground. Cinematic noir Christmas atmosphere. --ar 16:9 --v 6
```

---

## 🛠️ CONSEILS TECHNIQUES

### Formats recommandés

| Type | Format | Résolution | Notes |
|------|--------|------------|-------|
| Textures 3D | JPG | 1024-2048px | Seamless si répétition |
| Objets détourés | PNG | 512-1024px | Fond transparent |
| Fonds d'écran | JPG | 1920x1080 | 16:9 |
| Mugshots | JPG | 512x768 | 2:3 portrait |
| UI Elements | PNG | Variable | Fond transparent |

### Post-traitement recommandé

1. **Textures seamless** : Utiliser Photoshop/GIMP "Offset" + clone stamp
2. **Détourage** : remove.bg ou Photoshop "Select Subject"
3. **Compression** : TinyPNG pour optimiser le poids
4. **Normal Maps** : Générer avec NormalMap-Online pour textures 3D

### Paramètres Midjourney

- `--v 6` : Version 6 pour le photoréalisme
- `--ar X:Y` : Aspect ratio
- `--style raw` : Moins stylisé, plus réaliste
- `--q 2` : Qualité haute (plus lent)

---

## 📋 Checklist Assets

- [ ] `textures/desk_wood.jpg`
- [ ] `textures/folder_manila.jpg`
- [ ] `textures/map_northpole.jpg`
- [ ] `textures/leather_pad.jpg`
- [ ] `suspects/elf_gangster.jpg`
- [ ] `suspects/jack_frost.jpg`
- [ ] `suspects/rudolph.jpg`
- [ ] `suspects/mrs_claus.jpg`
- [ ] `suspects/krampus.jpg`
- [ ] `day1/crash_polaroid.jpg`
- [ ] `day2/frozen_handprint.jpg`
- [ ] `day3/map_piece_1-4.png`
- [ ] `day4/card_normal.jpg`
- [ ] `day4/card_uv.jpg`
- [ ] `day5/radio_vintage.jpg`
- [ ] `day6/vial_blue.png`
- [ ] `day9/cctv_footage.jpg`
- [ ] `day12/ransom_note.jpg`
- [ ] `ui/crt_terminal.jpg`
- [ ] `ui/case_file_bg.jpg`
- [ ] `ui/loading_screen.jpg`
- [ ] `ui/main_menu_bg.jpg`

---

*🔴 RED PROTOCOL - Noir Christmas Investigation*

