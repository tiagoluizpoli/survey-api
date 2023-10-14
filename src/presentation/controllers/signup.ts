export class SignUpController {
  handle = (httpRequest: unknown): unknown => {
    return {
      httpRequest,
      statusCode: 400,
    };
  };
}
