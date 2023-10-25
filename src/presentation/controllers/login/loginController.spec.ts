import { Controller, HttpRequest } from '../../protocols';
import { LoginController } from './loginController';
import { HttpResponse } from '../../protocols/http/http';
import { badRequest } from '../../helpers';
import { MissingParamError } from '../../errors';

interface MakeSutResult {
  sut: Controller;
}
const makeSut = (): MakeSutResult => {
  const sut = new LoginController();
  return {
    sut,
  };
};

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpResponse: HttpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });
  // it('should return 400 if no password is provided', async () => {
  //   const { sut } = makeSut();
  //   const httpRequest: HttpRequest = {
  //     body: {
  //       email: 'any@email.com',
  //     },
  //   };
  //   const httpResponse: HttpResponse = await sut.handle(httpRequest);
  //   expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  // });
});
