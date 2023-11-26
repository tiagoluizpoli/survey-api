import { SurveyModel } from '../../../../domain';

export interface LoadSurveysRepository {
  loadAll: () => Promise<SurveyModel[]>;
}
