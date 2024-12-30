export class HttpException extends Error {
    public status: number;
    public message: string;
    public details?: any;
  
    constructor(status: number, message: string, details?: any) {
      super(message);
      this.status = status;
      this.message = message;
      this.details = details;
    }
  }