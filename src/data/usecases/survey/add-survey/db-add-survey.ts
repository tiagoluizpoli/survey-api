import { AddSurvey, AddSurveyModel } from '@/domain';
import { AddSurveyRepository } from '@/data';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}
  add = async (data: AddSurveyModel): Promise<void> => {
    data;
    await this.addSurveyRepository.add(data);
  };
}
