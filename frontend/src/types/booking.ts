export interface MyBooking {
    id: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    createdAt: string;
    block: {
        id: number;
        startDate: string;
        endDate: string;
        dayOfWeek: string;
        time: string;
        course: {
            id: number;
            title: string;
            description?: string;
            capacity: number;
        };
    };
}