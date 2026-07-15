# FlowCanvas

SaaS de gestión de flujos de trabajo tipo Kanban para pymes.
Stack: React + Vite + Supabase (PostgreSQL + Auth)

## Pasos para arrancar

### 1. Crear proyecto en Supabase
Entra a https://supabase.com → New project.
En el dashboard del proyecto ve a **Settings → API** y copia:
- `Project URL`  → `VITE_SUPABASE_URL`
- `anon public`  → `VITE_SUPABASE_ANON_KEY`

### 2. Ejecutar el schema
Ve a **SQL Editor → New query**, pega el contenido de `schema.sql` y ejecuta.

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus credenciales de Supabase
```

### 4. Instalar dependencias y correr
```bash
npm install
npm run dev
```

### 5. Crear tu primera cuenta
Abre http://localhost:5173 → clic en "Crear cuenta".

> **Nota:** Supabase tiene confirmación de email activada por defecto.
> Para desactivarla en desarrollo: Authentication → Settings → desactiva "Enable email confirmations".

## Estructura del proyecto
```
src/
  components/    # Badge, KanbanBoard, Modal, Sidebar, StatCard, Toast, Topbar...
  hooks/         # useToast
  lib/           # supabase.js (cliente)
  pages/         # Login, Dashboard, Trabajos, TrabajoDetalle, Configuracion, Clientes
  App.jsx
  index.css
schema.sql       # Script SQL completo para Supabase
.env.example     # Variables de entorno requeridas
```
