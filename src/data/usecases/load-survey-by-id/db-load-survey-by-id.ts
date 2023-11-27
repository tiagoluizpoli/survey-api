import { LoadSurveyByIdRepository } from '@/data';
import { LoadSurveyById, SurveyModel } from '@/domain';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(private readonly loadSurveyById: LoadSurveyByIdRepository) {}

  loadById = async (id: string): Promise<SurveyModel> => {
    const survey = await this.loadSurveyById.loadById(id);

    return survey;
  };
}
