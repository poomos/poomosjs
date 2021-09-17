import drop from 'lodash/drop';
import dropRight from 'lodash/dropRight';
import head from 'lodash/first';
import tail from 'lodash/last';
import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';

export default () => {
  return function (query = {}, args = {}) {
    return new Promise(async (resolve, reject) => {
      if (args.first !== undefined && args.last !== undefined) {
        return reject(
          new TypeError('first and last cannot be set at the same time.')
        );
      }

      let { after, before } = args;

      query = { $and: [query] };

      const anyCursor = after || before;
      if (args.filters || (anyCursor && anyCursor.filters)) {
        const filtersToUse =
          anyCursor && anyCursor.filters ? anyCursor.filters : args.filters;
        forEach(filtersToUse, (value, name) => {
          let condition = { [name]: value };
          query.$and.push(condition);
        });
      }

      const totalCount = await this.countDocuments(query);
      const { first, last } = args;
      const limit = first || last || 1000;
      const isDescSort = args.sort && args.sort.order === 'desc';
      var hasNextPage = false,
        hasPreviousPage = false;
      var skip = 0;
      var sort = {};

      const buildCursorCondition = (cursor, way) => {
        if (cursor.sort) {
          let {
            _id,
            sort: { field, value },
          } = cursor;
          return {
            $or: [
              {
                [field]: { [way]: value },
              },
              {
                [field]: value,
                _id: { [way]: _id },
              },
            ],
          };
        }

        return { _id: { [way]: cursor._id } };
      };

      var dataQuery = query;
      if (after) {
        dataQuery.$and.push(
          buildCursorCondition(after, isDescSort ? '$lt' : '$gt')
        );
        hasPreviousPage = true;
      }

      if (before) {
        dataQuery.$and.push(
          buildCursorCondition(before, isDescSort ? '$gt' : '$lt')
        );
        hasNextPage = true;
      }

      const hasOffset = !(hasNextPage && hasPreviousPage);

      if (last) {
        let offset = totalCount - last - (hasOffset ? 1 : 0);
        if (before) {
          const dataCount = await this.countDocuments(dataQuery);
          offset = dataCount - last - 1;
        }
        skip = offset < 0 ? 0 : offset;
      }

      if (args.sort) {
        let { order } = args.sort;
        sort = {
          [args.sort.by]: order,
          _id: order,
        };
      }

      let data = await this.find(dataQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit + (hasOffset ? 1 : 0));

      if (hasOffset && data.length > limit) {
        if (first) {
          hasNextPage = true;
        }

        if (last) {
          hasPreviousPage = true;
        }

        if (first || after) {
          data = dropRight(data);
        } else if (last || before) {
          data = drop(data);
        }
      }

      const edges = data.map((v) => ({
        cursor: generateCursor(v, args.sort, args.filters),
        node: v,
      }));

      resolve({
        totalCount,
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: head(edges) ? head(edges).cursor : null,
          endCursor: tail(edges) ? tail(edges).cursor : null,
        },
        edges,
      });
    });
  };
};
