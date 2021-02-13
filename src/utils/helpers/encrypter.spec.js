const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')

const makeSut = () => {
    return new Encrypter()
}

describe('Encrypter', () => {
    test('Should return true if bcrypt returns true', async () => {
        const sut = makeSut()
        const isValid = await sut.compare('any_string', 'hashed_string')
        expect(isValid).toBe(true)
    })

    test('Should return false if bcrypt returns false', async () => {
        const sut = makeSut()
        bcrypt.isValid = false
        const isValid = await sut.compare('any_string', 'hashed_string')
        expect(isValid).toBe(false)
    })

    test('Should call bcrypt with correct values', async () => {
        const sut = makeSut()
        await sut.compare('any_string', 'hashed_string')
        expect(bcrypt.value).toBe('any_string')
        expect(bcrypt.hash).toBe('hashed_string')
    })
})