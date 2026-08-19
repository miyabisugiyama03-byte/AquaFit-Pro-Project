import { Role } from '../generated/prisma/enums';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    role: Role;
  };
}
