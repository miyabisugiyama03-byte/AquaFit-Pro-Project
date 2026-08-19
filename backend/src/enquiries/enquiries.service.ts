import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { EnquiryStatus, Role } from '../generated/prisma/enums';
import {QueryEnquiriesDto} from "./dto/query-enquiries.dto";

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new enquiry and the first message.
   */
  async createEnquiry(userId: number, dto: CreateEnquiryDto) {
    return this.prisma.enquiry.create({
      data: {
        subject: dto.subject,
        userId,

        messages: {
          create: {
            message: dto.message,
            senderId: userId,
          },
        },
      },

      include: {
        messages: true,
      },
    });
  }

  /**
   * Returns all enquiries for the logged in member.
   */
  async getMyEnquiries(userId: number) {
    return this.prisma.enquiry.findMany({
      where: {
        userId,
      },

      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * Returns every enquiry (Admin only).
   */
  async getAllEnquiries(query: QueryEnquiriesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const where = {
      ...(query.status
        ? {
            status: query.status,
          }
        : {}),

      ...(query.search
        ? {
            OR: [
              {
                subject: {
                  contains: query.search,
                  mode: 'insensitive' as const,
                },
              },
              {
                user: {
                  email: {
                    contains: query.search,
                    mode: 'insensitive' as const,
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [enquiries, total] = await Promise.all([
      this.prisma.enquiry.findMany({
        where,

        skip,
        take: limit,

        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },

          messages: {
            orderBy: {
              createdAt: 'desc',
            },

            take: 1,

            include: {
              sender: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },

        orderBy: {
          updatedAt: 'desc',
        },
      }),

      this.prisma.enquiry.count({
        where,
      }),
    ]);

    return {
      data: enquiries,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Returns a single enquiry.
   * Members may only access their own.
   */
  async getEnquiry(
    enquiryId: number,
    currentUserId: number,
    currentRole: Role,
  ) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: {
        id: enquiryId,
      },

      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },

        messages: {
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },

          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    if (currentRole !== Role.ADMIN && enquiry.userId !== currentUserId) {
      throw new ForbiddenException(
        'You do not have permission to view this enquiry.',
      );
    }

    return enquiry;
  }

  /**
   * Adds a message to an enquiry.
   * Used by both members and admins.
   */
  async addMessage(
    enquiryId: number,
    userId: number,
    role: string,
    dto: CreateMessageDto,
  ) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: {
        id: enquiryId,
      },
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    if (role !== Role.ADMIN && enquiry.userId !== userId) {
      throw new ForbiddenException('You cannot reply to this enquiry.');
    }

    if (enquiry.status === EnquiryStatus.CLOSED) {
      throw new BadRequestException('This enquiry has been closed.');
    }

    await this.prisma.enquiry.update({
      where: {
        id: enquiryId,
      },

      data: {
        status:
          role === Role.ADMIN ? EnquiryStatus.IN_PROGRESS : enquiry.status,
      },
    });

    return this.prisma.enquiryMessage.create({
      data: {
        enquiryId,
        senderId: userId,
        message: dto.message,
      },

      include: {
        sender: {
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
   * Admin updates enquiry status.
   */
  async updateStatus(enquiryId: number, dto: UpdateStatusDto) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: {
        id: enquiryId,
      },
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    return this.prisma.enquiry.update({
      where: {
        id: enquiryId,
      },

      data: {
        status: dto.status,

        closedAt: dto.status === EnquiryStatus.CLOSED ? new Date() : null,
      },
    });
  }

  /**
   * Reopens a closed enquiry.
   */
  async reopenEnquiry(id: number) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: {
        id,
      },
    });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found');
    }

    return this.prisma.enquiry.update({
      where: {
        id,
      },

      data: {
        status: EnquiryStatus.OPEN,
        closedAt: null,
      },
    });
  }
}
