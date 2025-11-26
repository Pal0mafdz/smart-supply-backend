export interface SupplierRecommendation {
  supplierName: string;
  website?: string;
  notes?: string;
  relativePriceComment?: string; // "barato" | "medio" | "caro"
}

// --- TUS PROVEEDORES CON PRODUCTOS Y PRECIOS ---

type SupplierProduct = {
  codeNum: string;
  name: string;
  unit: string;       // "KG", "G", "L", "PZA", etc.
  unitprice: number;  // precio por paquete
  packageSize: number; // cuántas unidades trae el paquete (kg, g, L, etc.)
};

type SupplierEntry = {
  _id: string;
  supplierName: string;
  leadTimeDays: number;
  minOrderValue: number;
  products: SupplierProduct[];
};

const SUPPLIERS: SupplierEntry[] = [
  {
    _id: "sup_abastoslaguna",
    supplierName: "Abastos Laguna",
    leadTimeDays: 2,
    minOrderValue: 500,
    products: [
      { codeNum: "P001", name: "Huevo blanco (30 pzas)", unit: "PZA", unitprice: 47, packageSize: 30 },
      { codeNum: "P002", name: "Leche entera 1L", unit: "L", unitprice: 22, packageSize: 1 },
      { codeNum: "P003", name: "Mantequilla 90g", unit: "G", unitprice: 26, packageSize: 90 },
      { codeNum: "P004", name: "Harina de trigo 1kg", unit: "KG", unitprice: 20, packageSize: 1 },
      { codeNum: "P005", name: "Azúcar 1kg", unit: "KG", unitprice: 26, packageSize: 1 },
      { codeNum: "P006", name: "Sal fina 1kg", unit: "KG", unitprice: 11, packageSize: 1 },
      { codeNum: "P007", name: "Aceite vegetal 1L", unit: "L", unitprice: 36, packageSize: 1 }
    ]
  },

  {
    _id: "sup_proveest",
    supplierName: "ProveeST Foodservice",
    leadTimeDays: 3,
    minOrderValue: 500,
    products: [
      { codeNum: "P008", name: "Aceite de oliva 1L", unit: "L", unitprice: 128, packageSize: 1 },
      { codeNum: "P009", name: "Pechuga de pollo", unit: "KG", unitprice: 115, packageSize: 1 },
      { codeNum: "P010", name: "Arrachera marinada", unit: "KG", unitprice: 210, packageSize: 1 },
      { codeNum: "P011", name: "Tocino", unit: "KG", unitprice: 150, packageSize: 1 },
      { codeNum: "P012", name: "Jamón de pierna", unit: "KG", unitprice: 84, packageSize: 1 },
      { codeNum: "P021", name: "Queso manchego", unit: "KG", unitprice: 138, packageSize: 1 },
      { codeNum: "P022", name: "Queso mozzarella", unit: "KG", unitprice: 152, packageSize: 1 }
    ]
  },
  {
    _id: "sup_greenmarket",
    supplierName: "GreenMarket Mayorista",
    leadTimeDays: 1,
    minOrderValue: 450,
    products: [
      { codeNum: "P013", name: "Tomate saladet", unit: "KG", unitprice: 29, packageSize: 1 },
      { codeNum: "P014", name: "Cebolla blanca", unit: "KG", unitprice: 15, packageSize: 1 },
      { codeNum: "P015", name: "Papa blanca", unit: "KG", unitprice: 23, packageSize: 1 },
      { codeNum: "P016", name: "Aguacate hass", unit: "KG", unitprice: 62, packageSize: 1 },
      { codeNum: "P017", name: "Limón", unit: "KG", unitprice: 39, packageSize: 1 },
      { codeNum: "P018", name: "Manzana roja", unit: "KG", unitprice: 42, packageSize: 1 },
      { codeNum: "P019", name: "Plátano", unit: "KG", unitprice: 22, packageSize: 1 },
      { codeNum: "P020", name: "Fresa", unit: "KG", unitprice: 71, packageSize: 1 }
    ]
  },
  {
    _id: "sup_gourmetplus",
    supplierName: "GourmetPlus Distribuciones",
    leadTimeDays: 2,
    minOrderValue: 900,
    products: [
      { codeNum: "P021", name: "Queso manchego", unit: "KG", unitprice: 142, packageSize: 1 },
      { codeNum: "P022", name: "Queso mozzarella", unit: "KG", unitprice: 158, packageSize: 1 },
      { codeNum: "P023", name: "Crema ácida 500g", unit: "G", unitprice: 44, packageSize: 500 },
      { codeNum: "P024", name: "Mantequilla 90g", unit: "G", unitprice: 29, packageSize: 90 }
    ]
  },
  {
    _id: "sup_superselecto",
    supplierName: "SuperSelecto Distribuidora",
    leadTimeDays: 1,
    minOrderValue: 400,
    products: [
      { codeNum: "P001", name: "Huevo blanco (30 pzas)", unit: "PZA", unitprice: 49, packageSize: 30 },
      { codeNum: "P002", name: "Leche entera 1L", unit: "L", unitprice: 21, packageSize: 1 },
      { codeNum: "P003", name: "Mantequilla 90g", unit: "G", unitprice: 25, packageSize: 90 },
      { codeNum: "P004", name: "Harina de trigo 1kg", unit: "KG", unitprice: 19, packageSize: 1 },
      { codeNum: "P005", name: "Azúcar 1kg", unit: "KG", unitprice: 25, packageSize: 1 },
      { codeNum: "P006", name: "Sal fina 1kg", unit: "KG", unitprice: 10, packageSize: 1 },
      { codeNum: "P007", name: "Aceite vegetal 1L", unit: "L", unitprice: 35, packageSize: 1 },
      { codeNum: "P025", name: "Orégano seco 25g", unit: "G", unitprice: 12, packageSize: 25 },
      { codeNum: "P026", name: "Chocolate amargo 500g", unit: "G", unitprice: 68, packageSize: 500 }
    ]
  },
  {
    _id: "sup_maximatienda",
    supplierName: "MaximaTienda Mayorista",
    leadTimeDays: 2,
    minOrderValue: 550,
    products: [
      { codeNum: "P008", name: "Aceite de oliva 1L", unit: "L", unitprice: 132, packageSize: 1 },
      { codeNum: "P009", name: "Pechuga de pollo", unit: "KG", unitprice: 118, packageSize: 1 },
      { codeNum: "P010", name: "Arrachera marinada", unit: "KG", unitprice: 215, packageSize: 1 },
      { codeNum: "P011", name: "Tocino", unit: "KG", unitprice: 154, packageSize: 1 },
      { codeNum: "P012", name: "Jamón de pierna", unit: "KG", unitprice: 82, packageSize: 1 },
      { codeNum: "P016", name: "Aguacate hass", unit: "KG", unitprice: 63, packageSize: 1 },
      { codeNum: "P018", name: "Manzana roja", unit: "KG", unitprice: 44, packageSize: 1 },
      { codeNum: "P023", name: "Crema ácida 500g", unit: "G", unitprice: 41, packageSize: 500 }
    ]
  }
];

// --- Helpers de normalización de unidades ---
// Grupo de unidad: para no mezclar litros con kilos, etc.
type UnitGroup = "mass" | "volume" | "piece" | "other";

const UNIT_GROUP: Record<string, UnitGroup> = {
  G: "mass",
  KG: "mass",
  MG: "mass",

  ML: "volume",
  L: "volume",

  PZA: "piece",
  PZ: "piece",
};

const UNIT_TO_BASE_FACTOR: Record<string, number> = {
  // masa: base = gramos
  MG: 0.001,
  G: 1,
  KG: 1000,

  // volumen: base = mililitros
  ML: 1,
  L: 1000,

  // pieza: base = pieza
  PZA: 1,
  PZ: 1,
};

function normalizeSuppliersForProductUnit(targetUnit?: string) {
  if (!targetUnit) {
    // si no sabemos la unidad, regresamos suppliers tal cual,
    // pero sin normalizedPricePerUnit
    return SUPPLIERS.map((s) => ({
      supplierName: s.supplierName,
      minOrderValue: s.minOrderValue,
      leadTimeDays: s.leadTimeDays,
      products: s.products.map((p: any) => ({
        ...p,
        normalizedUnit: p.unit,
        normalizedPricePerUnit: null as number | null,
      })),
    }));
  }

  const normTargetUnit = targetUnit.toUpperCase();
  const targetGroup = UNIT_GROUP[normTargetUnit];

  if (!targetGroup || !UNIT_TO_BASE_FACTOR[normTargetUnit]) {
    // no se puede normalizar esta unidad (grupo desconocido)
    return SUPPLIERS.map((s) => ({
      supplierName: s.supplierName,
      minOrderValue: s.minOrderValue,
      leadTimeDays: s.leadTimeDays,
      products: s.products.map((p: any) => ({
        ...p,
        normalizedUnit: p.unit,
        normalizedPricePerUnit: null as number | null,
      })),
    }));
  }

  return SUPPLIERS.map((s) => ({
    supplierName: s.supplierName,
    minOrderValue: s.minOrderValue,
    leadTimeDays: s.leadTimeDays,
    products: s.products.map((p) => {
      const unit = String(p.unit || "").toUpperCase();
      const group = UNIT_GROUP[unit];

      // Grupo distinto (ej. litros vs gramos) → no comparamos precio
      if (!group || group !== targetGroup) {
        return {
          ...p,
          normalizedUnit: unit,
          normalizedPricePerUnit: null as number | null,
        };
      }

      const baseFactorSource = UNIT_TO_BASE_FACTOR[unit];
      const baseFactorTarget = UNIT_TO_BASE_FACTOR[normTargetUnit];

      if (!baseFactorSource || !baseFactorTarget || !p.packageSize || !p.unitprice) {
        return {
          ...p,
          normalizedUnit: unit,
          normalizedPricePerUnit: null as number | null,
        };
      }

      // pricePerBaseUnit = precio / cantidadTotalEnUnidadBase
      // ejemplo mantequilla 90g: 26 / (90 * 1) = 0.2889 pesos por gramo
      const totalBaseUnits = p.packageSize * baseFactorSource;
      const pricePerBaseUnit = p.unitprice / totalBaseUnits;

      // normalizedPricePerUnit = precio por unidad objetivo (ej. por gramo o por kg)
      const normalizedPricePerUnit = pricePerBaseUnit * baseFactorTarget;

      return {
        ...p,
        normalizedUnit: normTargetUnit,
        normalizedPricePerUnit,
      };
    }),
  }));
}

async function callLlama3(systemPrompt: string, userPrompt: string): Promise<string> {
  // Nuevo endpoint OpenAI-compatible de Hugging Face
  const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

  if (!process.env.HF_TOKEN) {
    throw new Error("HF_TOKEN no está configurado en las variables de entorno.");
  }

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 600,
      temperature: 0.2,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error al llamar a Hugging Face:", response.status, errorText);
    throw new Error(
      `Error al llamar a Hugging Face Inference API: ${response.status} ${response.statusText}`,
    );
  }

  const data: any = await response.json();


  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error("Respuesta inesperada del modelo:", data);
    throw new Error("Respuesta inesperada del modelo (sin content).");
  }

  return content as string;
}



function extractFirstJsonObject(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No se encontró un objeto JSON en la respuesta del modelo.");
  }
  return match[0];
}

export async function getSupplierRecommendationsFromAgent(input: {
  productName: string;
  currentSupplierName?: string;
  categoryName?: string;
  quantityInStock?: number;
  minStock?: number;
  unitOfMeasure?: string;    // "KG", "G", "L", "PZA", etc.
  currentUnitPrice?: number; // precio actual por esa unidad
}): Promise<SupplierRecommendation[]> {
  const {
    productName,
    currentSupplierName,
    categoryName,
    quantityInStock,
    minStock,
    unitOfMeasure,
    currentUnitPrice,
  } = input;

  const normalizedSuppliers = normalizeSuppliersForProductUnit(unitOfMeasure);

  const systemPrompt = `
Eres un agente experto en compras y abastecimiento para un punto de venta en México.

Tienes:
- Datos de un producto con bajo inventario (nombre, categoría, unidad, precio actual por unidad).
- Una lista fija de proveedores con sus productos y precios normalizados por unidad.

IMPORTANTE:
- En el JSON "normalizedSuppliers", cada producto tiene un campo "normalizedPricePerUnit".
- "normalizedPricePerUnit" está expresado en la misma unidad que el producto (campo unitOfMeasure).
- Debes usar "normalizedPricePerUnit" para comparar vs "currentUnitPrice".
- Si "normalizedPricePerUnit" es null, ignora ese producto para la comparación de precio.

TU TAREA:
1) Buscar en "normalizedSuppliers" los productos que coincidan o sean muy similares
   al producto dado (por nombre y/o categoría y unidad).
2) Comparar sus "normalizedPricePerUnit" con "currentUnitPrice".
3) Clasificar el precio de cada proveedor como "barato", "medio" o "caro"
   respecto al precio actual:
   - "barato": claramente más bajo que el precio actual.
   - "medio": muy parecido al precio actual.
   - "caro": claramente más alto que el precio actual.
4) Recomendar de 1 a 3 proveedores principales, ordenados del más conveniente al menos conveniente.
   Considera:
   - Precio normalizado por unidad.
   - leadTimeDays (entre más bajo, mejor).
   - minOrderValue (entre más bajo, más flexible).
5) Si no encuentras productos similares en los proveedores, indica que no hay coincidencias claras.

FORMATO DE RESPUESTA:
Devuelve UN ÚNICO objeto JSON con la siguiente forma:

{
  "recommendations": [
    {
      "supplierName": "Nombre del proveedor",
      "website": "https://...",
      "notes": "Explicación breve de por qué lo recomiendas para este producto.",
      "relativePriceComment": "barato | medio | caro"
    }
  ]
}

No escribas nada fuera del JSON. No añadas texto antes ni después. Solo el objeto JSON.
`;

  const userMessage = `
PRODUCTO CON BAJO INVENTARIO
- Nombre: ${productName}
- Categoria: ${categoryName ?? "N/A"}
- Unidad de medida: ${unitOfMeasure ?? "N/A"}
- Precio actual por unidad: ${
    currentUnitPrice !== undefined ? currentUnitPrice + " pesos" : "N/A"
  }
- Stock actual: ${quantityInStock ?? "N/A"}
- Stock mínimo configurado: ${minStock ?? "N/A"}
- Proveedor actual: ${currentSupplierName ?? "N/A"}

LISTA DE PROVEEDORES NORMALIZADOS (normalizedSuppliers):
${JSON.stringify(normalizedSuppliers, null, 2)}
`;

  const rawText = await callLlama3(systemPrompt, userMessage);

  let text = rawText;
  try {
    const jsonText = extractFirstJsonObject(rawText);
    text = jsonText;
  } catch (e) {
    console.warn(
      "No se encontró un JSON limpio en la respuesta del modelo. Se intentará parsear el texto completo.",
    );
  }

  try {
    const parsed = JSON.parse(text) as {
      recommendations?: SupplierRecommendation[];
    };
    return parsed.recommendations ?? [];
  } catch (err) {
    console.error("Error parseando JSON del agente:", err, text);
    return [
      {
        supplierName: "AgenteIA",
        notes:
          "No se pudo parsear JSON de la respuesta del modelo. Respuesta cruda: " +
          text.slice(0, 500),
      },
    ];
  }
}
