export class ApplicationException extends Error {
  public readonly statusCode: number;
  public readonly timestamp: string;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'ApplicationException';
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}
