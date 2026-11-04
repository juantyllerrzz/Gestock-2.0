import { PrismaClient, Role, MovementType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Sembrando datos de prueba...');

  const passwordHash = await bcrypt.hash('Gestock123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gestock.com' },
    update: { emailVerified: true },
    create: {
      name: 'Admin Gestock',
      email: 'admin@gestock.com',
      password: passwordHash,
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'manager@gestock.com' },
    update: { emailVerified: true },
    create: {
      name: 'Laura Gomez',
      email: 'manager@gestock.com',
      password: passwordHash,
      role: Role.MANAGER,
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'empleado@gestock.com' },
    update: { emailVerified: true },
    create: {
      name: 'Carlos Ruiz',
      email: 'empleado@gestock.com',
      password: passwordHash,
      role: Role.EMPLOYEE,
      emailVerified: true,
    },
  });

  const categoryNames = ['Electronica', 'Papeleria', 'Limpieza', 'Alimentos'];
  const categories = [];
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  const productSeeds = [
    { sku: 'ELEC-001', name: 'Mouse inalambrico', unitPrice: 35000, minStock: 10, category: 'Electronica' },
    { sku: 'ELEC-002', name: 'Teclado mecanico', unitPrice: 120000, minStock: 5, category: 'Electronica' },
    { sku: 'ELEC-003', name: 'Cable HDMI 2m', unitPrice: 18000, minStock: 15, category: 'Electronica' },
    { sku: 'PAP-001', name: 'Resma de papel carta', unitPrice: 15000, minStock: 20, category: 'Papeleria' },
    { sku: 'PAP-002', name: 'Caja de lapiceros', unitPrice: 8000, minStock: 15, category: 'Papeleria' },
    { sku: 'LIMP-001', name: 'Desinfectante multiusos', unitPrice: 9500, minStock: 12, category: 'Limpieza' },
    { sku: 'LIMP-002', name: 'Guantes de nitrilo (caja)', unitPrice: 22000, minStock: 8, category: 'Limpieza' },
    { sku: 'ALIM-001', name: 'Cafe molido 500g', unitPrice: 14000, minStock: 10, category: 'Alimentos' },
  ];

  const products = [];
  for (const p of productSeeds) {
    const category = categories.find((c) => c.name === p.category)!;
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        sku: p.sku,
        name: p.name,
        description: `${p.name} - producto de prueba`,
        unitPrice: p.unitPrice,
        currentStock: randomInt(30, 80),
        minStock: p.minStock,
        categoryId: category.id,
      },
    });
    products.push(product);
  }

  for (const product of products) {
    for (let daysAgo = 30; daysAgo >= 1; daysAgo--) {
      if (Math.random() > 0.6) continue;
      const quantity = randomInt(1, 5);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      await prisma.movement.create({
        data: {
          type: MovementType.OUT,
          quantity,
          productId: product.id,
          userId: admin.id,
          note: 'Movimiento de prueba (seed)',
          createdAt: date,
        },
      });
    }
  }

  console.log('Seed completo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });