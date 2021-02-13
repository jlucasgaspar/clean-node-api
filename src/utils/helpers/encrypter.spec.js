const bcrypt = require('bcrypt')

class Encrypter {
    async compare(string, hashedString) {
        const isValid = await bcrypt.compare(string, hashedString)

        return isValid
    }
}

describe('Encrypter', () => {
    test('Should return true if bcrypt returns true', async () => {
        const sut = new Encrypter()
        const isValid = await sut.compare('any_string', 'hashed_string')
        expect(isValid).toBe(true)
    })

    test('Should return false if bcrypt returns false', async () => {
        const sut = new Encrypter()
        bcrypt.isValid = false
        const isValid = await sut.compare('any_string', 'hashed_string')
        expect(isValid).toBe(false)
    })

    test('Should call bcrypt with correct values', async () => {
        const sut = new Encrypter()
        await sut.compare('any_string', 'hashed_string')
        expect(bcrypt.value).toBe('any_string')
        expect(bcrypt.hash).toBe('hashed_string')
    })
})