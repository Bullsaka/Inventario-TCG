REEMPLAZO COMPLETO - POSTGRES + RECUPERACIÓN DE CONTRASEÑA

Este ZIP incluye:
- src completo
- prisma/schema.prisma con PasswordResetToken
- prisma.config.ts
- package.json actualizado
- next.config.ts
- .env.example

Flujo agregado:
- /forgot-password
- /reset-password/[token]
- envío de enlace por email usando Resend
- fallback a consola si RESEND_API_KEY o RESEND_FROM_EMAIL no están configurados

Variables nuevas:
- APP_URL
- RESEND_API_KEY
- RESEND_FROM_EMAIL

Después de reemplazar:
1) Borra package-lock.json y node_modules si existen.
2) Configura tu .env real.
3) Ejecuta:

   & "C:\Program Files\nodejs\npm.cmd" install
   & "C:\Program Files\nodejs\npx.cmd" prisma generate
   & "C:\Program Files\nodejs\npx.cmd" prisma db push
   & "C:\Program Files\nodejs\npm.cmd" run dev

Notas:
- Si no configuras Resend, el link de recuperación se imprimirá en la consola del servidor.
- Si ya tenías la app corriendo, reinicia el servidor después del reemplazo.
- Mantén borrados los archivos viejos acordados:
  src/actions.ts
  src/page.tsx
  src/db.ts
  src/calculations.ts
  src/src/
