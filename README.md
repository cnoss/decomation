# decomation - Animierte Visualisierungsbibliothek

Eine leichtgewichtige JavaScript-Bibliothek für die Erstellung animierter Canvas-Visualisierungen mit GSAP und Konva.js. Perfekt für interaktive Websites, Datenvisualisierungen und kreative Projekte.

## 🚀 Features

- **Scroll-responsive Animationen** - Elemente reagieren auf Scroll-Position
- **Verschiedene Visualisierungstypen** - Punkte, Quadrate, Polygone, Linien
- **High Performance** - Optimiert für 60fps mit Konva.js
- **Einfache Integration** - Nur HTML-Attribute setzen
- **Responsive Design** - Automatische Anpassung an Container-Größe
- **Konfigurierbar** - Flexible Parameter für jede Visualisierung

## 📦 Installation

### 1. Abhängigkeiten einbinden

```html
<!-- GSAP für Animationen -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<!-- Konva.js für Canvas-Rendering -->
<script src="https://unpkg.com/konva@9/konva.min.js"></script>

<!-- decomation -->
<script src="script.js"></script>
```

### 2. CSS einbinden

```html
<link rel="stylesheet" href="variables.css">
<link rel="stylesheet" href="style.css">
```

## 🎯 Grundlegende Verwendung

Fügen Sie einfach ein div-Element mit der Klasse `decomation` und den gewünschten Attributen hinzu:

```html
<div class="decomation" 
     data-js-kic-type="dots" 
     data-js-kic-min="10" 
     data-js-kic-max="20">
</div>
```

## 📋 Verfügbare Visualisierungstypen

### 🔵 Dots (Punkte)
```html
<div class="decomation" 
     data-js-kic-type="dots" 
     data-js-kic-min="15" 
     data-js-kic-max="30" 
     data-js-kic-size="10"
     data-js-kic-brake="20">
</div>
```

### ⬜ Squares (Quadrate)
```html
<div class="decomation" 
     data-js-kic-type="squares" 
     data-js-kic-min="5" 
     data-js-kic-max="10">
</div>
```

### 🔺 Polygons (Polygone)
```html
<div class="decomation" 
     data-js-kic-type="polygons" 
     data-js-kic-nodes="3" 
     data-js-kic-min="8" 
     data-js-kic-max="15">
</div>
```

### ➖ Lines (Linien)
```html
<div class="decomation" 
     data-js-kic-type="lines" 
     data-js-kic-min="10" 
     data-js-kic-max="20" 
     data-js-kic-strokeweight="2">
</div>
```

## ⚙️ Parameter-Referenz

| Parameter | Typ | Beschreibung | Standard | Beispiel |
|-----------|-----|--------------|----------|----------|
| `data-js-kic-type` | String | **Erforderlich** - Art der Visualisierung | - | `"dots"`, `"squares"`, `"polygons"`, `"lines"` |
| `data-js-kic-min` | Number | Minimale Anzahl Elemente pro Reihe/Spalte | `6` | `data-js-kic-min="5"` |
| `data-js-kic-max` | Number | Maximale Anzahl Elemente pro Reihe/Spalte | `12` | `data-js-kic-max="20"` |
| `data-js-kic-size` | Number | Größe der Elemente (nur für dots) | `auto` | `data-js-kic-size="8"` |
| `data-js-kic-nodes` | Number | Anzahl Ecken (nur für polygons) | `6` | `data-js-kic-nodes="3"` |
| `data-js-kic-strokeweight` | Number | Linienstärke (nur für lines) | `1` | `data-js-kic-strokeweight="3"` |
| `data-js-kic-brake` | Number | Animationsgeschwindigkeit - höhere Werte = langsamere Animation | `10` | `data-js-kic-brake="20"` |
| `data-js-kic-width` | Number | Canvas-Breite in Pixel | `auto` | `data-js-kic-width="400"` |
| `data-js-kic-height` | Number | Canvas-Höhe in Pixel | `auto` | `data-js-kic-height="300"` |

## 🎨 Farben anpassen

Die Bibliothek verwendet CSS-Variablen für Farben. Definieren Sie diese in Ihrer `variables.css`:

```css
:root {
  --km-blau: #3498db;
  --km-pink: #e74c3c;
  --dark: #2c3e50;
}
```

## 📝 Vollständige Beispiele

### Beispiel 1: Große Punktvisualisierung
```html
<div class="decomation" 
     data-js-kic-type="dots" 
     data-js-kic-min="15" 
     data-js-kic-max="30" 
     data-js-kic-size="10"
     data-js-kic-width="800"
     data-js-kic-height="600">
</div>
```

### Beispiel 2: Kleine Quadrate im Grid
```html
<div class="grid">
  <div class="decomation" 
       data-js-kic-type="dots" 
       data-js-kic-size="5" 
       data-js-kic-min="5" 
       data-js-kic-max="6">
  </div>
  <div class="decomation" 
       data-js-kic-type="squares" 
       data-js-kic-min="5" 
       data-js-kic-max="6">
  </div>
</div>
```

### Beispiel 3: Dreiecke (Polygone)
```html
<div class="decomation" 
     data-js-kic-type="polygons" 
     data-js-kic-nodes="3" 
     data-js-kic-min="10" 
     data-js-kic-max="20"
     data-js-kic-brake="20">
</div>
```

### Beispiel 4: Animierte Linien
```html
<div class="decomation" 
     data-js-kic-type="lines" 
     data-js-kic-min="10" 
     data-js-kic-max="20" 
     data-js-kic-strokeweight="2">
</div>
```

### Beispiel 5: Langsamere Animation mit brake Parameter
```html
<div class="decomation" 
     data-js-kic-type="dots" 
     data-js-kic-min="8" 
     data-js-kic-max="15" 
     data-js-kic-size="12"
     data-js-kic-brake="50">
</div>
```
<small>💡 *Höhere brake-Werte (z.B. 50) führen zu deutlich langsameren, ruhigeren Animationen*</small>

## 🔧 Erweiterte Konfiguration

### Canvas-Größe automatisch anpassen
Ohne `width` und `height` Attribute passt sich das Canvas automatisch an:
- Standard: `min(window.innerWidth / 2, 600)` x `min(window.innerWidth / 2, 600)`

### Responsive Verhalten
Die Visualisierungen reagieren auf Scroll-Events und bewegen sich basierend auf der Scroll-Position.

### Performance-Optimierung
- Verwendet `requestAnimationFrame` für Scroll-Events
- Batched Drawing für bessere Performance
- Automatisches Throttling bei vielen gleichzeitigen Animationen

## 🎭 Animation-Verhalten

### Scroll-Animation
- Elemente bewegen sich basierend auf der Scroll-Position
- Jedes Element hat zufällige Bewegungsparameter
- Flüssige 60fps Animationen

### Hover-Effekte
- Cursor ändert sich zu `pointer`
- Stroke-Width erhöht sich bei Hover
- Smooth Transitions zwischen Zuständen

## 🛠️ Technische Details

### Architektur
```
CanvasManager
├── Stage (Konva.js)
├── Layer (Konva.js)
└── Elements[]
    ├── Circle (für dots)
    ├── Rect (für squares)
    ├── RegularPolygon (für polygons)
    └── Line (für lines)
```

### Dependencies
- **GSAP 3.12.2+** - Für Animationen und Utilities
- **Konva.js 9.0+** - Für Canvas-Rendering
- **Modern Browser** - ES6+ Support erforderlich

## 🚨 Browser-Unterstützung

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 📱 Responsive Design

```css
.decomation {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .decomation {
    max-width: 100%;
  }
}
```

## 🎯 Best Practices

### 1. Performance
```html
<!-- Weniger Elemente für mobile Geräte -->
<div class="decomation" 
     data-js-kic-type="dots" 
     data-js-kic-min="8" 
     data-js-kic-max="12">
</div>
```

### 2. Barrierefreiheit
```html
<div class="decomation" 
     data-js-kic-type="dots"
     aria-label="Animierte Punktvisualisierung"
     role="img">
</div>
```

### 3. SEO-freundlich
```html
<!-- Canvas als Enhancement, nicht als kritischer Content -->
<div class="content">
  <h2>Mein Inhalt</h2>
  <p>Wichtiger Text hier...</p>
  <div class="decomation" data-js-kic-type="dots"></div>
</div>
```

## 🔍 Debugging

### Console-Logs aktivieren
```javascript
// In script.js am Ende hinzufügen:
console.log('Canvas Manager erstellt:', canvasManagers.length);
```

### Performance-Monitoring
```javascript
// FPS Counter anzeigen
const stats = new Stats();
document.body.appendChild(stats.dom);
```

## 📄 Lizenz

MIT License - Frei für kommerzielle und private Projekte.

## 🤝 Mitwirken

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/neue-funktion`)
3. Committe deine Änderungen (`git commit -am 'Neue Funktion hinzugefügt'`)
4. Push zum Branch (`git push origin feature/neue-funktion`)
5. Erstelle einen Pull Request

## 📞 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue im GitHub Repository
- Prüfe die Konsole auf Fehlermeldungen
- Stelle sicher, dass alle Dependencies geladen sind

---

**decomation** - Erstellt für moderne, interaktive Weberlebnisse 🎨✨
