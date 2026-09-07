# Gestock v2 — Frontend

React + TypeScript + Vite + Tailwind. Conecta directo con el backend de NestJS.

## Dirección de diseño

- **Fondo** azul-marino oscuro (`#0B1120`), tarjetas en `#131B2E`.
- **Acento de señal**: cian-teal (`#22D3B8`) — todo lo interactivo y las gráficas.
- **Alertas**: ámbar para stock bajo, coral solo para lo crítico.
- **Tipografía**: Space Grotesk (títulos), Inter (texto), JetBrains Mono (números, SKUs).
- **Elemento de firma**: el pulso de radar (`.radar-pulse` en `index.css`) — aparece
  en el panel de login y se reutiliza más adelante en las alertas de riesgo del dashboard.

## Arquitectura

```
src/
  lib/api.ts              Cliente axios + manejo de errores del backend
  context/AuthContext.tsx Sesion: login, registro, logout, valida token contra /auth/me
  routes/ProtectedRoute.tsx  Guarda rutas por sesion y por rol
  components/ui/          Button, Input, Card, Alert (design system base)
  components/layout/      AuthLayout (pantallas de login/registro), DashboardShell (header + perfil)
  pages/auth/              Login, Register, ForgotPassword, ResetPassword
  pages/dashboard/         AdminDashboard, UserDashboard (placeholders, siguiente etapa)
```

## Poner a correr el proyecto

1. `npm install`
2. Copia `.env.example` a `.env` — por defecto apunta a `http://localhost:3000` (el backend).
3. Asegúrate de que el backend esté corriendo.
4. `npm run dev` — abre en `http://localhost:5173`.

## Flujo que ya puedes probar de punta a punta

1. Regístrate en `/register` → entra automáticamente como Empleado.
2. Inicia sesión en `/login`.
3. Un usuario ADMIN o MANAGER (los del seed del backend) cae en `/admin`;
   un EMPLOYEE cae en `/dashboard`. Cada ruta está protegida por rol.
4. Prueba `/forgot-password` → revisa el correo (o Mailtrap) → usa el link
   con el token para `/reset-password`.

## Siguientes pasos

1. Reemplazar los placeholders de `AdminDashboard` y `UserDashboard` con:
   tarjetas de resumen (`GET /forecasting/dashboard`), tabla de productos
   con `PATCH`/`DELETE`, y gráfica de consumo con Recharts.
2. Pantalla de gestión de usuarios (solo ADMIN) usando los endpoints de roles.
3. Pantalla de movimientos (registrar entradas/salidas).
