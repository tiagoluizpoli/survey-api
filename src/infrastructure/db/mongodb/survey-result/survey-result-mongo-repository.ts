import { SaveSurveyResultRepository } from '@/data';
import { SaveSurveyResultParams, SurveyResultModel } from '@/domain';
import { MongoHelper } from '../helpers';
import { ObjectId } from 'mongodb';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  constructor() {}
  save = async (data: SaveSurveyResultParams): Promise<SurveyResultModel> => {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId),
      },
      {
        $set: {
          answer: data.answer,
          date: data.date,
        },
      },
      {
        upsert: true,
      },
    );

    const surveyResult = await this.loadBySurveyId(data.surveyId);

    return surveyResult;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private loadBySurveyId = async (surveyId: string): Promise<SurveyResultModel> => {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    const query = surveyResultCollection.aggregate<SurveyResultModel>([
      {
        $match: {
          surveyId: new ObjectId(surveyId),
        },
      },
      {
        $group: {
          _id: 0,
          data: {
            $push: '$$ROOT',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $unwind: {
          path: '$data',
        },
      },
      {
        $addFields: { surveyId: { $toObjectId: '$data.surveyId' } },
      },
      {
        $lookup: {
          from: 'surveys',
          localField: 'surveyId',
          foreignField: '_id',

          as: 'survey',
        },
      },
      {
        $unwind: {
          path: '$survey',
        },
      },
      {
        $group: {
          _id: {
            surveyId: '$survey._id',
            question: '$survey.question',
            date: '$survey.date',
            total: '$count',
            answer: {
              $filter: {
                input: '$survey.answers',
                as: 'item',
                cond: {
                  $eq: ['$$item.answer', '$data.answer'],
                },
              },
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $unwind: {
          path: '$_id.answer',
        },
      },
      {
        $addFields: {
          '_id.answer.count': '$count',
          '_id.answer.percent': {
            $multiply: [
              {
                $divide: ['$count', '$_id.total'],
              },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            surveyId: '$_id.surveyId',
            question: '$_id.question',
            date: '$_id.date',
          },
          answers: {
            $push: '$_id.answer',
          },
        },
      },
      {
        $project: {
          _id: 0,
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: '$answers',
        },
      },
    ]);

    const surveyResult = await query.toArray();
    return surveyResult[0];
  };
}
