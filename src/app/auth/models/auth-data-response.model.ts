export interface AuthDataResponse {
    data: {
        token: string;
        expiresIn: number;
        user: {
            _id: string;
            name: string;
            email: string;
            role: string;
        }
    }
}
