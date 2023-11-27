import { SurveyModel } from '../models';

export interface LoadSurveyById {
  loadById: (id: string) => Promise<SurveyModel>;
}
