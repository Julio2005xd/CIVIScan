# CIVIScan 🗺️

**Plataforma de reporte y seguimiento de daños viales**

CIVIScan permite a los ciudadanos reportar baches, señales dañadas, inundaciones y otras fallas en la infraestructura vial de forma rápida, desde cualquier dispositivo.

---

## 🚀 Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
http://localhost:5173
```

---

## 🏗️ Estructura del proyecto

```
civicscan/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Navbar + BottomNav para móvil
│   │   ├── MapView.tsx       # Mapa interactivo (Leaflet)
│   │   ├── ReportCard.tsx    # Tarjeta de reporte
│   │   ├── ReportForm.tsx    # Formulario multi-paso
│   │   └── StatusBadge.tsx   # Badges de estado y prioridad
│   ├── pages/
│   │   ├── Home.tsx          # Vista principal con mapa
│   │   ├── Reports.tsx       # Listado con filtros
│   │   ├── ReportDetail.tsx  # Detalle de un reporte
│   │   ├── NewReport.tsx     # Formulario nuevo reporte
│   │   └── Dashboard.tsx     # Estadísticas
│   ├── hooks/
│   │   └── useGeolocation.ts # Hook de geolocalización
│   ├── data/
│   │   └── mockReports.ts    # Datos de prueba + constantes
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript
│   ├── App.tsx               # Router principal
│   ├── main.tsx              # Entry point
│   └── index.css             # Estilos globales + Tailwind
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🗺️ Mapa

Este proyecto usa **Leaflet** + **react-leaflet** con tiles de OpenStreetMap (gratuito, sin API key).

### Alternativa: Google Maps

Para usar Google Maps en lugar de Leaflet:

1. Instalar: `npm install @vis.gl/react-google-maps`
2. Obtener API key en: https://console.cloud.google.com
3. Crear `.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```
4. Reemplazar `MapView.tsx` usando `<APIProvider>` y `<Map>` de `@vis.gl/react-google-maps`

---

## 🎨 Paleta de colores

| Token                     | Hex       | Uso                     |
|---------------------------|-----------|-------------------------|
| `civic-blue-600`          | `#1D4ED8` | Color principal         |
| `civic-blue-800`          | `#1E2F6B` | Encabezados, fondos     |
| `civic-green-500`         | `#22C55E` | Acciones positivas      |
| `civic-green-600`         | `#16A34A` | Botón de envío          |
| Blanco                    | `#FFFFFF` | Tarjetas, fondos        |
| `slate-50`                | `#F8FAFC` | Fondo general           |

---

## 📐 Tipografía

- **Display/Títulos**: [Syne](https://fonts.google.com/specimen/Syne) — Bold, geométrica, institucional
- **Cuerpo**: [Figtree](https://fonts.google.com/specimen/Figtree) — Legible, moderna y amigable
- **Mono**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — IDs, códigos

---

## 📱 Responsive Design

- **Mobile-first**: diseñado principalmente para uso desde el celular
- **Bottom navigation bar**: visible solo en móvil/tablet
- **Top navbar**: visible en desktop
- Breakpoints de Tailwind: `sm` (640px), `md` (768px), `lg` (1024px)

---

## 🔌 Conexión al backend (futuro)

Los tipos en `src/types/index.ts` ya contemplan la estructura de API:

```typescript
// Ejemplo: obtener reportes
const response = await fetch('/api/reports');
const data: ApiResponse<PaginatedResponse<Report>> = await response.json();
```

Los archivos de `mockReports.ts` se reemplazan por llamadas `fetch`/`axios` en los hooks correspondientes.

### Endpoints sugeridos

```
GET    /api/reports              Lista paginada de reportes
POST   /api/reports              Crear nuevo reporte
GET    /api/reports/:id          Detalle de un reporte
PUT    /api/reports/:id/status   Actualizar estado (admin)
POST   /api/reports/:id/vote     Votar por un reporte
GET    /api/stats/dashboard      Estadísticas globales
POST   /api/upload/photos        Subir fotos
```

---

## 🛠️ Stack tecnológico

| Tecnología        | Versión  | Rol                          |
|-------------------|----------|------------------------------|
| React             | 18.x     | UI framework                 |
| TypeScript        | 5.x      | Tipado estático              |
| Vite              | 5.x      | Build tool / dev server      |
| Tailwind CSS      | 3.x      | Estilos utilitarios          |
| React Router      | 6.x      | Navegación SPA               |
| Leaflet           | 1.9.x    | Mapas interactivos           |
| react-leaflet     | 4.x      | Wrapper React para Leaflet   |
| lucide-react      | 0.363.x  | Iconos                       |

---

## 📦 Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Análisis de código
```

---

## 📄 Licencia

Proyecto interno — CIVIScan © 2024. Todos los derechos reservados.
