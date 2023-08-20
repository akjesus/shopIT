/* eslint-disable node/no-unsupported-features/es-syntax */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: new RegExp(`${this.queryString.keyword}`, "i"), // case insensitive regex
          },
        }
      : {};
    this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "keyword"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1b) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate(rpp) {
    const page = this.queryString.page * 1 || 1;
    const skip = (page - 1) * rpp;

    this.query = this.query.limit(rpp).skip(skip);
    return this;
  }
}
module.exports = APIFeatures;
