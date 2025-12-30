# Documentación Técnica - TechNova Store

Este documento detalla los flujos críticos de integración entre Payload CMS y el Frontend React.

## 1. Gestión de Productos (CMS)

### Añadir Especificaciones (Specs)
El frontend renderiza dinámicamente las especificaciones técnicas. Para que aparezcan correctamente en la `ProductPage`:

1. Ve a la colección **Products** en el panel de administración.
2. Abre la pestaña **Product Details**.
3. En el campo **Specifications**, añade items:
   - **Label:** Nombre visible (ej: "Batería", "Procesador").
   - **Value:** Valor técnico (ej: "5000mAh", "Snapdragon 8 Gen 2").
   - **Icon:** Nombre exacto del icono de [Lucide React](https://lucide.dev/icons).
     - *Nota:* El sistema es tolerante a fallos. Si escribes "battery" (minúscula) o un nombre inválido, el frontend lo corregirá automáticamente o mostrará un icono genérico (Rayo).

### Gestión de Stock
El botón "Añadir al Carrito" está vinculado directamente al campo `inventory` (Stock) del plugin de E-commerce.
- Si `Stock <= 0`: El botón se bloquea y muestra "Agotado".
- Si intentas añadir más del stock disponible: El sistema mostrará una alerta (Toast) y ajustará la cantidad al máximo disponible.

## 2. SEO y Metadatos
El componente `<SEO />` inyecta automáticamente las etiquetas necesarias para:
- **Google:** Title y Meta Description optimizados.
- **Redes Sociales (OG Tags):** Al compartir en WhatsApp/Facebook, se mostrará la imagen del producto, precio y título.

## 3. Arquitectura Frontend

### Hooks Principales
- `useProducts`: Wrapper de TanStack Query para fetch de datos.
- `useCartStore`: Gestión de estado del carrito (Zustand + Persist).
- `useHistoryStore`: Gestión de "Vistos Recientemente" (Zustand + Persist).

### Optimización de Imágenes
El servicio `productService.js` detecta automáticamente si una imagen proviene de Unsplash y le añade parámetros de CDN (`auto=format&q=75`) para reducir el peso hasta en un 80%.

## 4. Instalación de Dependencias Nuevas
Si despliegas este proyecto en un nuevo entorno, asegúrate de instalar:

```bash
cd frontend
npm install react-helmet-async canvas-confetti
```
