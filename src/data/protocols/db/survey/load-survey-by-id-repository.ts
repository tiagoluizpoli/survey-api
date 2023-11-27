import { SurveyModel } from '@/domain';

export interface LoadSurveyByIdRepository {
  loadById: (id: string) => Promise<SurveyModel>;
}
