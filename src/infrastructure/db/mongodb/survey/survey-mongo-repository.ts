import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data';
import { AddSurveyModel, SurveyModel } from '@/domain';
import { MongoHelper } from '../helpers';
import { ObjectId } from 'mongodb';

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository
{
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

  loadById = async (id: string): Promise<SurveyModel> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });
    if (!survey) {
      throw new Error(`survey with the id: ${id} not found`);
    }
    return {
      id: survey._id.toString(),
      question: survey.question,
      answers: survey.answers,
      date: survey.date,
    };
  };
}
