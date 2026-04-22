import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Block } from '../generated/prisma/client';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlocksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBlockDto) {
    const course = await this.prisma.course.findFirst({
      where: {
        id: dto.courseId,
        isActive: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Active course not found');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    return this.prisma.block.create({
      data: {
        courseId: dto.courseId,
        startDate,
        endDate,
        dayOfWeek: dto.dayOfWeek,
        time: dto.time,
        isActive: true,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
        bookings: true,
      },
    });
  }

  findAll() {
    return this.prisma.block.findMany({
      where: {
        isActive: true,
        course: {
          isActive: true,
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
        bookings: true,
      },
    });
  }

  findByCourse(courseId: number) {
    return this.prisma.block.findMany({
      where: {
        courseId,
        isActive: true,
        course: {
          isActive: true,
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      include: {
        bookings: true,
      },
    });
  }

  async findOne(id: number) {
    const block = await this.prisma.block.findFirst({
      where: {
        id,
        isActive: true,
        course: {
          isActive: true,
        },
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!block) {
      throw new NotFoundException(`Block with ID #${id} not found`);
    }

    return block;
  }

  async update(id: number, dto: UpdateBlockDto) {
    const current = await this.prisma.block.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!current) {
      throw new NotFoundException(`Block with ID #${id} not found`);
    }

    const data: {
      courseId?: number;
      startDate?: Date;
      endDate?: Date;
      dayOfWeek?: string;
      time?: string;
    } = {};

    if (dto.courseId !== undefined) {
      const course = await this.prisma.course.findFirst({
        where: {
          id: dto.courseId,
          isActive: true,
        },
      });

      if (!course) {
        throw new NotFoundException('Active course not found');
      }

      data.courseId = dto.courseId;
    }

    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    if (dto.dayOfWeek !== undefined) data.dayOfWeek = dto.dayOfWeek;
    if (dto.time !== undefined) data.time = dto.time;

    const finalStart = data.startDate ?? current.startDate;
    const finalEnd = data.endDate ?? current.endDate;

    if (finalEnd <= finalStart) {
      throw new BadRequestException('endDate must be after startDate');
    }

    return this.prisma.block.update({
      where: { id },
      data,
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
        bookings: true,
      },
    });
  }

  async remove(id: number): Promise<Block> {
    const block = await this.prisma.block.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!block) {
      throw new NotFoundException(`Block with ID #${id} not found`);
    }

    return this.prisma.block.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
