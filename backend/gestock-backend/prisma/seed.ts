
import 'dotenv/config';

import {
  PrismaClient,
  Role,
  MovementType,
} from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_MARKER = 'GESTOCK_DEMO_V2';
const DAY_MS = 24 * 60 * 60 * 1000;



function validateEnvironment() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'No se permite ejecutar este seed en producción.',
    );
  }

  if (process.env.ALLOW_DEMO_SEED !== 'true') {
    throw new Error(
      'Configura ALLOW_DEMO_SEED=true para autorizar datos de prueba.',
    );
  }

  if (
    !process.env.SEED_DEMO_PASSWORD ||
    process.env.SEED_DEMO_PASSWORD.length < 12
  ) {
    throw new Error(
      'Configura SEED_DEMO_PASSWORD con mínimo 12 caracteres.',
    );
  }
}



const userSeeds = [
  {
    name: 'Admin Gestock',
    email: 'admin@gestock.com',
    role: Role.ADMIN,
  },
  {
    name: 'Laura Gomez',
    email: 'manager@gestock.com',
    role: Role.MANAGER,
  },
  {
    name: 'Carlos Ruiz',
    email: 'empleado@gestock.com',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Camila Torres',
    email: 'camila.torres@example.com',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Andres Ramirez',
    email: 'andres.ramirez@example.com',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Valentina Castro',
    email: 'valentina.castro@example.com',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Santiago Perez',
    email: 'santiago.perez@example.com',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Daniela Rojas',
    email: 'daniela.rojas@example.com',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Mateo Herrera',
    email: 'mateo.herrera@example.com',
    role: Role.EMPLOYEE,
  },
  {
    name: 'Sofia Martinez',
    email: 'sofia.martinez@example.com',
    role: Role.EMPLOYEE,
  },
];



const categoryNames = [
  'Electronica',
  'Papeleria',
  'Limpieza',
  'Alimentos',
  'Bebidas',
  'Empaques',
];



interface ProductSeed {
  sku: string;
  name: string;
  unitPrice: number;
  minStock: number;
  category: string;
}

const productSeeds: ProductSeed[] = [
 
  { sku: 'ELEC-001', name: 'Mouse inalambrico', unitPrice: 35000, minStock: 10, category: 'Electronica' },
  { sku: 'ELEC-002', name: 'Teclado mecanico', unitPrice: 120000, minStock: 5, category: 'Electronica' },
  { sku: 'ELEC-003', name: 'Cable HDMI 2m', unitPrice: 18000, minStock: 15, category: 'Electronica' },
  { sku: 'ELEC-004', name: 'Mousepad ergonomico', unitPrice: 25000, minStock: 10, category: 'Electronica' },
  { sku: 'ELEC-005', name: 'Memoria USB 32GB', unitPrice: 28000, minStock: 12, category: 'Electronica' },

  
  { sku: 'PAP-001', name: 'Resma de papel carta', unitPrice: 15000, minStock: 20, category: 'Papeleria' },
  { sku: 'PAP-002', name: 'Caja de lapiceros', unitPrice: 8000, minStock: 15, category: 'Papeleria' },
  { sku: 'PAP-003', name: 'Marcadores permanentes', unitPrice: 12000, minStock: 10, category: 'Papeleria' },
  { sku: 'PAP-004', name: 'Cuaderno universitario', unitPrice: 9500, minStock: 20, category: 'Papeleria' },
  { sku: 'PAP-005', name: 'Cinta adhesiva', unitPrice: 6500, minStock: 15, category: 'Papeleria' },


  { sku: 'LIMP-001', name: 'Desinfectante multiusos', unitPrice: 9500, minStock: 12, category: 'Limpieza' },
  { sku: 'LIMP-002', name: 'Guantes de nitrilo (caja)', unitPrice: 22000, minStock: 8, category: 'Limpieza' },
  { sku: 'LIMP-003', name: 'Jabon liquido 1L', unitPrice: 14000, minStock: 12, category: 'Limpieza' },
  { sku: 'LIMP-004', name: 'Cloro 1L', unitPrice: 7500, minStock: 15, category: 'Limpieza' },
  { sku: 'LIMP-005', name: 'Bolsas para basura', unitPrice: 11000, minStock: 18, category: 'Limpieza' },


  { sku: 'ALIM-001', name: 'Cafe molido 500g', unitPrice: 14000, minStock: 10, category: 'Alimentos' },
  { sku: 'ALIM-002', name: 'Arroz blanco 1kg', unitPrice: 6500, minStock: 20, category: 'Alimentos' },
  { sku: 'ALIM-003', name: 'Azucar 1kg', unitPrice: 5800, minStock: 15, category: 'Alimentos' },
  { sku: 'ALIM-004', name: 'Leche UHT 1L', unitPrice: 5200, minStock: 20, category: 'Alimentos' },
  { sku: 'ALIM-005', name: 'Aceite vegetal 1L', unitPrice: 11500, minStock: 12, category: 'Alimentos' },
  { sku: 'ALIM-006', name: 'Sal refinada 1kg', unitPrice: 3200, minStock: 10, category: 'Alimentos' },
  { sku: 'ALIM-007', name: 'Lentejas 500g', unitPrice: 4800, minStock: 15, category: 'Alimentos' },
  { sku: 'ALIM-008', name: 'Atun enlatado 160g', unitPrice: 7800, minStock: 15, category: 'Alimentos' },
  { sku: 'ALIM-009', name: 'Pasta 500g', unitPrice: 4600, minStock: 18, category: 'Alimentos' },
  { sku: 'ALIM-010', name: 'Harina de trigo 1kg', unitPrice: 5500, minStock: 12, category: 'Alimentos' },
  { sku: 'ALIM-011', name: 'Galletas integrales', unitPrice: 7500, minStock: 15, category: 'Alimentos' },
  { sku: 'ALIM-012', name: 'Cereal de maiz 500g', unitPrice: 13500, minStock: 10, category: 'Alimentos' },

 
  { sku: 'BEB-001', name: 'Agua mineral 600ml', unitPrice: 2500, minStock: 25, category: 'Bebidas' },
  { sku: 'BEB-002', name: 'Jugo natural 1L', unitPrice: 8500, minStock: 15, category: 'Bebidas' },
  { sku: 'BEB-003', name: 'Gaseosa 1.5L', unitPrice: 7200, minStock: 20, category: 'Bebidas' },
  { sku: 'BEB-004', name: 'Te frio 500ml', unitPrice: 4300, minStock: 18, category: 'Bebidas' },
  { sku: 'BEB-005', name: 'Bebida energetica', unitPrice: 6500, minStock: 12, category: 'Bebidas' },
  { sku: 'BEB-006', name: 'Aromatica en sobres', unitPrice: 5500, minStock: 10, category: 'Bebidas' },

 
  { sku: 'EMP-001', name: 'Bolsas hermeticas', unitPrice: 8500, minStock: 15, category: 'Empaques' },
  { sku: 'EMP-002', name: 'Recipientes plasticos', unitPrice: 12000, minStock: 15, category: 'Empaques' },
  { sku: 'EMP-003', name: 'Papel aluminio', unitPrice: 9000, minStock: 10, category: 'Empaques' },
  { sku: 'EMP-004', name: 'Vasos desechables', unitPrice: 7200, minStock: 20, category: 'Empaques' },
  { sku: 'EMP-005', name: 'Cinta para empaque', unitPrice: 6800, minStock: 12, category: 'Empaques' },
];



interface MovementSeed {
  productId: string;
  userId: string;
  type: MovementType;
  quantity: number;
  note: string;
  createdAt: Date;
}

async function createSeedMovement(
  movement: MovementSeed,
): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    // Evitar repetir un movimiento del seed
    const existing = await tx.movement.findFirst({
      where: {
        productId: movement.productId,
        note: movement.note,
      },
      select: { id: true },
    });

    if (existing) {
      return false;
    }

    
    if (movement.type === MovementType.IN) {
      await tx.product.update({
        where: { id: movement.productId },
        data: {
          currentStock: {
            increment: movement.quantity,
          },
        },
      });
    }

    
    if (movement.type === MovementType.OUT) {
      const updated = await tx.product.updateMany({
        where: {
          id: movement.productId,
          currentStock: {
            gte: movement.quantity,
          },
        },
        data: {
          currentStock: {
            decrement: movement.quantity,
          },
        },
      });

      if (updated.count !== 1) {
        throw new Error(
          `Stock insuficiente para movimiento: ${movement.note}`,
        );
      }
    }

    
    await tx.movement.create({
      data: {
        productId: movement.productId,
        userId: movement.userId,
        type: movement.type,
        quantity: movement.quantity,
        note: movement.note,
        createdAt: movement.createdAt,
      },
    });

    return true;
  });
}



async function main() {
  validateEnvironment();

  console.log('Iniciando seed de Gestock 2.0...');

  const demoPassword = process.env.SEED_DEMO_PASSWORD!;
  const passwordHash = await bcrypt.hash(demoPassword, 10);

 
  console.log('Creando usuarios...');

  const users = [];

  for (const item of userSeeds) {
    const user = await prisma.user.upsert({
      where: {
        email: item.email,
      },
      update: {},
      create: {
        name: item.name,
        email: item.email,
        password: passwordHash,
        role: item.role,
        emailVerified: true,
      },
    });

    users.push(user);
  }

  const admin = users.find(
    (user) => user.email === 'admin@gestock.com',
  )!;

  const employees = users.filter(
    (user) => user.role === Role.EMPLOYEE,
  );

  
  console.log('Creando categorías...');

  const categories = [];

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    categories.push(category);
  }

  
  console.log('Creando productos...');

  const products = [];

  for (const item of productSeeds) {
    const category = categories.find(
      (cat) => cat.name === item.category,
    );

    if (!category) {
      throw new Error(
        `Categoría no encontrada: ${item.category}`,
      );
    }

    const product = await prisma.product.upsert({
      where: { sku: item.sku },
      update: {},
      create: {
        sku: item.sku,
        name: item.name,
        description:
          `${item.name} - producto de demostración`,
        unitPrice: item.unitPrice,
        minStock: item.minStock,
        currentStock: 0,
        categoryId: category.id,
      },
    });

    products.push(product);
  }

  // 4. GENERAR MOVIMIENTOS
  console.log('Generando entradas y salidas...');

  let createdMovements = 0;
  let createdEntries = 0;
  let createdExits = 0;

  const today = new Date();

  for (let index = 0; index < products.length; index++) {
    const product = products[index];

    
    const initialQuantity = 70 + ((index * 11) % 51);

    const initialCreated = await createSeedMovement({
      productId: product.id,
      userId: admin.id,
      type: MovementType.IN,
      quantity: initialQuantity,
      note: `${SEED_MARKER}|${product.sku}|INICIO`,
      createdAt: new Date(
        today.getTime() - 32 * DAY_MS,
      ),
    });

    if (initialCreated) {
      createdMovements++;
      createdEntries++;
    }

  
    for (let step = 1; step <= 14; step++) {
      const isEntry =
        (step + index) % 3 === 0 ||
        step % 7 === 0;

      const type = isEntry
        ? MovementType.IN
        : MovementType.OUT;

      const quantity = isEntry
        ? 15 + ((index * 5 + step * 7) % 36)
        : 2 + ((index * 3 + step * 2) % 10);

      const employee =
        employees[(index + step) % employees.length];

      const daysAgo = 31 - step * 2;

      const createdAt = new Date(
        today.getTime() - daysAgo * DAY_MS,
      );

      const description = isEntry
        ? 'Entrada de mercancía de proveedor'
        : 'Salida de mercancía por venta';

      const created = await createSeedMovement({
        productId: product.id,
        userId: employee.id,
        type,
        quantity,
        createdAt,
        note:
          `${SEED_MARKER}|${product.sku}|${step}|${description}`,
      });

      if (created) {
        createdMovements++;

        if (isEntry) {
          createdEntries++;
        } else {
          createdExits++;
        }
      }
    }
  }

 
  const [
    totalUsers,
    totalCategories,
    totalProducts,
    totalMovements,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.product.count(),
    prisma.movement.count(),
  ]);

  console.log('\n====================================');
  console.log('GESTOCK 2.0 - SEED FINALIZADO');
  console.log('====================================');
  console.log(`Usuarios totales: ${totalUsers}`);
  console.log(`Categorías totales: ${totalCategories}`);
  console.log(`Productos totales: ${totalProducts}`);
  console.log(`Movimientos totales: ${totalMovements}`);
  console.log(`Movimientos nuevos: ${createdMovements}`);
  console.log(`Entradas nuevas: ${createdEntries}`);
  console.log(`Salidas nuevas: ${createdExits}`);
  console.log('====================================');
  console.log('Seed completo.');
}


main()
  .catch((error) => {
    console.error('Error ejecutando el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
