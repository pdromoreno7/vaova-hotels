import { User } from '@/interface/user.interface';

export const saveUserSession = (userData: User) => {
  sessionStorage.setItem('userSession', JSON.stringify(userData));
};
