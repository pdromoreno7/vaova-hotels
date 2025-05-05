# VAOVA Hotels - Sistema de Gestión Hotelera

![VAOVA Hotels](https://vaova-hotels.vercel.app/favicon.ico)

## Descripción del Proyecto

VAOVA Hotels es una aplicación web que permite gestionar hoteles con los cuales VAOVA ha realizado convenios para ofrecerlos dentro de sus planes turísticos. La plataforma permite crear, editar y gestionar perfiles de hoteles con información detallada, galería de imágenes, logotipos, calificaciones y más.

## URL de Despliegue

**Aplicación en vivo**: [https://vaova-hotels.vercel.app/es](https://vaova-hotels.vercel.app/es)

## Características Principales

### 1. Gestión de Usuarios

- **Registro de usuarios**:

  - Registro mediante email y contraseña
  - Registro con Google (opcional)
  - Implementación con Firebase

- **Inicio de sesión**:
  - Login con email y contraseña
  - Login con Google
  - Persistencia de sesión

### 2. Gestión de Hoteles (CRUD)

- **Creación de hoteles** con información detallada:

  - Nombre, descripción, ubicación (país, departamento, municipio)
  - Logo y galería de imágenes
  - Categoría (estrellas) y calificación
  - Tipos de habitaciones disponibles con sus respectivas capacidades

- **Listado de hoteles** con filtrado por:

  - Categoría
  - Estado (activo/inactivo)

- **Vista detallada de hotel** con visualización intuitiva de:

  - Información general
  - Galería de imágenes
  - Tipos de habitaciones y disponibilidad
  - Precio por noche

- **Edición y actualización** de información de hoteles

- **Eliminación** de hoteles

### 3. Características Adicionales

- Diseño responsive para todas las pantallas
- Soporte para internacionalización
- Navegación intuitiva
- Interfaz de usuario moderna con componentes de HeroUI
- Implementación de patrones avanzados de React como Render Props
- Gestión de estados asíncronos con componentes reutilizables
- Autenticación y persistencia de sesión

## Tecnologías Utilizadas

- **Frontend**:

  - Next.js 14 (App Router)
  - React
  - TypeScript
  - TailwindCSS
  - HeroUI (componentes UI)

- **Autenticación y Base de Datos**:

  - Firebase (Authentication, Firestore)

- **Gestión de Estado**:

  - React Context API
  - React Query (TanStack Query)
  - Patrones avanzados (Render Props)

- **Despliegue**:
  - Vercel

## Estructura del Proyecto

```
src/
├── app/               # Rutas y páginas (Next.js App Router)
│   ├── [lang]/        # Soporte para internacionalización
│   │   ├── auth/      # Páginas de autenticación
│   │   ├── dashboard/ # Dashboard y gestión de hoteles
│   │   ├── hotels/    # Vistas públicas de hoteles
├── assets/           # Recursos estáticos (imágenes, iconos)
├── components/       # Componentes reutilizables
│   ├── auth/         # Componentes de autenticación
│   ├── common/       # Componentes comunes y patrones (AsyncStateRenderer, etc.)
│   ├── dashboard/    # Componentes del panel de administración
│   ├── hotels/       # Componentes relacionados con hoteles
│   ├── partials/     # Componentes parciales (header, footer)
│   ├── ui/           # Componentes UI reutilizables
├── config/           # Configuraciones (Firebase, etc.)
├── contexts/         # Contextos de React
├── hooks/            # Custom hooks
├── interface/        # Definiciones de tipos TypeScript
├── layouts/          # Componentes de layout
├── lib/              # Bibliotecas y utilidades específicas
├── services/         # Servicios y API calls
├── utils/            # Utilidades y funciones auxiliares
```

## Instalación y Ejecución

### Requisitos Previos

- Node.js 18.x o superior
- NPM o Yarn

### Pasos de Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/vaova-hotels-prueba.git
cd vaova-hotels-prueba
```

2. Instalar dependencias:

```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:

   - Crear un archivo `.env.local` basado en `.env.example`
   - Agregar las credenciales de Firebase

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación construida
- `npm run lint` - Ejecuta el linter para verificar el código

## Implementación de Requerimientos

### Autenticación

- Se implementó autenticación con email/contraseña y Google mediante Firebase
- La persistencia de sesión se maneja con session storage

### Gestión de Hoteles

- CRUD completo de hoteles con todos los campos requeridos
- Visualización detallada con galería de imágenes
- Gestión de tipos de habitaciones con disponibilidad

### Características Adicionales

- Diseño responsive para todas las pantallas
- Filtros en el listado de hoteles
- Internacionalización básica

## Contacto

Para más información, contacta con el equipo de desarrollo o visita [VAOVA](https://vaovatravel.com).
