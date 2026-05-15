# Huerto en Casa

Huerto en Casa es una aplicación web para aprender, compartir y gestionar contenido sobre huertos urbanos, cultivo doméstico y apoyo comunitario.

Incluye:

- Página principal con secciones de beneficios, guía de plantas y blog.
- Comunidad para preguntas y respuestas.
- Registro e inicio de sesión con Supabase.
- Panel de usuario para bitácora y seguimiento.
- Panel administrativo para artículos, usuarios, verificación y expertos.
- Flujo de solicitud para expertos con cédula profesional simulada.

## Tecnologías

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase
- shadcn/ui y Radix UI

## Requisitos

- Node.js 18 o superior
- pnpm, npm o el gestor que prefieras
- una cuenta y proyecto en Supabase

## Configuración

1. Instala las dependencias.

```bash
npm install
```

2. Crea un archivo `.env.local` con tus credenciales de Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

3. Inicia el servidor de desarrollo.

```bash
npm run dev
```

4. Abre la aplicación en `http://localhost:3000`.

## Scripts

- `npm run dev`: arranca el entorno de desarrollo
- `npm run build`: genera la versión de producción
- `npm run start`: ejecuta la app compilada
- `npm run lint`: revisa el código con ESLint

## Estructura general

- `app/`: rutas, layouts, páginas y API routes
- `components/`: componentes reutilizables de interfaz
- `lib/supabase/`: clientes de Supabase para navegador, servidor y middleware
- `hooks/`: hooks reutilizables
- `public/`: archivos estáticos
- `styles/` y `app/globals.css`: estilos globales

## Notas

- El proyecto usa Supabase para autenticación y persistencia.
- El flujo de verificación de cédula está simulado para pruebas de interfaz.
- La app está pensada para funcionar bien en escritorio y móvil.
