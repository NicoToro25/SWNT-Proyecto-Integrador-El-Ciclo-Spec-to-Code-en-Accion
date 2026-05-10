# SWNT-Proyecto-Integrador-El-Ciclo-Spec-to-Code-en-Accion

## Nicolás Toro Criollo

---

Bitácora de prompts

**Prompt:**

Actúa como un AI Software Architect especializado en React, TypeScript, Tailwind CSS y Supabase.

Necesito crear una especificación técnica en formato Markdown para un módulo llamado "EmissionsTracker" perteneciente a una plataforma SaaS de monitoreo de huella de carbono.

Objetivo:
Crear un documento Markdown que funcione como:
- especificación funcional,
- documentación técnica,
- guía de generación de código para IA.

Requisitos funcionales:
- Mostrar una lista de emisiones en tarjetas.
- Cada tarjeta debe mostrar:
  - nombre de la fuente
  - categoría
  - CO2 producido
- Debe existir un formulario para registrar nuevas emisiones.
- Los datos provienen de Supabase.
- La lógica debe manejarse mediante un custom hook llamado useEmissions.
- El frontend utilizará React + TypeScript + Tailwind CSS.

Necesito que el documento incluya:

# 1. Jerarquía de Componentes
Definir:
- layouts
- views/pages
- organismos
- moléculas
- átomos

# 2. Flujo de Datos
Explicar:
- qué componentes reciben props
- qué componentes manejan estado
- qué lógica vive en el custom hook

# 3. Sistema de Diseño
Definir:
- paleta de colores
- tipografía
- spacing
- estilos de botones/cards/forms
- tokens reutilizables

# 4. Contratos de Componentes
Para cada componente definir:
- propósito
- props
- tipos TypeScript
- props opcionales/requeridas

# 5. Arquitectura de Estado
Definir:
- loading
- error handling
- inserción de datos
- refresh de emisiones

# 6. Recomendaciones Técnicas
Incluye:
- accesibilidad
- performance
- responsive design
- buenas prácticas React

NO generes todavía el código React.
Solo genera la especificación Markdown completa.

**Respuesta:**

[emissions-specifications](docs/emissions-specification.md)

La especificación está lista. Aquí un resumen de lo que incluye cada sección:

**1. Jerarquía de Componentes** — Árbol completo con 5 capas (Layout → View → Organismos → Moléculas → Átomos), tabla descriptiva con la responsabilidad de cada capa, y 15 componentes identificados con nombres definitivos listos para usar en código.

**2. Flujo de Datos** — Diagrama ASCII del flujo Supabase → hook → componentes, tabla de qué componentes son "dumb" (solo props) vs. cuáles manejan estado, y las responsabilidades exactas del hook `useEmissions`.

**3. Sistema de Diseño** — Paleta de 14 tokens de color semánticos (verde sostenibilidad + neutros + estados), tipografía con 3 familias diferenciadas (display / body / mono para los valores CO2), escala de spacing, y estilos detallados de cards, 4 variantes de botones, inputs con estados de error, y badges por categoría con colores semánticos.

**4. Contratos de Componentes** — Los 15 componentes documentados con su interfaz TypeScript completa, distinguiendo props requeridas/opcionales, más los tipos base (`Emission`, `NewEmissionPayload`, `UseEmissionsReturn`).

**5. Arquitectura de Estado** — Ciclo de vida completo del estado (mount → fetch → insert → refresh), tabla de estado local por componente, 4 niveles de manejo de errores con respuesta específica para cada uno, y la estructura de tabla SQL esperada en Supabase con RLS.

**6. Recomendaciones Técnicas** — Accesibilidad WCAG AA, performance con `React.memo` y `useCallback`, grid responsive mobile-first, buenas prácticas de separación de responsabilidades, y estructura de carpetas lista para usar.

**Prompt:**

**Respuesta:**

**Prompt:**

**Respuesta:**

**Prompt:**

**Respuesta:**
