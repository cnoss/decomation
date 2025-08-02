// CSS-Variablen abrufen
const root = document.documentElement;
const styles = getComputedStyle(root);
const kmBlau = styles.getPropertyValue('--km-blau')?.trim() || '#4ecdc4';
const kmOrange = styles.getPropertyValue('--km-pink')?.trim() || '#ff6b6b';
const kmGray = styles.getPropertyValue('--dark')?.trim() || '#666';
const stageBackgroundColor = styles.getPropertyValue('--stage-background-color')?.trim() || 'transparent';

// Utility-Funktionen
function getOffsetTopViewport(el) {
  return el.getBoundingClientRect().top - el.getBoundingClientRect().height / 2;
}

// Canvas-Manager Klasse
class CanvasManager {
  constructor(container, config = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.elements = [];
    this.elementId = 0;
    this.isRunning = true;
    
    // Konfiguration mit Defaults
    this.config = {
      width: config.width || Math.min(window.innerWidth / 2, 600),
      height: config.height || Math.min(window.innerWidth / 2, 600),
      minItems: config.minItems || 6,
      maxItems: config.maxItems || 12,
      type: config.type || 'dots',
      size: config.size || 'auto',
      nodes: config.nodes || 5,
      colors: config.colors || [kmBlau, kmOrange, kmGray],
      brake: config.brake || 5,
      ...config
    };
    
    this.initStage();
    this.createElements();
    this.setupScrollHandler();
    this.startAnimationLoop();
  }

  initStage() {
    this.stage = new Konva.Stage({
      container: this.container,
      width: this.config.width,
      height: this.config.height,
      // Hintergrundfarbe für die Stage
      background: stageBackgroundColor,
      // Hintergrundfarbe für die Stage
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  createElements() {
    const itemLengthBase = Math.floor(gsap.utils.random(this.config.minItems, this.config.maxItems));
    const itemLengthLines = itemLengthBase * 3;
    const itemLength = this.config.type === 'lines' ? itemLengthLines : itemLengthBase;

    const fieldSize = this.stage.width() / itemLength;
    const intPartFieldsize = Math.floor(fieldSize);
    const fracPartFieldsize = fieldSize - intPartFieldsize;
    const size = this.config.size === 'auto' ? intPartFieldsize / 2.2 : this.config.size;
    const sizeSquare = this.config.size === 'auto' ?  intPartFieldsize : this.config.size;
    const startX = fracPartFieldsize / 2 + intPartFieldsize / 2;
    const startY = fracPartFieldsize / 2 + intPartFieldsize / 2;

    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: this.stage.height() * 2,
      fill: stageBackgroundColor,
      opacity: 0.5,
      listening: false,
    });

    this.layer.add(background);

    for (let row = 0; row < itemLength; row++) {
      for (let col = 0; col < itemLength; col++) {
        const x = startX + col * intPartFieldsize;
        const y = startY + row * intPartFieldsize;

        if(this.config.type === 'squares') {
          const element = new SquareElement(x, y, sizeSquare, this.config.colors, this.layer);
          this.elements.push(element);

        }else if(this.config.type === 'lines') {
          const element = new LineElement(x, y, sizeSquare, this.config.colors, this.layer, this.config.strokeWeight, this.config.brake);
          this.elements.push(element);

        }else if(this.config.type === 'polygons') {
          const element = new PolygonElement(x, y, size, this.config.colors, this.layer, this.config.nodes, this.config.strokeWeight);
          this.elements.push(element);          

        }else{
          const element = new CircleElement(x, y, size, this.config.colors, this.layer, this.config.brake);
          this.elements.push(element);
        }
    
      }
    }

    // Initiale Position setzen
    this.updateElementPositions();
    this.layer.draw();
  }

  updateElementPositions() {
    const scrollY = window.scrollY;
    const offsetTop = getOffsetTopViewport(this.container);
    
    this.elements.forEach((element) => {
      element.changePosition(scrollY, offsetTop, this.stage);
    });
  }

  startAnimationLoop() {
    const animate = () => {
      if (!this.isRunning) return;
      
      // Update alle Elemente (smooth interpolation)
      this.elements.forEach((element) => {
        if (element.update) {
          element.update();
        }
      });
      
      this.layer.batchDraw();
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  setupScrollHandler() {
    // Throttling für bessere Performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateElementPositions();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup-Methode für Event-Listener
    this.destroy = () => {
      this.isRunning = false;
      window.removeEventListener('scroll', handleScroll);
      this.stage.destroy();
    };
  }

  // Resize-Methode für Canvas-Anpassung bei Fenstergrößenänderung
  resize() {
    const newWidth = this.container.offsetWidth || this.config.width;
    const newHeight = this.container.offsetHeight || this.config.height;
    
    // Stage-Größe aktualisieren
    this.stage.width(newWidth);
    this.stage.height(newHeight);
    
    // Config aktualisieren
    this.config.width = newWidth;
    this.config.height = newHeight;
    
    // Alle Elemente entfernen
    this.elements.forEach(element => element.destroy());
    this.elements = [];
    this.layer.destroyChildren();
    
    // Elemente mit neuer Größe neu erstellen
    this.createElements();
  }
}

class CircleElement {
  constructor(x, y, radius = 20, colors = [kmBlau, kmOrange, kmGray], layer, brake = 5) {
    this.originalX = x;
    this.originalY = y;
    this.radius = radius;
    this.layer = layer;
    this.color = this.getRandomColor(colors);
    this.brake = brake;

    // Zufällige Bewegungsparameter
    this.randomX = gsap.utils.random(-100 - this.originalX, 100 + this.originalX) / 100;
    this.randomY = gsap.utils.random(-100 - this.originalY, 100 + this.originalY) / 100;

    // Für smooth interpolation
    this.currentX = x;
    this.currentY = y;
    this.targetX = x;
    this.targetY = y;
    this.lerpFactor = 0.03; // Smaller = smoother, larger = more responsive

    this.createCircle();
    this.addInteractivity();
  }

  createCircle() {
    this.circle = new Konva.Circle({
      x: this.originalX,
      y: this.originalY,
      radius: this.radius,
      fill: this.color,
      // stroke: '#fff',
      opacity: gsap.utils.random(0.8, 1),
      //strokeWidth: 2,
      //shadowColor: 'rgba(0,0,0,0.3)'
    });

    this.layer.add(this.circle);
  }

  addInteractivity() {
    this.circle.on('mouseenter', () => {
      document.body.style.cursor = 'pointer';
      this.circle.strokeWidth(4);
    });

    this.circle.on('mouseleave', () => {
      document.body.style.cursor = 'default';
      this.circle.strokeWidth(2);
    });
  }

  changePosition(scrollY, offsetTop, stage) {
    const offset = offsetTop > 0 ? offsetTop : 0;
    const addValue = gsap.utils.mapRange(0, window.innerHeight * this.brake, 0, stage.height(), offset);

    // Neue Ziel-Positionen berechnen
    this.targetY = this.originalY + (addValue * this.randomY);
    this.targetX = this.originalX + (addValue * this.randomX);
  }

  update() {
    // Smooth interpolation zu den Ziel-Positionen
    this.currentX += (this.targetX - this.currentX) * this.lerpFactor;
    this.currentY += (this.targetY - this.currentY) * this.lerpFactor;
    
    this.circle.x(this.currentX);
    this.circle.y(this.currentY);
  }

  getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  destroy() {
    this.circle.destroy();
  }
}

class SquareElement {
  constructor(x, y, size = 20, colors = [kmBlau, kmOrange, kmGray], layer) {
    this.originalX = x;
    this.originalY = y;
    this.size = size;
    this.layer = layer;
    this.color = this.getRandomColor(colors);
    
    this.randomX = gsap.utils.random(-100 - this.originalX, 100 + this.originalX) / 100;
    this.randomY = gsap.utils.random(-100 - this.originalY, 100 + this.originalY) / 100;

    // Für smooth interpolation
    this.currentX = x;
    this.currentWidth = size;
    this.targetX = x;
    this.targetWidth = size;
    this.lerpFactor = 0.06;

    this.createSquare();
    this.addInteractivity();
  }

  createSquare() {
    this.square = new Konva.Rect({
      x: this.originalX - this.size / 2,
      y: this.originalY - this.size / 2,
      width: this.size,
      height: this.size,
      fill: this.color,
      // stroke: '#fff',
      opacity: gsap.utils.random(0.4, 1),
      //strokeWidth: 2,
      //shadowColor: 'rgba(0,0,0,0.3)'
    });

    this.layer.add(this.square);
  }

  addInteractivity() {
    this.square.on('mouseenter', () => {
      document.body.style.cursor = 'pointer';
      this.square.strokeWidth(4);
    });

    this.square.on('mouseleave', () => {
      document.body.style.cursor = 'default';
      this.square.strokeWidth(2);
    });
  }

  changePosition(scrollY, offsetTop, stage) {
    const offset = offsetTop > 0 ? offsetTop : 0;
    const addValue = gsap.utils.mapRange(0, window.innerHeight, 0, stage.height(), offset);

    // Neue Ziel-Werte berechnen
    this.targetWidth = gsap.utils.mapRange(0, window.innerHeight, 0, this.size, scrollY);
    this.targetX = this.originalX + (addValue * this.randomX);
  }

  update() {
    // Smooth interpolation
    this.currentX += (this.targetX - this.currentX) * this.lerpFactor;
    this.currentWidth += (this.targetWidth - this.currentWidth) * this.lerpFactor;
    
    this.square.x(this.currentX);
    this.square.width(this.currentWidth);
  }

  getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  destroy() {
    this.square.destroy();
  }
}

class LineElement {
  constructor(x, y, size = 20, colors = [kmBlau, kmOrange, kmGray], layer, strokeWeight = 3, brake = 5) {
    this.originalX = x;
    this.originalY = y;
    this.size = size;
    this.layer = layer;
    this.color = this.getRandomColor(colors);
    this.strokeWeight = strokeWeight;
    this.brake = brake;
    
    this.randomX = gsap.utils.random(-100 - this.originalX, 100 + this.originalX) / 100;
    this.randomY = gsap.utils.random(-100 - this.originalY, 100 + this.originalY) / 100;

    // Für smooth interpolation
    this.currentX = x;
    this.currentY = y;
    this.currentRotation = 0;
    this.currentLineLength = size;
    this.targetX = x;
    this.targetY = y;
    this.targetRotation = 0;
    this.targetLineLength = size;
    this.lerpFactor = 0.07;

    this.createLine();
    this.addInteractivity();
  }

  createLine() {
    this.line = new Konva.Line({
      points: [this.originalX, this.originalY, this.originalX, this.originalY + this.size],
      stroke: this.color,
      strokeWidth: this.strokeWeight,
      offsetX: this.size / 2,
      offsetY: this.size / 2,
      opacity: gsap.utils.random(0.4, 1),
    });

    this.layer.add(this.line);
  }

  addInteractivity() {
    this.line.on('mouseenter', () => {
      document.body.style.cursor = 'pointer';
      this.line.strokeWidth(4);
    });

    this.line.on('mouseleave', () => {
      document.body.style.cursor = 'default';
      this.line.strokeWidth(2);
    });
  }

  changePosition(scrollY, offsetTop, stage) {
    const offset = offsetTop > 0 ? offsetTop : 0;
    const addValue = gsap.utils.mapRange(0, window.innerHeight, 0, stage.height(), offset);

    // Neue Ziel-Werte berechnen
    this.targetX = this.originalX + (addValue * this.randomX);
    this.targetY = this.originalY + (addValue * this.randomY);
    this.targetRotation = gsap.utils.mapRange(0, window.innerHeight, 0, 360 / this.brake, offset);
    this.targetLineLength = this.size + addValue;
  }

  update() {
    // Smooth interpolation
    this.currentX += (this.targetX - this.currentX) * this.lerpFactor;
    this.currentY += (this.targetY - this.currentY) * this.lerpFactor;
    this.currentRotation += (this.targetRotation - this.currentRotation) * this.lerpFactor;
    this.currentLineLength += (this.targetLineLength - this.currentLineLength) * this.lerpFactor;
    
    this.line.rotation(this.currentRotation);
    this.line.points([this.currentX, this.currentY, this.currentX, this.currentY + this.currentLineLength]);
  }

  getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  destroy() {
    this.line.destroy();
  }
}

class PolygonElement {
  constructor(x, y, size = 20, colors = [kmBlau, kmOrange, kmGray], layer, nodes = 5, strokeWeight = 2) {
    this.originalX = x;
    this.originalY = y;
    this.size = size;
    this.layer = layer;
    this.nodes = nodes;
    this.strokeWeight = strokeWeight;
    this.color = this.getRandomColor(colors);
    
    this.randomX = gsap.utils.random(-100 - this.originalX, 100 + this.originalX) / 100;
    this.randomY = gsap.utils.random(-100 - this.originalY, 100 + this.originalY) / 100;

    // Für smooth interpolation
    this.currentX = x;
    this.currentRotation = 0;
    this.currentScale = 1;
    this.targetX = x;
    this.targetRotation = 0;
    this.targetScale = 1;
    this.lerpFactor = 0.05; // Langsamste Animation für Polygone

    this.createPolygon();
    this.addInteractivity();
  }

  createPolygon() {
    const sides = this.nodes; // Number of sides for the polygon
    const radius = this.size / 2;

    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const x = this.originalX + Math.cos(angle) * radius;
      const y = this.originalY + Math.sin(angle) * radius;
      points.push(x, y);
    }

    this.polygon = new Konva.Line({
      points: points,
      stroke: this.color,
      strokeWidth: this.strokeWeight,
      closed: true,
      opacity: gsap.utils.random(0.4, 1),
    });

    this.layer.add(this.polygon);
  }

  addInteractivity() {
    this.polygon.on('mouseenter', () => {
      document.body.style.cursor = 'pointer';
      this.polygon.strokeWidth(4);
    });

    this.polygon.on('mouseleave', () => {
      document.body.style.cursor = 'default';
      this.polygon.strokeWidth(2);
    });
  }

  changePosition(scrollY, offsetTop, stage) {
    const offset = offsetTop > 0 ? offsetTop : 0;
    const addValue = gsap.utils.mapRange(0, window.innerHeight, 0, stage.height(), offset);
    
    // Neue Ziel-Werte berechnen
    this.targetScale = gsap.utils.mapRange(0, window.innerHeight, 0, 1, scrollY);
    this.targetX = this.originalX + (addValue * this.randomX);
    this.targetRotation = gsap.utils.mapRange(0, window.innerHeight, 0, 40, offset);
  }

  update() {
    // Smooth interpolation
    this.currentX += (this.targetX - this.currentX) * this.lerpFactor;
    this.currentRotation += (this.targetRotation - this.currentRotation) * this.lerpFactor;
    this.currentScale += (this.targetScale - this.currentScale) * this.lerpFactor;
    
    this.polygon.x(this.currentX);
    this.polygon.rotation(this.currentRotation);
    this.polygon.scaleX(this.currentScale);
    this.polygon.scaleY(this.currentScale);
    this.polygon.offsetX(this.size / 2);
    this.polygon.offsetY(this.size / 2);
  }

  getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  destroy() {
    this.polygon.destroy();
  }
}


/* Main
###################################################################################### */

// Canvas-Manager initialisieren
const kmIlluCanvasManagers = [];

// Funktion zum Erstellen neuer Canvas-Bereiche
function createCanvas(containerId, config = {}) {
  const manager = new CanvasManager(containerId, config);
  kmIlluCanvasManagers.push(manager);
  return manager;
}

// Canvas-Bereiche erstellen
const kmIlluCanvasElements = document.querySelectorAll('[data-js-kic-type]');

kmIlluCanvasElements.forEach((canvas) => {
  const type = canvas.getAttribute('data-js-kic-type') || 'dots';
  const minItems = parseInt(canvas.getAttribute('data-js-kic-min'), 10) || 6;
  const maxItems = parseInt(canvas.getAttribute('data-js-kic-max'), 10) || 12;
  const width = canvas.offsetWidth || 600;
  const height = canvas.offsetHeight || 400;
  const nodes = parseInt(canvas.getAttribute('data-js-kic-nodes'), 10) || 5;
  const size = parseInt(canvas.getAttribute('data-js-kic-size'), 10) || 'auto';
  const strokeWeight = parseInt(canvas.getAttribute('data-js-kic-strokeweight'), 10) || 2;
  const brake = parseFloat(canvas.getAttribute('data-js-kic-brake')) || 5;

  canvas.id = canvas.id || `canvas-${kmIlluCanvasManagers.length + 1}`;

  createCanvas(canvas.id, {
    container: canvas.id,
    width: width,
    height: height,
    minItems: minItems,
    maxItems: maxItems,
    size: size,
    type: type,
    nodes: nodes,
    strokeWeight: strokeWeight,
    brake: brake,
  });
});

// Resize Event-Listener für alle Canvas-Manager
let resizeTimeout;
window.addEventListener('resize', () => {
  // Throttling für bessere Performance
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    kmIlluCanvasManagers.forEach(manager => {
      if (manager && typeof manager.resize === 'function') {
        manager.resize();
      }
    });
  }, 150); // 150ms Debounce
});
