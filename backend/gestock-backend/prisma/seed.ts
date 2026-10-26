import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Limpiando base de datos...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.supplier.deleteMany();

  console.log('Insertando Categorías...');
  const cat1 = await prisma.category.create({ data: { name: 'Electrónica ' } });
  const cat2 = await prisma.category.create({ data: { name: 'Alimentoss' } });

  console.log('Insertando Marcas...');
  const brand1 = await prisma.brand.create({ data: { name: 'Dell' } });
  const brand2 = await prisma.brand.create({ data: { name: 'Logitech' } });
  const brand3 = await prisma.brand.create({ data: { name: 'Apple' } });

  console.log('Insertando Proveedores...');
  const sup1 = await prisma.supplier.create({ data: { name: 'Distribuidora Tecnológica S.A.', contact: 'contacto@distribuidoratec.com' } });

  console.log('Insertando Productos...');
  await prisma.product.createMany({
    data: [
      {
        sku: 'ELEC-001',
        name: 'Laptop Pro 15 Apple',
        description: 'Laptop de alta gama con 16GB RAM',
        cost: 800.00,
        unitPrice: 1200.00,
        currentStock: 15,
        minStock: 3,
        categoryId: cat1.id,
        brandId: brand3.id,
        supplierId: sup1.id,
      },
      {
        sku: 'ACC-002',
        name: 'Monitor 24 Pulgadas Dell',
        description: 'Monitor LED Full HD para oficina',
        cost: 380000.00,
        unitPrice: 520000.00,
        currentStock: 10,
        minStock: 3,
        categoryId: cat1.id,
        brandId: brand1.id,
        supplierId: sup1.id,
      },
      {
        sku: 'PER-001',
        name: 'Mouse Inalámbrico Logitech',
        description: 'Mouse óptico inalámbrico con receptor USB',
        cost: 35000.00,
        unitPrice: 55000.00,
        currentStock: 40,
        minStock: 10,
        categoryId: cat2.id,
        brandId: brand2.id,
        supplierId: sup1.id,
      }
    ]
  });

  console.log('¡Base de datos poblada exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });