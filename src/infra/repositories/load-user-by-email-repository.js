const { MissingParamError } = require("../../utils/errors")

module.exports = class LoadUserByEmailRepository {
    constructor (userModel) {
        this.userModel = userModel
    }

    async load(email) {
        if (!email) {
            throw new MissingParamError('email')
        }

        const user = await this.userModel.findOne({ email: email }, {
            projection: {
                password: 1 // Quero id e password, mas o id já vem por padrão
            }
        })

        return user
    }
}