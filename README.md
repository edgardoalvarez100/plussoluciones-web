# Plus Soluciones — Landing Page

Sitio web corporativo estático para **Plus Soluciones**, empresa colombiana de hosting, dominios y streaming.

## Estructura

```
plussoluciones-web/
├── index.html        # Página principal (todo-en-uno)
├── css/
│   └── style.css     # Estilos Mobile-first con CSS custom properties
├── js/
│   └── main.js       # JavaScript vanilla (sin dependencias)
└── README.md         # Este archivo
```

## Stack técnico

- **HTML5** semántico con accesibilidad básica (aria-labels, roles)
- **CSS3** puro: Grid, Flexbox, custom properties, animaciones nativas
- **JavaScript** vanilla ES6+ — sin frameworks, sin jQuery
- **Fuentes:** Google Fonts — Inter + Poppins

## Secciones

1. **Navbar** — Sticky con blur, menú hamburguesa mobile
2. **Hero** — Fondo oscuro degradado, partículas CSS animadas
3. **Servicios** — Grid de 7 cards con iconos SVG inline
4. **Planes de Hosting** — 5 planes con precios reales en COP
5. **Reproductor de Radio** — Player custom HTML5 para La Nueva Radio
6. **Streaming TV** — Descripción del servicio + requisitos técnicos
7. **Stats** — 4 contadores animados con IntersectionObserver
8. **Contacto** — Formulario + info de contacto
9. **Footer** — Links rápidos, copyright

## Cómo usar

Simplemente abre `index.html` en cualquier navegador moderno. No requiere servidor ni compilación.

Para producción, se recomienda servir con un servidor HTTP (nginx, Apache, etc.).

## Identidad de marca

| Token | Valor |
|-------|-------|
| Color principal | `#00a0d2` |
| Color acento | `#ff6b00` |
| Fondo oscuro | `#0d1b2a` |
| Font headings | Poppins 700/800 |
| Font body | Inter 400/500/600 |

## Planes de Hosting

| Plan | Precio/año COP |
|------|---------------|
| Básico | $162.000 |
| Premium | $270.000 |
| Premium Plus | $540.000 |
| Gold ⭐ | $828.000 |
| Professional | $1.512.000 |

## Contacto

- Email: info@plussoluciones.com
- Portal Clientes: https://plussoluciones.com/clientes
- Stream Radio: http://radio.plussoluciones.com/listen/la_nueva_radio/radio

---

*Desarrollado por Luis — Plus Soluciones Dev Team — 2025*
