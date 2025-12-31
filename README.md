# Colorear Web

Aplicación web de dibujos para colorear construida con Next.js (frontend) y Express (backend).

## Características

- Frontend: Next.js 16 con App Router
- Backend: Express API integrado
- Base de datos: Supabase
- Despliegue unificado: Frontend y Backend en un solo servidor

## Configuración Inicial

1. **Clonar el repositorio**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

   Luego edita `.env` y añade tus credenciales de Supabase:
   ```
   SUPABASE_URL=tu-url-de-supabase
   SUPABASE_KEY=tu-clave-anon-de-supabase
   NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
   ```

4. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   El servidor estará disponible en [http://localhost:3000](http://localhost:3000)
   - Frontend: http://localhost:3000
   - API Backend: http://localhost:3000/api

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo (frontend + backend integrados)
- `npm run build` - Construye la aplicación para producción
- `npm start` - Ejecuta el servidor en modo producción
- `npm run lint` - Ejecuta el linter de código

## Estructura del Proyecto

```
/app              - Páginas y rutas de Next.js
/backend          - Código del servidor Express
  /src
    /routes       - Rutas del API
    /controllers  - Controladores
    /services     - Lógica de negocio
    /config       - Configuración (Supabase, etc.)
/frontend         - Componentes y utilidades del frontend
  /components     - Componentes de React
  /lib            - Utilidades y funciones helper
/public           - Archivos estáticos
/styles           - Estilos globales
server.js         - Servidor personalizado que integra Next.js y Express
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
