# EmissionsTracker — Especificación Técnica

> **Plataforma:** SaaS de Monitoreo de Huella de Carbono  
> **Módulo:** `EmissionsTracker`  
> **Stack:** React · TypeScript · Tailwind CSS · Supabase  
> **Versión del documento:** 1.0.0  
> **Estado:** Borrador — Listo para generación de código

---

## Tabla de Contenido

1. [Jerarquía de Componentes](#1-jerarquía-de-componentes)
2. [Flujo de Datos](#2-flujo-de-datos)
3. [Sistema de Diseño](#3-sistema-de-diseño)
4. [Contratos de Componentes](#4-contratos-de-componentes)
5. [Arquitectura de Estado](#5-arquitectura-de-estado)
6. [Recomendaciones Técnicas](#6-recomendaciones-técnicas)

---

## 1. Jerarquía de Componentes

El módulo sigue **Atomic Design** adaptado a la arquitectura de una SaaS con Supabase como backend.

```
EmissionsTrackerLayout (Layout)
└── EmissionsTrackerPage (View / Page)
    ├── EmissionsHeader (Organismo)
    │   ├── PageTitle (Átomo)
    │   └── AddEmissionButton (Átomo)
    ├── EmissionsFormPanel (Organismo)
    │   ├── EmissionForm (Molécula)
    │   │   ├── InputField (Átomo)
    │   │   ├── SelectField (Átomo)
    │   │   ├── NumberInput (Átomo)
    │   │   └── SubmitButton (Átomo)
    │   └── FormFeedback (Átomo)
    ├── EmissionsGrid (Organismo)
    │   ├── EmissionCard (Molécula)  ×N
    │   │   ├── CategoryBadge (Átomo)
    │   │   ├── SourceLabel (Átomo)
    │   │   └── CO2Display (Átomo)
    │   ├── EmissionsSkeletonGrid (Molécula) — estado loading
    │   └── EmptyState (Molécula) — lista vacía
    └── ErrorBanner (Átomo)
```

### Descripción por capa

| Capa | Componente(s) | Responsabilidad |
|---|---|---|
| **Layout** | `EmissionsTrackerLayout` | Estructura de página: sidebar, padding global, breakpoints |
| **View / Page** | `EmissionsTrackerPage` | Orquesta el módulo, instancia `useEmissions`, distribuye estado |
| **Organismos** | `EmissionsHeader`, `EmissionsFormPanel`, `EmissionsGrid` | Secciones funcionales completas, componen moléculas |
| **Moléculas** | `EmissionForm`, `EmissionCard`, `EmissionsSkeletonGrid`, `EmptyState` | Unidades de UI con lógica de presentación propia |
| **Átomos** | `InputField`, `SelectField`, `NumberInput`, `SubmitButton`, `CategoryBadge`, `SourceLabel`, `CO2Display`, `PageTitle`, `AddEmissionButton`, `FormFeedback`, `ErrorBanner` | Elementos base, sin estado propio, 100 % controlados por props |

---

## 2. Flujo de Datos

### Diagrama de flujo

```
Supabase (tabla: emissions)
        │
        ▼
  useEmissions (custom hook)
  ├── emissions[]      ──────────────────► EmissionsGrid
  ├── isLoading        ──────────────────► EmissionsGrid / EmissionsSkeletonGrid
  ├── error            ──────────────────► ErrorBanner
  ├── addEmission()    ◄─────────────────  EmissionForm (onSubmit)
  └── refreshEmissions() ◄───────────────  AddEmissionButton (manual refresh)
        │
        ▼
  EmissionsTrackerPage (nodo central de estado)
  ├── Pasa props a EmissionsHeader
  ├── Pasa props a EmissionsFormPanel
  └── Pasa props a EmissionsGrid
```

### Reglas de distribución de estado

| Componente | Recibe props | Maneja estado local | Fuente de verdad |
|---|---|---|---|
| `EmissionsTrackerPage` | — | `isFormOpen: boolean` | `useEmissions` |
| `EmissionsGrid` | `emissions[]`, `isLoading`, `error` | — | props |
| `EmissionCard` | `emission: Emission` | — | props |
| `EmissionForm` | `onSubmit`, `isSubmitting` | `formValues` (controlled inputs) | estado local + callback |
| `EmissionsHeader` | `onAddClick`, `onRefresh` | — | props / callbacks |
| `ErrorBanner` | `message: string` | — | props |
| `CategoryBadge` | `category: EmissionCategory` | — | props |
| `CO2Display` | `value: number`, `unit: string` | — | props |

### Responsabilidades del custom hook `useEmissions`

```
useEmissions()
├── FETCH:   obtiene registros de Supabase al montar (useEffect)
├── INSERT:  addEmission(payload) → POST a Supabase → refresca lista
├── REFRESH: refreshEmissions() → re-fetch manual
├── ESTADO:  emissions[], isLoading, isSubmitting, error
└── LIMPIEZA: cancelación de subscripciones en cleanup
```

> **Regla:** Ningún componente de UI llama directamente a Supabase. Toda comunicación con la base de datos pasa por `useEmissions`.

---

## 3. Sistema de Diseño

### 3.1 Paleta de Colores

```css
/* Tokens de color — definir en tailwind.config.ts */

/* Verdes primarios (identidad de sostenibilidad) */
--color-brand-900: #064E3B;   /* texto sobre fondos claros */
--color-brand-700: #047857;   /* botones primarios */
--color-brand-500: #10B981;   /* acentos, badges activos */
--color-brand-100: #D1FAE5;   /* fondos de cards, badges suaves */

/* Neutros */
--color-neutral-900: #111827;  /* texto principal */
--color-neutral-600: #4B5563;  /* texto secundario */
--color-neutral-300: #D1D5DB;  /* bordes, separadores */
--color-neutral-100: #F3F4F6;  /* fondos de página */
--color-neutral-0:   #FFFFFF;  /* superficie de cards */

/* Semánticos */
--color-error-600:   #DC2626;  /* error states */
--color-error-100:   #FEE2E2;  /* error background */
--color-warning-500: #F59E0B;  /* alertas */
--color-success-600: #16A34A;  /* confirmaciones */
```

### 3.2 Tipografía

```css
/* Escala tipográfica */
--font-display: 'Plus Jakarta Sans', sans-serif;  /* headings */
--font-body:    'Inter', sans-serif;              /* body, labels, inputs */
--font-mono:    'JetBrains Mono', monospace;      /* valores CO2 numéricos */

/* Tamaños (equivalentes Tailwind) */
/* text-2xl  → 1.5rem  → Page title */
/* text-xl   → 1.25rem → Section title */
/* text-base → 1rem    → Body, labels */
/* text-sm   → 0.875rem→ Metadata, badges */
/* text-xs   → 0.75rem → Captions, helpers */

/* Pesos */
/* font-bold   → 700 → Títulos principales */
/* font-medium → 500 → Labels de form, subtítulos */
/* font-normal → 400 → Body text */
```

### 3.3 Espaciado

El sistema usa la escala de espaciado de Tailwind (múltiplos de 4 px):

```
spacing-1  →  4px   (gap mínimo entre elementos inline)
spacing-2  →  8px   (padding interno de badges/chips)
spacing-3  →  12px  (gap entre ícono y texto en atoms)
spacing-4  →  16px  (padding de inputs, gap de form fields)
spacing-6  →  24px  (padding de cards)
spacing-8  →  32px  (gap entre cards en grid)
spacing-12 →  48px  (separación entre secciones del layout)
spacing-16 →  64px  (padding lateral de página en desktop)
```

### 3.4 Tokens de componentes reutilizables

#### Cards

```
Superficie:       bg-white
Borde:            border border-neutral-200
Radio:            rounded-2xl
Sombra:           shadow-sm hover:shadow-md (transición 150ms)
Padding interno:  p-6
Gap interno:      space-y-3
```

#### Botones

| Variante | Clases base |
|---|---|
| **Primary** | `bg-brand-700 text-white hover:bg-brand-900 font-medium px-5 py-2.5 rounded-xl transition-colors` |
| **Secondary** | `bg-brand-100 text-brand-700 hover:bg-brand-200 font-medium px-5 py-2.5 rounded-xl transition-colors` |
| **Ghost** | `text-neutral-600 hover:bg-neutral-100 px-4 py-2 rounded-lg transition-colors` |
| **Danger** | `bg-error-600 text-white hover:bg-red-700 font-medium px-5 py-2.5 rounded-xl transition-colors` |
| **Disabled** | `opacity-50 cursor-not-allowed pointer-events-none` (aplica sobre cualquier variante) |

#### Inputs / Formularios

```
Input base:       border border-neutral-300 rounded-xl px-4 py-2.5 text-base
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  placeholder:text-neutral-400
Error state:      border-error-600 focus:ring-error-600
Label:            text-sm font-medium text-neutral-700 mb-1.5
Helper text:      text-xs text-neutral-500 mt-1
Error message:    text-xs text-error-600 mt-1
```

#### Badges / CategoryBadge

```
Base:             text-xs font-medium px-2.5 py-1 rounded-full
Energía:          bg-amber-100 text-amber-700
Transporte:       bg-blue-100 text-blue-700
Manufactura:      bg-purple-100 text-purple-700
Agricultura:      bg-green-100 text-green-700
Residuos:         bg-gray-100 text-gray-600
Otro:             bg-neutral-100 text-neutral-600
```

#### Grid de Cards

```
Mobile (< 640px):   grid-cols-1
Tablet (640–1024px): grid-cols-2
Desktop (> 1024px): grid-cols-3
Gap:                gap-6
```

---

## 4. Contratos de Componentes

### Tipos TypeScript base

```typescript
// types/emissions.ts

export type EmissionCategory =
  | 'energia'
  | 'transporte'
  | 'manufactura'
  | 'agricultura'
  | 'residuos'
  | 'otro';

export interface Emission {
  id: string;
  source_name: string;           // nombre de la fuente
  category: EmissionCategory;    // categoría
  co2_kg: number;                // CO2 producido en kg
  recorded_at: string;           // ISO timestamp
  created_by?: string;           // user_id (opcional, de auth)
  notes?: string;                // notas opcionales
}

export interface NewEmissionPayload {
  source_name: string;
  category: EmissionCategory;
  co2_kg: number;
  notes?: string;
}

export interface UseEmissionsReturn {
  emissions: Emission[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  addEmission: (payload: NewEmissionPayload) => Promise<void>;
  refreshEmissions: () => Promise<void>;
}
```

---

### 4.1 `useEmissions` (Custom Hook)

| Campo | Tipo | Descripción |
|---|---|---|
| **Retorna** | `UseEmissionsReturn` | Ver tipo arriba |
| **Parámetros** | — | Sin parámetros de entrada |
| **Efectos secundarios** | Supabase fetch | Al montar y tras cada `addEmission` |

---

### 4.2 `EmissionsTrackerPage`

- **Propósito:** View principal. Instancia `useEmissions`. Gestiona `isFormOpen`.
- **Props:** ninguna (es una page/route)
- **Estado local:** `isFormOpen: boolean`
- **Renderiza:** `EmissionsHeader`, `EmissionsFormPanel`, `EmissionsGrid`, `ErrorBanner`

---

### 4.3 `EmissionsHeader`

- **Propósito:** Encabezado de sección con título y acciones.

```typescript
interface EmissionsHeaderProps {
  onAddClick: () => void;         // requerida — abre el formulario
  onRefresh: () => void;          // requerida — refresca datos
  isRefreshing?: boolean;         // opcional — deshabilita botón durante fetch
}
```

---

### 4.4 `EmissionsFormPanel`

- **Propósito:** Contenedor del formulario. Controla visibilidad y animación del panel.

```typescript
interface EmissionsFormPanelProps {
  isOpen: boolean;                // requerida
  onClose: () => void;            // requerida
  onSubmit: (payload: NewEmissionPayload) => Promise<void>;  // requerida
  isSubmitting: boolean;          // requerida
}
```

---

### 4.5 `EmissionForm`

- **Propósito:** Formulario controlado para registrar una emisión.

```typescript
interface EmissionFormProps {
  onSubmit: (payload: NewEmissionPayload) => Promise<void>;  // requerida
  isSubmitting: boolean;          // requerida
  onCancel?: () => void;          // opcional
}

// Estado local interno del componente:
// formValues: NewEmissionPayload
// fieldErrors: Partial<Record<keyof NewEmissionPayload, string>>
```

**Validaciones requeridas:**
- `source_name`: no vacío, máx. 100 caracteres
- `category`: debe ser un valor de `EmissionCategory`
- `co2_kg`: número positivo, mayor que 0, máx. 999.999

---

### 4.6 `EmissionsGrid`

- **Propósito:** Renderiza la grilla de tarjetas, skeleton o estado vacío.

```typescript
interface EmissionsGridProps {
  emissions: Emission[];          // requerida
  isLoading: boolean;             // requerida
}
```

**Lógica de renderizado:**
```
isLoading === true  → <EmissionsSkeletonGrid />
emissions.length === 0 → <EmptyState />
else                → emissions.map(<EmissionCard />)
```

---

### 4.7 `EmissionCard`

- **Propósito:** Tarjeta que muestra los datos de una emisión individual.

```typescript
interface EmissionCardProps {
  emission: Emission;             // requerida
}
```

**Contenido visual:**
1. `CategoryBadge` → `emission.category`
2. `SourceLabel` → `emission.source_name`
3. `CO2Display` → `emission.co2_kg`
4. Fecha formateada → `emission.recorded_at`

---

### 4.8 `CategoryBadge`

```typescript
interface CategoryBadgeProps {
  category: EmissionCategory;     // requerida
  size?: 'sm' | 'md';            // opcional, default: 'md'
}
```

---

### 4.9 `CO2Display`

```typescript
interface CO2DisplayProps {
  value: number;                  // requerida — valor en kg
  unit?: 'kg' | 'ton';           // opcional, default: 'kg'
  className?: string;             // opcional — extensión de estilos
}
```

**Nota:** Si `unit === 'ton'`, convertir internamente: `value / 1000`.

---

### 4.10 `InputField`

```typescript
interface InputFieldProps {
  id: string;                     // requerida
  label: string;                  // requerida
  value: string;                  // requerida
  onChange: (value: string) => void;  // requerida
  placeholder?: string;           // opcional
  error?: string;                 // opcional — mensaje de error
  disabled?: boolean;             // opcional, default: false
  required?: boolean;             // opcional, default: false
  maxLength?: number;             // opcional
}
```

---

### 4.11 `SelectField`

```typescript
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;                     // requerida
  label: string;                  // requerida
  value: string;                  // requerida
  options: SelectOption[];        // requerida
  onChange: (value: string) => void;  // requerida
  placeholder?: string;           // opcional
  error?: string;                 // opcional
  disabled?: boolean;             // opcional, default: false
  required?: boolean;             // opcional, default: false
}
```

---

### 4.12 `NumberInput`

```typescript
interface NumberInputProps {
  id: string;                     // requerida
  label: string;                  // requerida
  value: number | '';             // requerida — '' para campo vacío
  onChange: (value: number | '') => void;  // requerida
  min?: number;                   // opcional, default: 0
  max?: number;                   // opcional
  step?: number;                  // opcional, default: 0.01
  unit?: string;                  // opcional — se muestra como suffix (ej. "kg")
  error?: string;                 // opcional
  disabled?: boolean;             // opcional, default: false
  required?: boolean;             // opcional, default: false
}
```

---

### 4.13 `ErrorBanner`

```typescript
interface ErrorBannerProps {
  message: string;                // requerida
  onDismiss?: () => void;         // opcional — muestra botón de cierre
}
```

---

### 4.14 `EmissionsSkeletonGrid`

- **Propósito:** Placeholder animado durante la carga.
- **Props:** `count?: number` (opcional, default: `6`) — número de skeletons a renderizar.

---

### 4.15 `EmptyState`

```typescript
interface EmptyStateProps {
  onAddClick?: () => void;        // opcional — CTA para crear primera emisión
}
```

---

## 5. Arquitectura de Estado

### 5.1 Estado global del módulo (en `useEmissions`)

```typescript
// Estado interno del hook
interface EmissionsState {
  emissions: Emission[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}
```

### 5.2 Ciclo de vida del estado

```
MOUNT
  └─► isLoading = true
      └─► fetchEmissions()
          ├─► [éxito] emissions = data, isLoading = false, error = null
          └─► [error] error = message, isLoading = false

ADD EMISSION
  └─► isSubmitting = true
      └─► supabase.insert(payload)
          ├─► [éxito] isSubmitting = false → fetchEmissions()
          └─► [error] isSubmitting = false, error = message

REFRESH MANUAL
  └─► isLoading = true → fetchEmissions()

DISMISS ERROR
  └─► error = null
```

### 5.3 Estado local de componentes

| Componente | Estado local | Descripción |
|---|---|---|
| `EmissionsTrackerPage` | `isFormOpen: boolean` | Controla visibilidad del panel de formulario |
| `EmissionForm` | `formValues: NewEmissionPayload` | Valores controlados de inputs |
| `EmissionForm` | `fieldErrors: Partial<Record<...>>` | Errores de validación por campo |
| `EmissionForm` | `isDirty: boolean` | ¿Se ha tocado el formulario? (para mostrar errores) |

### 5.4 Manejo de errores — niveles

```
Nivel 1 → Validación de formulario (cliente)
  Respuesta: fieldErrors en EmissionForm, nunca llega a Supabase

Nivel 2 → Error de red / Supabase (insert)
  Respuesta: error en useEmissions → ErrorBanner visible
  El formulario permanece abierto para reintentar

Nivel 3 → Error de fetch al cargar lista
  Respuesta: error en useEmissions → ErrorBanner + EmptyState
  Botón de retry dispara refreshEmissions()

Nivel 4 → Error de autenticación (401/403)
  Respuesta: redirigir al login (manejo en middleware de Supabase)
```

### 5.5 Supabase — Estructura de tabla esperada

```sql
-- Tabla: emissions
CREATE TABLE emissions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name  TEXT NOT NULL,
  category     TEXT NOT NULL CHECK (category IN (
                  'energia','transporte','manufactura',
                  'agricultura','residuos','otro')),
  co2_kg       NUMERIC(10, 3) NOT NULL CHECK (co2_kg > 0),
  notes        TEXT,
  recorded_at  TIMESTAMPTZ DEFAULT NOW(),
  created_by   UUID REFERENCES auth.users(id)
);

-- RLS recomendado:
-- Los usuarios solo ven sus propias emisiones
ALTER TABLE emissions ENABLE ROW LEVEL SECURITY;
```

### 5.6 Queries de Supabase en `useEmissions`

```typescript
// FETCH
const { data, error } = await supabase
  .from('emissions')
  .select('*')
  .order('recorded_at', { ascending: false });

// INSERT
const { error } = await supabase
  .from('emissions')
  .insert([{ ...payload, created_by: user.id }]);
```

---

## 6. Recomendaciones Técnicas

### 6.1 Accesibilidad (a11y)

- **Formularios:** Cada `<input>` y `<select>` debe tener un `<label>` asociado mediante `htmlFor` + `id`. No usar `placeholder` como único label.
- **Errores:** Los mensajes de error deben estar vinculados al input con `aria-describedby`. El campo inválido debe tener `aria-invalid="true"`.
- **Botones de icono:** Deben incluir `aria-label` descriptivo (ej. botón de refresh: `aria-label="Actualizar emisiones"`).
- **Loading states:** El skeleton grid debe tener `aria-busy="true"` y `aria-label="Cargando emisiones"`.
- **Contraste:** Verificar ratio mínimo WCAG AA (4.5:1) para todos los colores de texto sobre sus fondos.
- **Focus management:** Al abrir el `EmissionsFormPanel`, el foco debe moverse al primer campo del formulario. Al cerrar, regresar al botón que lo abrió.
- **Teclado:** El formulario debe poder enviarse con `Enter`. El panel debe cerrarse con `Escape`.

### 6.2 Performance

- **Memoización:** Usar `React.memo` en `EmissionCard` para evitar re-renders cuando el array padre no cambia su referencia.
- **Callbacks estables:** `addEmission` y `refreshEmissions` deben estar envueltos en `useCallback` dentro del hook.
- **Evitar over-fetching:** No hacer fetch en cada render. El hook solo ejecuta el fetch en mount y tras un insert exitoso.
- **Skeleton first:** Mostrar `EmissionsSkeletonGrid` inmediatamente mientras llegan los datos. Nunca mostrar un spinner de página completa.
- **Lazy del panel:** `EmissionsFormPanel` puede usar `React.lazy` + `Suspense` si el formulario tiene dependencias pesadas.
- **Supabase connection:** Reutilizar el cliente de Supabase como singleton. Exportarlo desde `lib/supabase.ts`, nunca crear instancias múltiples.

### 6.3 Responsive Design

- **Mobile-first:** Construir estilos base para mobile, extender con `sm:`, `md:`, `lg:`.
- **Grid adaptativo:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` en `EmissionsGrid`.
- **Panel lateral en desktop:** En pantallas `lg+`, `EmissionsFormPanel` puede renderizarse como sidebar deslizante (`translate-x`). En mobile, como bottom sheet o modal.
- **Touch targets:** Botones y controles interactivos mínimo de 44×44 px en mobile (`min-h-[44px] min-w-[44px]`).
- **Typography scaling:** Considerar `text-sm` en mobile para labels, `text-base` en desktop.

### 6.4 Buenas prácticas React

- **Separación de responsabilidades:** La lógica de negocio y comunicación con Supabase vive **únicamente** en `useEmissions`. Los componentes son presentacionales.
- **Tipado estricto:** Habilitar `strict: true` en `tsconfig.json`. Evitar `any`. Usar `unknown` en bloques `catch` y narrowing explícito.
- **Nombres de archivos:** Usar PascalCase para componentes (`EmissionCard.tsx`), camelCase para hooks (`useEmissions.ts`) y tipos (`emissions.ts`).
- **Barrel exports:** Exportar componentes desde `index.ts` por carpeta para imports limpios.
- **No prop drilling excesivo:** Si el árbol de componentes crece, considerar React Context para distribuir `addEmission` y `error` sin pasar por cada nivel.
- **Validación en cliente:** Validar el formulario antes de llamar `addEmission`. El hook no debe asumir que el payload es válido.
- **Optimistic UI (futuro):** Para v2, considerar actualizar `emissions[]` de forma optimista al insertar, revirtiendo si Supabase retorna error.
- **Testing:** Cada átomo y molécula debe ser testeable de forma aislada con React Testing Library. El hook `useEmissions` debe testearse con `renderHook` y mocks de Supabase.

### 6.5 Estructura de carpetas recomendada

```
src/
├── components/
│   └── emissions/
│       ├── atoms/
│       │   ├── CategoryBadge.tsx
│       │   ├── CO2Display.tsx
│       │   ├── InputField.tsx
│       │   ├── SelectField.tsx
│       │   ├── NumberInput.tsx
│       │   ├── ErrorBanner.tsx
│       │   └── index.ts
│       ├── molecules/
│       │   ├── EmissionCard.tsx
│       │   ├── EmissionForm.tsx
│       │   ├── EmissionsSkeletonGrid.tsx
│       │   ├── EmptyState.tsx
│       │   └── index.ts
│       ├── organisms/
│       │   ├── EmissionsHeader.tsx
│       │   ├── EmissionsFormPanel.tsx
│       │   ├── EmissionsGrid.tsx
│       │   └── index.ts
│       └── index.ts
├── hooks/
│   └── useEmissions.ts
├── lib/
│   └── supabase.ts
├── pages/ (o app/ si App Router)
│   └── EmissionsTrackerPage.tsx
└── types/
    └── emissions.ts
```

---

## Checklist de implementación

- [ ] Definir tipos en `types/emissions.ts`
- [ ] Crear cliente Supabase en `lib/supabase.ts`
- [ ] Implementar `useEmissions` con fetch, insert y error handling
- [ ] Crear átomos: inputs, badge, CO2Display, ErrorBanner
- [ ] Crear moléculas: EmissionCard, EmissionForm, Skeleton, EmptyState
- [ ] Crear organismos: Header, FormPanel, Grid
- [ ] Crear `EmissionsTrackerPage` como orquestador
- [ ] Aplicar tokens de diseño via Tailwind config
- [ ] Verificar accesibilidad (labels, aria-*, focus)
- [ ] Pruebas responsive en mobile/tablet/desktop
- [ ] Tests unitarios de átomos y hook

---

*Documento generado como guía de referencia para generación de código. Versión 1.0.0.*
