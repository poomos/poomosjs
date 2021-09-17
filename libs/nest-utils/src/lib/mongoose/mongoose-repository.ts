import * as mongoose from 'mongoose';
import {
  AnyKeys,
  AnyObject,
  Document,
  DocumentDefinition,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { IConnectionPager, ICursorArgs, ICursorInfo } from '@poomosjs/core';

export abstract class MongooseRepository<
  TDoc extends Document,
  TFilter extends Record<string, any>,
  TModel extends Model<TDoc> = Model<TDoc>
> {
  constructor(protected Model: TModel) {}

  async findAll(filter: TFilter, sort: string, limit = 100): Promise<TDoc[]> {
    return this.Model.find({
      ...this.transformFilter(filter),
    })
      .sort(this.transformSort(sort))
      .limit(limit)
      .exec();
  }

  async findWithIds(
    ids: string[],
    filter: TFilter,
    sort: string,
    limit = 100
  ): Promise<TDoc[]> {
    return this.Model.find({
      _id: { $in: ids },
      ...this.transformFilter(filter),
    })
      .sort(this.transformSort(sort))
      .limit(limit)
      .exec();
  }
  async findOneById(id: string, filter: TFilter): Promise<TDoc> {
    return this.Model.findOne(
      {
        ...this.transformFilter(filter),
        _id: id,
      },
      {}
    ).exec();
  }

  async findOne(filter: TFilter): Promise<TDoc> {
    return this.Model.findOne(this.transformFilter(filter)).exec();
  }

  async createOne(create: AnyKeys<TDoc> & AnyObject): Promise<TDoc> {
    const created = new this.Model(create);
    return created.save();
  }

  async updateOne(
    update: UpdateQuery<TDoc>,
    filter: TFilter,
    options: QueryOptions = {}
  ): Promise<TDoc> {
    return await this.Model.findOneAndUpdate(
      {
        ...this.transformFilter(filter),
      },
      update,
      { new: true, ...options }
    ).exec();
  }

  async findOneAndUpdate(
    id: string,
    update: UpdateQuery<TDoc>,
    filter: TFilter
  ): Promise<{ previous: TDoc; next: TDoc }> {
    const result = { previous: null, next: null };
    const previous = await this.Model.findOne({
      ...this.transformFilter(filter),
      _id: id,
    });
    result.previous = previous;
    if (previous) {
      result.next = await this.Model.findOneAndUpdate(
        {
          ...this.transformFilter(filter),
          _id: id,
        },
        update,
        { new: true }
      ).exec();
    }
    return result;
  }

  async deleteOne(id: string, filter: TFilter): Promise<TDoc> {
    return this.Model.findOneAndDelete({
      ...this.transformFilter(filter),
      _id: id,
    }).exec();
  }

  async findWithConnection(
    filter: TFilter,
    sort: string,
    { first, last, before, after }: ICursorArgs
  ): Promise<IConnectionPager<TDoc>> {
    const cursorInfo: ICursorInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
    };
    let baseQuery = this.Model.find({ ...this.transformFilter(filter) });

    const cloneQuery = this.Model.find({
      ...this.transformFilter(filter),
    });
    const count = await cloneQuery.count();

    const idQuery = {
      ...(before ? { $lt: new mongoose.Types.ObjectId(before) } : {}),
      ...(after ? { $gt: new mongoose.Types.ObjectId(after) } : {}),
    };

    const paginateFilter = {
      ...(Object.keys(idQuery).length === 0 ? {} : { _id: idQuery }),
    };

    baseQuery = baseQuery.find(paginateFilter as any);

    let paginateQueryResult;
    if (first !== undefined && first !== null) {
      paginateQueryResult = await baseQuery
        .sort({ _id: 1 })
        .limit(first + 1)
        .exec();
      if (paginateQueryResult.length > first) {
        cursorInfo.hasNextPage = true;
        paginateQueryResult.pop();
      }
    } else if (last !== undefined && last !== null) {
      paginateQueryResult = await baseQuery
        .sort({ _id: -1 })
        .limit(last + 1)
        .exec();
      if (paginateQueryResult.length > last) {
        cursorInfo.hasPreviousPage = true;
        paginateQueryResult.pop();
      }
      paginateQueryResult.reverse();
    } else {
      paginateQueryResult = await baseQuery.sort({ _id: 1 }).exec();
    }

    if (paginateQueryResult.length > 0) {
      cursorInfo.startCursor = paginateQueryResult[0]._id.toString();
      cursorInfo.endCursor =
        paginateQueryResult[paginateQueryResult.length - 1]._id.toString();
    }

    return {
      totalCount: count,
      nodes: paginateQueryResult.map((edge) => edge),
      edges: paginateQueryResult.map((edge) => ({
        cursor: edge._id.toString(),
        node: edge,
      })),
      cursorInfo,
    };
  }

  abstract transformFilter(filter: TFilter): FilterQuery<TDoc>;

  abstract transformSort(sort: string): string | Record<string, any>;
}
