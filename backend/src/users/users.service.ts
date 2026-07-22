import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(updateUserDto.email ? { email: updateUserDto.email } : {}),
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async setRole(id: number, role: 'MEMBER' | 'INSTRUCTOR' | 'ADMIN') {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true, createdAt: true },
    });
  }

  async addCredit(userId: number, amountCents: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID #${userId} not found`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        creditBalanceCents: {
          increment: amountCents,
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        creditBalanceCents: true,
      },
    });
  }
}
