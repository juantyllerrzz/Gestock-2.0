import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { Role } from '@prisma/client';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUsersService = {
        create: jest.fn().mockImplementation((dto: any) => Promise.resolve({ id: 'uuid-123', ...dto })),
        findAll: jest.fn().mockImplementation(() => Promise.resolve([{ id: 'uuid-123', name: 'Admin Gestock', email: 'admin@gestock.com', role: Role.EMPLOYEE }])),
        findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({ id, name: 'Admin Gestock', email: 'admin@gestock.com', role: Role.ADMIN })),
        update: jest.fn().mockImplementation((id: string, dto: any) => Promise.resolve({ id, ...dto })),
        updateRole: jest.fn().mockImplementation((id: string, role: Role) => Promise.resolve({ id, role })),
        remove: jest.fn().mockImplementation((id: string) => Promise.resolve({ message: 'Usuario eliminado' })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('debe estar definido el controlador', () => {
        expect(controller).toBeDefined();
    });

    it('debería crear un usuario correctamente (Endpoint POST /users)', async () => {
        const createUserDto = {
            name: 'Nuevo Usuario',
            email: 'nuevo@gestock.com',
            password: 'Password123',
            role: Role.EMPLOYEE,
        };

        const result = await controller.create(createUserDto as any);

        expect(result).toEqual({
            id: 'uuid-123',
            ...createUserDto,
        });
        expect(service.create).toHaveBeenCalledWith(createUserDto);
    });

    it('debería retornar la lista de usuarios (Endpoint GET /users)', async () => {
        const result = await controller.findAll();

        expect(result).toHaveLength(1);
        expect(result[0].name).toEqual('Admin Gestock');
        expect(service.findAll).toHaveBeenCalled();
    });

    it('debería buscar un usuario por ID (Endpoint GET /users/:id)', async () => {
        const userId = 'uuid-1543';
        const result = await controller.findOne(userId);

        expect(result).toEqual(
            expect.objectContaining({
                id: userId,
                email: 'admin@gestock.com',
            }) as any,
        );
        expect(service.findOne).toHaveBeenCalledWith(userId);
    });

    it('debería actualizar el rol de un usuario (Endpoint PATCH /users/:id/role)', async () => {
        const userId = 'uuid-123';
        const updateRoleDto = { role: Role.ADMIN };

        const result = await controller.updateRole(userId, updateRoleDto as any);

        expect(result).toEqual({
            id: userId,
            role: Role.ADMIN,
        });
        expect(service.updateRole).toHaveBeenCalledWith(userId, Role.EMPLOYEE);
    });
});