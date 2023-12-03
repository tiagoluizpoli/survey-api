import { AddSurvey, AddSurveyParams } from '@/domain';
import { AddSurveyRepository } from '@/data';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}
  add = async (data: AddSurveyParams): Promise<void> => {
    data;
    await this.addSurveyRepository.add(data);
  };
}
