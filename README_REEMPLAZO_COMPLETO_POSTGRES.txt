REEMPLAZO COMPLETO - POSTGRES + NEON

Este ZIP incluye:
- src completo
- prisma/schema.prisma corregido para PostgreSQL
- prisma.config.ts corregido
- package.json corregido para @prisma/adapter-pg y pg
- next.config.ts con allowedDevOrigins para 192.168.1.5
- .env.example

NO incluye:
- node_modules
- package-lock.json
- middleware.ts
- archivos viejos acordados para eliminar

Después de reemplazar:
1) Borra package-lock.json y node_modules si existen.
2) Configura tu .env real con DATABASE_URL y AUTH_SECRET.
3) Ejecuta:

   & "C:\Program Files\nodejs\npm.cmd" install
   & "C:\Program Files\nodejs\npx.cmd" prisma generate
   & "C:\Program Files\nodejs\npx.cmd" prisma db push
   & "C:\Program Files\nodejs\npm.cmd" run dev

También conviene borrar si aún existen:
- src/actions.ts
- src/page.tsx
- src/db.ts
- src/calculations.ts
- src/src/
- auth.ts (en la raíz)
