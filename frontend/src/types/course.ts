export type SkillLevel = 'BEGINNER' | 'IMPROVER' | 'DEVELOPMENT' | 'ADVANCED';
export type SessionsPerWeek = 'ONE' | 'TWO';

export interface BookingSummary {
    id: number;
    userId: number;
    blockId: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    createdAt: string;
}

export interface Block {
    id: number;
    courseId: number;
    startDate: string;
    endDate: string;
    dayOfWeek: string;
    time: string;
    skillLevel: SkillLevel;
    sessionsPerWeek: SessionsPerWeek;
    isActive?: boolean;
    bookings?: BookingSummary[];
}

export interface Course {
    id: number;
    title: string;
    description?: string;
    capacity: number;
    createdAt: string;
    isActive?: boolean;
    instructor?: {
        id: number;
        email: string;
        role: string;
    };
    blocks: Block[];
}