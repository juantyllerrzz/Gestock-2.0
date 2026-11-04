import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service'; // Ajusta la ruta relativa si tu prisma.service está en otra carpeta
import { Role } from '@prisma/client';

describe('UsersService', () => {
    let service: UsersService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            create: jest.fn().mockResolvedValue({ id: 'uuid-123', name: 'Test User', email: 'test@gestock.com', role: Role.EMPLOYEE }),
            findMany: jest.fn().mockResolvedValue([{ id: 'uuid-123', name: 'Test User', email: 'test@gestock.com', role: Role.EMPLOYEE }]),
            findUnique: jest.fn().mockResolvedValue({ id: 'uuid-123', name: 'Test User', email: 'test@gestock.com', role: Role.EMPLOYEE }),
            update: jest.fn().mockResolvedValue({ id: 'uuid-123', name: 'Updated User', role: Role.ADMIN }),
            delete: jest.fn().mockResolvedValue({ id: 'uuid-123', message: 'Usuario eliminado' }),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('debe estar definido el servicio', () => {
        expect(service).toBeDefined();
    });

    it('debe crear un usuario en la base de datos', async () => {
        const dto = {
            name: 'Test User',
            email: 'test@gestock.com',
            password: 'Password123',
            role: Role.EMPLOYEE,
        };

        const result = await service.create(dto as any);

        expect(result).toEqual(
            expect.objectContaining({
                id: 'uuid-123',
                email: 'test@gestock.com',
            }),
        );
        expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('debe retornar todos los usuarios', async () => {
        const result = await service.findAll();

        expect(result).toHaveLength(1);
        expect(prismaService.user.findMany).toHaveBeenCalled();
    });

    it('debe encontrar un usuario por ID', async () => {
        const result = await service.findOne('uuid-123');

        expect(result).toEqual(
            expect.objectContaining({
                id: 'uuid-123',
            }),
        );
        expect(prismaService.user.findUnique).toHaveBeenCalled();
    });

    it('debe actualizar el rol de un usuario', async () => {
        const result = await service.updateRole('uuid-123', Role.ADMIN);

        expect(result).toEqual(
            expect.objectContaining({
                id: 'uuid-123',
                role: Role.ADMIN,
            }),
        );
        expect(prismaService.user.update).toHaveBeenCalled();
    });
});