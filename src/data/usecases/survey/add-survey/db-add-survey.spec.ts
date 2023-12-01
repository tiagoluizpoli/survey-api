import { AddSurvey } from '@/domain';
import { DbAddSurvey } from './db-add-survey';
import { AddSurveyRepository } from '@/data';

import mockDate from 'mockdate';
import { mockSurveyData } from '@/domain/test';
import { mockAddSurvayRepository } from '@/data/test';

interface MakeSutResult {
  sut: AddSurvey;
  addSurvayRepositoryStub: AddSurveyRepository;
}

const makeSut = (): MakeSutResult => {
  const addSurvayRepositoryStub = mockAddSurvayRepository();
  const sut = new DbAddSurvey(addSurvayRepositoryStub);

  return { sut, addSurvayRepositoryStub };
};

describe('AddSurvey UseCase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });
  afterAll(() => {
    mockDate.reset();
  });
  it('shoud call AddSurveyRepository with correct values', async () => {
    // Arrange
    const { sut, addSurvayRepositoryStub } = makeSut();
    const { addSurveyMock } = mockSurveyData();
    const addSpy = jest.spyOn(addSurvayRepositoryStub, 'add');

    // Act
    await sut.add(addSurveyMock);

    // Assert
    expect(addSpy).toHaveBeenCalledWith(addSurveyMock);
  });

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurvayRepositoryStub } = makeSut();
    jest.spyOn(addSurvayRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));
    const { addSurveyMock } = mockSurveyData();

    const promise = sut.add(addSurveyMock);

    await expect(promise).rejects.toThrow();
  });
});
