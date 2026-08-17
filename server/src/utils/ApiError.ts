class ApiError extends Error {
  public status: number;
  public errors: unknown[];
  public success: boolean;

  constructor(
    status: number,
    message = "Something went wrong",
    errors: unknown[] = []
  ) {
    super(message);

    this.status = status;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;