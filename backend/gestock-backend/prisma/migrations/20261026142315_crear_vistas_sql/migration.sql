-- This is an empty migration.
-- Crear la Vista SQL
CREATE OR REPLACE VIEW vista_listado_productos AS
SELECT
    p.sku,
    p.name AS producto,
    b.name AS marca,
    p.cost,
    p."unitPrice",
    p."currentStock",
    c.name AS categoria,
    s.name AS proveedor
FROM "Product" p
JOIN "Category" c ON p."categoryId" = c.id
LEFT JOIN "Brand" b ON p."brandId" = b.id
LEFT JOIN "Supplier" s ON p."supplierId" = s.id;

-- Crear la Función (Procedimiento Almacenado)
CREATE OR REPLACE FUNCTION obtener_listado_productos()
RETURNS TABLE(
    sku VARCHAR, 
    producto VARCHAR, 
    marca VARCHAR, 
    cost DECIMAL, 
    "unitPrice" DECIMAL, 
    "currentStock" INTEGER, 
    categoria VARCHAR, 
    proveedor VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
    SELECT
        p.sku::VARCHAR,
        p.name::VARCHAR AS producto,
        b.name::VARCHAR AS marca,
        p.cost,
        p."unitPrice",
        p."currentStock",
        c.name::VARCHAR AS categoria,
        s.name::VARCHAR AS proveedor
    FROM "Product" p
    JOIN "Category" c ON p."categoryId" = c.id
    LEFT JOIN "Brand" b ON p."brandId" = b.id
    LEFT JOIN "Supplier" s ON p."supplierId" = s.id;
END;
$$ LANGUAGE plpgsql;