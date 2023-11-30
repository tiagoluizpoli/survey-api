import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data';
import { AddSurveyModel, SurveyModel } from '@/domain';
import { MongoHelper } from '../helpers';
import { ObjectId, WithId } from 'mongodb';

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
    return surveys.map((s) => MongoHelper.map<SurveyModel>(s as WithId<SurveyModel>));
  };

  loadById = async (id: string): Promise<SurveyModel | null> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) });

    return MongoHelper.map<SurveyModel>(survey as WithId<SurveyModel>);
  };
}
