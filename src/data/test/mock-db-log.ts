import { LogErrorRepository } from '@/data';

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorStub implements LogErrorRepository {
    logError = async (stack: string): Promise<void> => {
      stack;
      return Promise.resolve(undefined);
    };
  }
  return new LogErrorStub();
};
