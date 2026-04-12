import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE COURSE
   */
  create(dto: CreateCourseDto, instructorId: number) {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        capacity: dto.capacity,
        startDate: new Date(dto.startDate), // ✅ important
        instructorId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * GET ALL COURSES
   */
  findAll() {
    return this.prisma.course.findMany({
      orderBy: {
        startDate: 'asc', // ✅ nice improvement
      },
      include: {
        instructor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * GET SINGLE COURSE
   */
  async findOne(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID #${id} not found`);
    }

    return course;
  }

  /**
   * UPDATE COURSE
   */
  async update(id: number, dto: UpdateCourseDto) {
    await this.findOne(id);

    return this.prisma.course.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate && {
          startDate: new Date(dto.startDate), // ✅ safe conversion
        }),
      },
      include: {
        instructor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * DELETE COURSE
   */
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.course.delete({
      where: { id },
    });
  }
}
