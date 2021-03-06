const { MissingParamError } = require('../../utils/errors')
const mongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let db

const makeSut = () => {
    const userModel = db.collection('users')

    const sut = new LoadUserByEmailRepository(userModel)

    return { sut, userModel }
}

describe('LoadUserByEmail Repository', () => {
    beforeAll(async () => {
        await mongoHelper.connect(process.env.MONGO_URL)

        db = await mongoHelper.getDb()
    })
    beforeEach(async () => {
        await db.collection('users').deleteMany()
    })
    afterAll(async () => {
        await mongoHelper.disconnect()
    })

    test('Should return null if no user is found', async () => {
        const { sut } = makeSut()

        const user = await sut.load('invalid_email@mail.com')

        expect(user).toBe(null)
    })

    test('Should return an user if user is found', async () => {
        const { sut, userModel } = makeSut()

        const fakeUser = await userModel.insertOne({
            email: 'valid_email@mail.com',
            name: 'any_name',
            age: 50,
            state: 'any_state',
            password: 'hashed_password'
        })

        const user = await sut.load('valid_email@mail.com')

        expect(user).toEqual({
            _id: fakeUser.ops[0]._id,
            password: fakeUser.ops[0].password
        })
    })

    test('Should throw if no userModel is provided', async () => {
        const sut = new LoadUserByEmailRepository()

        const promise = sut.load('any_email@mail.com')

        expect(promise).rejects.toThrow()
    })

    test('Should throw if no email is provided', async () => {
        const { sut } = makeSut()

        const promise = sut.load() // sem email

        expect(promise).rejects.toThrow(new MissingParamError('email'))
    })
})