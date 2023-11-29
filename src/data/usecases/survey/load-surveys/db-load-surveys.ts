import { LoadSurveys, SurveyModel } from '@/domain';
import { LoadSurveysRepository } from '@/data';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}
  load = async (): Promise<SurveyModel[] | null> => {
    const surveys = await this.loadSurveysRepository.loadAll();

    return surveys;
  };
}
