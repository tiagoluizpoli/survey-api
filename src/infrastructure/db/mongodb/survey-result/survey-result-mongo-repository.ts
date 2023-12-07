import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data';
import { SaveSurveyResultParams, SurveyResultModel } from '@/domain';
import { MongoHelper, QueryBuilder } from '../helpers';
import { ObjectId } from 'mongodb';

export class SurveyResultMongoRepository
  implements SaveSurveyResultRepository, LoadSurveyResultRepository
{
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
  loadBySurveyId = async (surveyId: string): Promise<SurveyResultModel> => {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId),
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT',
        },
        total: {
          $sum: 1,
        },
      })
      .unwind({
        path: '$data',
      })
      .addFields({ surveyId: { $toObjectId: '$data.surveyId' } })
      .lookup({
        from: 'surveys',
        localField: 'surveyId',
        foreignField: '_id',

        as: 'survey',
      })
      .unwind({
        path: '$survey',
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers',
        },
        count: {
          $sum: 1,
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.surveyId',
        date: '$_id.surveyId',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: '$count',
                      else: 0,
                    },
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer'],
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total'],
                          },
                          100,
                        ],
                      },
                      else: 0,
                    },
                  },
                },
              ],
            },
          },
        },
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answers',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.surveyId',
        date: '$_id.surveyId',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this'],
            },
          },
        },
      })
      .unwind({
        path: '$answers',
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image',
        },
        count: {
          $sum: '$answers.count',
        },
        percent: {
          $sum: '$answers.percent',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.surveyId',
        date: '$_id.surveyId',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: '$count',
          percent: '$percent',
        },
      })
      .sort({
        'answer.count': -1,
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answer',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.surveyId',
        date: '$_id.surveyId',
        answers: '$answers',
      })
      .build();

    const surveyResult = await surveyResultCollection.aggregate<SurveyResultModel>(query).toArray();
    return surveyResult[0];
  };
}
