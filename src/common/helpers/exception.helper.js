import { statusCodes } from "./status-code.helper";

export class BadRequestException extends Error {
  constructor(message = 'BadRequestException') {
    super(message);
    this.statusCode = statusCodes.BAD_REQUEST;
  }
}

export class UnAuthorizationException extends Error {
  constructor(message = 'UnAuthorizationException') {
    super(message);
    this.statusCode = statusCodes.UNAUTHORIZED;
  }
}

export class ForbiddenException extends Error {
  constructor(message = 'ForbiddenException') {
    super(message);
    this.statusCode = statusCodes.FORBIDDEN;
  }
}
