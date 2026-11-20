class AbstractRepository {
  constructor(model) {
    this.model = model;
  }

  // Find one document
  async findOne(filter) {
    return await this.model.findOne(filter);
  }

  // Find document by ID
  async findById(id) {
    return await this.model.findById(id);
  }

  // Find all documents
  async findAll(filter = {}) {
    return await this.model.find(filter);
  }

  // Create document
  async create(data) {
    return await this.model.create(data);
  }

  // Update document by ID
  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // Delete document by ID
  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  // Count documents
  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  // Check if document exists
  async exists(filter) {
    return await this.model.exists(filter);
  }
}

export default AbstractRepository;