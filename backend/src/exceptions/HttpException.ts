export class HttpException extends Error {
  status: number;
  message: string;
  details: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details || null;
    this.name = 'HttpException';
  }
}