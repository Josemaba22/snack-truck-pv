# Truck Food Street - Documentación del Proyecto

## Nombre del Ecosistema

**Truck Food Street** - Sistema multi-tenant para puestos de snacks móviles con ruedas.

## Primer Cliente

**Marquesitas** - Crepas enrolladas con dulce, frutas, semillas y demás toppings.

## Modelo de Negocio

- Puesto de snacks en parque
- Cliente pide lo que desea ordenar
- Se registra la orden en la app
- Consulta de órdenes
- Corte de caja al final del día
- Hardware: iPad con PWA
- Uso 100% offline mientras opera
- Sync a Supabase cuando hay red disponible

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 21 (standalone components + signals) |
| Storage Local | IndexedDB (usando librería `idb`) |
| Backend Cloud | Supabase (para sync y backup) |
| App Type | PWA (Progressive Web App) |

## Esquema MVP (6 tablas)

| Tabla | Propósito |
|-------|----------|
| **Products** | Catálogo de productos |
| **Categories** | Clasificación de productos |
| **ProductsAddons** | Extras/rellenos disponibles |
| **ProductDetails** | Tabla pivot (relación N:M entre Products y Addons) |
| **Orders** | Órdenes registradas |
| **OrderDetails** | Items de cada orden |

## Arquitectura Offline-First

```
┌─────────────────────────────────────┐
│ iPad (Local)                       │
├─────────────────────────────────────┤
│ IndexedDB ← LocalApiService        │
│ (funciona sin internet)            │
└─────────────────────────────────────┘
         ▲
         │ Sync (al hacer corte de caja)
         ▼
┌─────────────────────────────────────┐
│ Supabase (Cloud)                   │
│ (backup cuando hay red)            │
└─────────────────────────────────────┘
```

## Decisiones de Diseño

- **Soft deletes**: Sí, implementados en esquema
- **Precios**: Fijos por producto
- **Inventario**: Control básico
- **Multi-tenant**: Preparado para futura expansión
- **Sync**: Manual al hacer corte de caja (no automático)

## Siguientes Pasos (MVP)

1. Implementar LocalApiService con IndexedDB
2. Crear modelos TypeScript
3. Conectar UI con datos locales
4. Agregar feature de corte de caja
5. Later: Sync a Supabase