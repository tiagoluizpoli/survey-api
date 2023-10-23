import { Controller, HttpRequest, HttpResponse } from '../../presentation';
import { LogControllerDecorator } from './logController.decorator';

interface makeSutResult {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

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

const makeSut = (): makeSutResult => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub,
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
});
