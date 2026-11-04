import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products/products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  
  const mockPrismaService = {
    product: {
      create: jest.fn().mockResolvedValue({ id: '1', name: 'Laptop Test', currentStock: 10, minStock: 2 }),
      findMany: jest.fn().mockResolvedValue([{ id: '1', name: 'Laptop Test' }]),
      findUnique: jest.fn().mockResolvedValue({ id: '1', name: 'Laptop Test' }),
      update: jest.fn().mockResolvedValue({ id: '1', name: 'Laptop Actualizada' }),
      delete: jest.fn().mockResolvedValue({ id: '1' }),
    },
    $queryRaw: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('debe estar definido el servicio', () => {
    expect(service).toBeDefined();
  });

  it('debería crear un producto exitosamente', async () => {
    const dtoMock = { name: 'Laptop Test', currentStock: 10, minStock: 2 } as any;
    
    const resultado = await service.create(dtoMock);
    
    expect(resultado).toEqual({ id: '1', name: 'Laptop Test', currentStock: 10, minStock: 2 });
    expect(prisma.product.create).toHaveBeenCalledWith({ data: dtoMock });
  });

  it('debería listar todos los productos incluyendo la categoría', async () => {
    const resultado = await service.findAll();
    
    expect(resultado).toEqual([{ id: '11', name: 'Laptop Test' }]);
    expect(prisma.product.findMany).toHaveBeenCalledWith({ include: { category: true } });
  });
});