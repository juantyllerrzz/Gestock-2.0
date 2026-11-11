import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Limpiando datos antiguos...');

  // 1. Limpiar registros respetando llaves foráneas
  await prisma.movement.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log(' Base de datos limpia. Insertando registros...');

  // 2. Crear Categorías (sin el campo description)
  const catElectronica = await prisma.category.create({
    data: {
      name: 'Electrónica y Cómputo',
    },
  });

  const catAlimentos = await prisma.category.create({
    data: {
      name: 'Alimentos y Bebidas',
    },
  });

  const catOficina = await prisma.category.create({
    data: {
      name: 'Suministros de Oficina',
    },
  });

  // 3. Crear Productos
  await prisma.product.createMany({
    data: [
      {
        sku: 'ELEC-001',
        name: 'Laptop Pro 15',
        description: 'Laptop de alto rendimiento 16GB RAM 512GB SSD',
        unitPrice: 1200.0,
        currentStock: 15,
        minStock: 3,
        categoryId: catElectronica.id,
      },
      {
        sku: 'ELEC-002',
        name: 'Mouse Inalámbrico RGB',
        description: 'Mouse ergonómico óptico 2.4GHz',
        unitPrice: 25.5,
        currentStock: 50,
        minStock: 10,
        categoryId: catElectronica.id,
      },
      {
        sku: 'ALIM-001',
        name: 'Café Grano Gourmet 1kg',
        description: 'Café tostado origen colombiano',
        unitPrice: 18.0,
        currentStock: 40,
        minStock: 8,
        categoryId: catAlimentos.id,
      },
      {
        sku: 'OFI-001',
        name: 'Resma Papel Carta 500H',
        description: 'Papel multipropósito 75g/m²',
        unitPrice: 5.5,
        currentStock: 100,
        minStock: 20,
        categoryId: catOficina.id,
      },
    ],
  });

  console.log(' Seed ejecutado con éxito en Gestock 2.0.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });