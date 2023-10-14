export class SignUpController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle = (httpRequest: any): any => {
    return {
      httpRequest,
      statusCode: 400,
      body: new Error('Missing param: name'),
    };
  };
}
