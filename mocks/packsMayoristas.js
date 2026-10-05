// Editá estos datos con tus packs reales antes de importar.
// Separados en dos arrays para poder subirlos por separado desde el admin.

export const packsPorMayorMock = [
  {
    name: "Pack Autos 50 unidades",
    cantidad: "x50 unidades",
    descripcionCorta: "Vinilo resistente, ideal para reventa",
    descripcionLarga:
      "Stickers troquelados de vinilo blanco mate, laminados con protección UV. Resistentes al agua, sol y lavado. Diseño a elección dentro del catálogo de autos y motos.",
    precio: "$18.000",
    precioDetalle: "$18.000 el pack de 50 (equivale a $360 por unidad)",
    img: "https://res.cloudinary.com/TU_CLOUD/image/upload/v1/pack-autos.png",
    tipo: "por-mayor",
    orden: 1,
  },
  {
    name: "Pack Mix a elección 100 unidades",
    cantidad: "x100 unidades",
    descripcionCorta: "Combiná diseños de todo el catálogo al mejor precio",
    descripcionLarga:
      "Armá tu propio mix combinando hasta 10 diseños distintos de todo el catálogo. El precio por unidad más bajo de todos los packs.",
    precio: "$32.000",
    precioDetalle: "$32.000 el pack de 100 (equivale a $320 por unidad)",
    img: "https://res.cloudinary.com/TU_CLOUD/image/upload/v1/pack-mix.png",
    tipo: "por-mayor",
    orden: 2,
  },
];

export const packsPlanchitasMock = [
  {
    name: "Pack Planchitas 10 unidades",
    cantidad: "x10 unidades",
    descripcionCorta: "Planchitas variadas, buen margen para reventa",
    descripcionLarga:
      "Planchitas de vinilo con distintos diseños, ideales para ferias y kioscos.",
    precio: "$8.000",
    precioDetalle: "$8.000 el pack de 10 (equivale a $800 por unidad)",
    img: "https://res.cloudinary.com/TU_CLOUD/image/upload/v1/pack-planchitas.png",
    tipo: "planchitas",
    orden: 1,
  },
];