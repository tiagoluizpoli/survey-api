import { LogErrorRepository } from '../../data';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  serverError,
} from '../../presentation';
import { LogControllerDecorator } from './logController.decorator';

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorStub implements LogErrorRepository {
    log = async (stack: string): Promise<void> => {
      stack;
      return Promise.resolve(undefined);
    };
  }
  return new LogErrorStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
      httpRequest;
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Tiago',
        },
      };
      return new Promise((resolve) => resolve(httpResponse));
    };
  }
  return new ControllerStub();
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

    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Tiago',
      },
    });
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(error));
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
