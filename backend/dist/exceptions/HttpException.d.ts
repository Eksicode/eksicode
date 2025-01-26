export declare class HttpException extends Error {
    status: number;
    message: string;
    details?: any;
    constructor(status: number, message: string, details?: any);
}
