
export interface CurrentUser {
    id: number;
    email: string;
    role: 'member' | 'instructor' | 'admin';
    creditBalanceCents: number;
}