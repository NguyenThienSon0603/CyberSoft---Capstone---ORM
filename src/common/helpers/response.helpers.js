export const responseSuccess = (
    data = null,
    message = "OK",
    statusCode = 200
  ) => {
    //200: thanh cong
    //400: that bai
    //404: not found
    //500: server error
    return {
      status: "success",
      statusCode: statusCode,
      message: message,
      data: data,
      doc: "domain.com/doc-api",
    };
  };
  
  export const responseError = (
    message = "Internal Server Error",
    statusCode = 500,
    stack
  ) => {
    return {
      status: "Error",
      statusCode: statusCode,
      message: message,
      stack: stack,
    };
  };
  