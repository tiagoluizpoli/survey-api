import { LoadSurveys, SurveyModel } from '../../../domain';
import { LoadSurveysRepository } from '../../protocols';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}
  load = async (): Promise<SurveyModel[] | null> => {
    await this.loadSurveysRepository.loadAll();

    return [];
  };
}
