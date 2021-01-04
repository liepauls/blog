module.exports = (Model, field) => {
  return async (value) => {
    const instance = await Model.findOne({ where: { [field]: value } })

    if (instance) {
      throw new Error('must be unique')
    }
  }
}
