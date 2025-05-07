import {
    ForbiddenException,
    UnAuthorizationException,
  } from "./exception.helper";
  import { responseError } from "./response.helpers";
  import jwt from "jsonwebtoken";
  
  export const handleError = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    if (err instanceof jwt.JsonWebTokenError) {
      statusCode = new UnAuthorizationException().statusCode; //403 => FE logout
    }
  
    if (err instanceof jwt.TokenExpiredError) {
      statusCode = new ForbiddenException().statusCode; //401 => FE refresh token
    }
  
    // (new Error()).
    const response = responseError(err.message, err.statusCode, err.stack);
    res.status(response.statusCode).json(response);
  };
  