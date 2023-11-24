// import { ObjectId, WithId } from 'mongodb';
import { AddSurveyRepository } from '../../../../data';
import { AddSurveyModel } from '../../../../domain';
import { MongoHelper } from '../helpers';

export class SurveyMongoRepository implements AddSurveyRepository {
  constructor() {}
  add = async (surveyData: AddSurveyModel): Promise<void> => {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  };
}
