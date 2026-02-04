export type UserRole = 'user' | 'admin';

export interface User {
    id: string;
    username: string;
    role: UserRole;
    entries: number;
}

const MOCK_USER: User = {
    id: 'u123',
    username: 'Johnny Silverhand',
    role: 'user',
    entries: 5,
};

const MOCK_ADMIN: User = {
    id: 'a999',
    username: 'Admin',
    role: 'admin',
    entries: 0,
};

export const AuthService = {
    login: async (role: UserRole): Promise<User> => {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(role === 'admin' ? MOCK_ADMIN : MOCK_USER);
            }, 500);
        });
    },
    logout: async (): Promise<void> => {
        return Promise.resolve();
    },
};
