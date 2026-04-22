import { Test, TestingModule } from '@nestjs/testing';
import { BlocksService } from './blocks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BlocksService', () => {
  let service: BlocksService;

  const prismaMock = {
    course: {
      findFirst: jest.fn(),
    },
    block: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<BlocksService>(BlocksService);
  });

  it('should create a block successfully', async () => {
    prismaMock.course.findFirst.mockResolvedValue({ id: 1, isActive: true });

    prismaMock.block.create.mockResolvedValue({
      id: 1,
    });

    const result = await service.create({
      courseId: 1,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      dayOfWeek: 'Monday',
      time: '18:00',
    });

    expect(result).toBeDefined();
  });

  it('should throw if course not found', async () => {
    prismaMock.course.findFirst.mockResolvedValue(null);

    await expect(
      service.create({
        courseId: 999,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 1000).toISOString(),
        dayOfWeek: 'Monday',
        time: '18:00',
      }),
    ).rejects.toThrow();
  });
});
