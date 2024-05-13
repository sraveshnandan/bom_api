const ErrorMiddleware = (err: any, req: any, res: any, next: () => void) => {
  err.message = "Internal Server error.";
  err.statusCode = 500;

  //Duplicate key error
  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate field - ${error}`;
    err.statusCode = 400;
  }

  //Mongodb Cast Error
  if (err.name === "CastError") {
    const errorPath = err.path;
    err.message = `Invalid Format of ${errorPath}`;
    err.statusCode = 400;
  }

  // Wrong Jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Your url is invalid please try again`;
    err.message = message;
    err.statusCode = 400;
  }

  //Jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = `Your url is expired please try again`;
    err.message = message;
    err.statusCode = 401;
  }

  // Final Error responce
  const responce = {
    success: false,
    message: err.message,
  };

  return res.status(err.statusCode).json(responce);
};

// Function to catch all async errors

const CatchAsyncError =
  (passedFunction: (req: any, res: any, next: (error: any) => void) => void) =>
  async (req: any, res: any, next: (error: any) => void) => {
    try {
      await passedFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
export { ErrorMiddleware, CatchAsyncError };
