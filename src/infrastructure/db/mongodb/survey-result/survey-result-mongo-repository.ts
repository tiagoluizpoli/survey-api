import { SaveSurveyResultRepository } from '@/data';
import { SaveSurveyResultParams, SurveyResultModel } from '@/domain';
import { MongoHelper } from '../helpers';
import { WithId } from 'mongodb';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  constructor() {}
  save = async (data: SaveSurveyResultParams): Promise<SurveyResultModel> => {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    const res = await surveyResultCollection.findOneAndUpdate(
      <WithId<SurveyResultModel>>{
        surveyId: data.surveyId,
        accountId: data.accountId,
      },
      {
        $set: <WithId<SurveyResultModel>>{
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      },
    );

    return MongoHelper.map<SurveyResultModel>(res.value as WithId<SurveyResultModel> | null);
  };
}
