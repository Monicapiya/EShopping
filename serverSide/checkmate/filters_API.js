class FiltersAPI {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: 'i',
      }
    } : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filters() {
    const productWise = { ...this.queryStr };

    // Categories to remove
    const categoriesToRemove = ['keyword', 'page'];
    categoriesToRemove.forEach((category) => delete productWise[category]);

    let queryStr = JSON.stringify(productWise);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default FiltersAPI;
