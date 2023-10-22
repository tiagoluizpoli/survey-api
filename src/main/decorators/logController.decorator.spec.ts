import { Controller, HttpRequest, HttpResponse } from '../../presentation';
import { LogControllerDecorator } from './logController.decorator';

describe('LogController Decorator', () => {
  it('should call controller handle', async () => {
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
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const sut = new LogControllerDecorator(controllerStub);
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
});
