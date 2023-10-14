export class SignUpController {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle = (httpRequest: any): any => {
    if (!httpRequest.body.name) {
      return {
        httpRequest,
        statusCode: 400,
        body: new Error('Missing param: name'),
      };
    }
    if (!httpRequest.body.email) {
      return {
        httpRequest,
        statusCode: 400,
        body: new Error('Missing param: email'),
      };
    }
  };
}
