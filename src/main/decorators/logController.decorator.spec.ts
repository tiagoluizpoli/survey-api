import { LogErrorRepository } from '@/data';

import { Controller, HttpRequest, HttpResponse, ok, serverError } from '@/presentation';
import { LogControllerDecorator } from './logController.decorator';
import { mockAccountData } from '@/domain/test';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorStub implements LogErrorRepository {
    logError = async (stack: string): Promise<void> => {
      stack;
      return Promise.resolve(undefined);
    };
  }
  return new LogErrorStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
      const { accountMock } = mockAccountData();
      httpRequest;
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: accountMock,
      };
      return Promise.resolve(httpResponse);
    };
  }
  return new ControllerStub();
};

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};
interface makeSutResult {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorStub: LogErrorRepository;
}

const makeSut = (): makeSutResult => {
  const controllerStub = makeController();
  const logErrorStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorStub);
  return {
    sut,
    controllerStub,
    logErrorStub,
  };
};

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const { accountMock } = mockAccountData();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(accountMock));
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorStub } = makeSut();

    const logSpy = jest.spyOn(logErrorStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(makeFakeServerError()));

    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
