// utils/clasificador.js

class RecipeClassifier {
  constructor() {
    // Palabras clave para clasificación por tipo
    this.tipoKeywords = {
      desayuno: ['desayuno', 'tostada', 'huevo', 'cereal', 'yogur', 'granola', 'fruta', 'batido', 'smoothie', 'waffle', 'pancake', 'tostada francesa', 'avena', 'muesli', 'café', 'té', 'zumo', 'omelette', 'bagel', 'muffin'],
      almuerzo: ['almuerzo', 'comida', 'ensalada', 'sandwich', 'bocadillo', 'wrap', 'burrito', 'burger', 'pasta', 'arroz', 'taco', 'pizza', 'quiche', 'paella', 'risotto', 'curry', 'sopa', 'falafel', 'tabulé', 'pollo', 'pescado', 'carne'],
      cena: ['cena', 'sopa caliente', 'stew', 'guiso', 'asado', 'estofado', 'filete', 'salmón', 'tacos', 'lasaña', 'cazuela', 'salteado', 'curry', 'pasta al horno', 'sushi', 'ensalada caliente', 'arroz al horno'],
      postre: ['postre', 'tarta', 'pastel', 'flan', 'helado', 'galleta', 'brownie', 'mousse', 'cheesecake', 'tiramisú', 'cupcake', 'donut', 'pudding', 'trufa', 'macaron', 'panna cotta', 'gelatina', 'crepe', 'panacotta'],
      snack: ['snack', 'aperitivo', 'tapas', 'dip', 'hummus', 'guacamole', 'patatas', 'chips', 'nachos', 'frutos secos', 'palomitas', 'barrita', 'bolitas', 'rollito', 'empanadilla', 'pincho', 'barra de cereal'],
      bebida: ['bebida', 'café', 'té', 'infusión', 'zumo', 'jugo', 'limonada', 'batido', 'smoothie', 'milkshake', 'cóctel', 'mojito', 'latte', 'capuchino', 'espresso', 'cold brew', 'chocolate caliente', 'agua', 'tónica']
    };

    // Palabras clave para dificultad
    this.dificultadKeywords = {
      fácil: ['fácil', 'simple', 'rápido', 'básico', 'sencillo', 'sin cocinar', 'mezclar', '5 minutos', '10 minutos'],
      medio: ['medio', 'moderado', 'hornear', 'freír', 'saltear', '30 minutos', '45 minutos', 'cocinar'],
      difícil: ['difícil', 'complejo', 'elaborado', 'técnica', 'professional', 'horas', '2 horas', 'fermentar', 'glasear']
    };

    // Palabras clave para dieta
    this.dietaKeywords = {
      vegetariano: {
        include: ['verdura', 'vegetal', 'tofu', 'legumbre', 'garbanzo', 'lenteja', 'quinoa', 'seta', 'champiñón', 'espinaca', 'brócoli', 'berenjena', 'calabacín', 'pimiento', 'queso', 'huevo', 'yogur'],
        exclude: ['carne', 'pollo', 'pescado', 'marisco', 'jamón', 'bacon', 'chorizo', 'ternera', 'cerdo', 'pavo', 'atún']
      },
      vegano: {
        include: ['tofu', 'tempeh', 'seitan', 'legumbre', 'garbanzo', 'lenteja', 'quinoa', 'arroz integral', 'espinaca', 'brócoli', 'verdura', 'vegetal', 'leche de avena', 'leche de almendra', 'leche de coco'],
        exclude: ['carne', 'pollo', 'pescado', 'marisco', 'huevo', 'leche', 'queso', 'yogur', 'miel', 'gelatina']
      },
      sinGluten: {
        include: ['sin gluten', 'harina de arroz', 'harina de almendra', 'harina de coco', 'quinoa', 'arroz', 'maíz', 'patata', 'legumbre'],
        exclude: ['trigo', 'cebada', 'centeno', 'sémola', 'gluten', 'pasta', 'pan', 'galleta', 'cerveza']
      },
      sinLactosa: {
        include: ['sin lactosa', 'leche de avena', 'leche de almendra', 'leche de coco', 'bebida vegetal'],
        exclude: ['leche', 'queso', 'yogur', 'mantequilla', 'nata', 'crema', 'lactosa']
      }
    };
  }

  /**
   * Clasificar receta usando título, descripción e ingredientes
   * @param {{ titulo: string, descripcion: string, ingredientes: string[] }} params
   * @returns {{ type: string, difficulty: string, preparationTime: string, tags: string[] }}
   */
  clasificarReceta({ titulo, descripcion = '', ingredientes = [] }) {
    const text = (titulo + ' ' + descripcion + ' ' + ingredientes.join(' ')).toLowerCase();
    return {
      type: this.detectarTipo(text),
      difficulty: this.detectarDificultad(text),
      preparationTime: this.estimarTiempo(text),
      tags: this.detectarTags(text)
    };
  }

  detectarTipo(texto) {
    let maxScore = 0;
    let tipoDetectado = '';
    for (const [tipo, keywords] of Object.entries(this.tipoKeywords)) {
      const score = keywords.reduce((acc, kw) => acc + (texto.includes(kw) ? 1 : 0), 0);
      if (score > maxScore) {
        maxScore = score;
        tipoDetectado = tipo;
      }
    }
    return tipoDetectado;
  }

  detectarDificultad(texto) {
    // Indicadores explícitos
    for (const [nivel, keywords] of Object.entries(this.dificultadKeywords)) {
      if (keywords.some(kw => texto.includes(kw))) return nivel;
    }
    // Inferencia básica
    const complejos = ['hornear', 'fermentar', 'glasear', 'reducir', 'flambear', 'templar'];
    const faciles = ['mezclar', 'batir', 'cortar', 'servir'];
    if (complejos.some(ind => texto.includes(ind))) return 'difícil';
    if (faciles.some(ind => texto.includes(ind))) return 'fácil';
    return 'medio';
  }

  estimarTiempo(texto) {
    const timeRegex = /(\d+)\s*(min|minuto|minutos|h|hora|horas)/gi;
    const matches = texto.match(timeRegex);
    let total = 0;
    if (matches) {
      matches.forEach(m => {
        const num = parseInt(m.match(/\d+/)[0]);
        if (/h/.test(m)) total += num * 60;
        else total += num;
      });
      return total.toString();
    }
    if (texto.includes('rápido') || texto.includes('express')) return '15';
    if (texto.includes('lento') || texto.includes('cocción lenta')) return '120';
    return '30';
  }

  detectarTags(texto) {
    const tags = [];
    if (this.esVerdadero('vegetariano', texto)) tags.push('vegetariano');
    if (this.esVerdadero('vegano', texto)) tags.push('vegano');
    if (this.esVerdadero('sinGluten', texto)) tags.push('sin gluten');
    if (this.esVerdadero('sinLactosa', texto)) tags.push('sin lactosa');
    return tags;
  }

  esVerdadero(categoria, texto) {
    const { include = [], exclude = [] } = this.dietaKeywords[categoria] || {};
    if (exclude.some(ing => texto.includes(ing))) return false;
    if (include.some(ing => texto.includes(ing))) return true;
    return false;
  }
}

module.exports = new RecipeClassifier();
