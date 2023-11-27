import { AddSurveyRepository, LoadSurveysRepository } from '@/data';
import { AddSurveyModel, SurveyModel } from '@/domain';
import { MongoHelper } from '../helpers';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  constructor() {}
  add = async (surveyData: AddSurveyModel): Promise<void> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  };

  loadAll = async (): Promise<SurveyModel[]> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray();
    return surveys.map((s) => ({
      id: s._id.toString(),
      question: s.question,
      answers: s.answers,
      date: s.date,
    }));
  };
}
