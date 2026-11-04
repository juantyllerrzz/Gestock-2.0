-- Criterio 6 del rubric: "Listado mediante Vista SQL"
-- Muestra el contenido de la tabla Product con todos los campos
-- excepto el id, ya resuelto a nivel de base de datos.

CREATE OR REPLACE VIEW vista_listado_productos AS
SELECT
  "sku",
  "name",
  "description",
  "unitPrice",
  "currentStock",
  "minStock",
  "categoryId",
  "createdAt",
  "updatedAt"
FROM "Product";
