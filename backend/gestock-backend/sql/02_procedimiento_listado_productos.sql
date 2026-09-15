-- Criterio 7 del rubric: "Listado mediante Procedimiento"
-- Mismo resultado que la vista, pero expuesto como funcion/procedimiento
-- almacenado en PostgreSQL (PL/pgSQL).

CREATE OR REPLACE FUNCTION obtener_listado_productos()
RETURNS TABLE (
  sku TEXT,
  name TEXT,
  description TEXT,
  "unitPrice" NUMERIC,
  "currentStock" INTEGER,
  "minStock" INTEGER,
  "categoryId" TEXT,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p."sku",
    p."name",
    p."description",
    p."unitPrice",
    p."currentStock",
    p."minStock",
    p."categoryId",
    p."createdAt",
    p."updatedAt"
  FROM "Product" p;
END;
$$;
