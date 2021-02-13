const jwt = require('jsonwebtoken')

class TokenGenerator {
    async generate(id) {
        return jwt.sign(id, 'SECRET_KEY')
    }
}

const makeSut = () => {
    return new TokenGenerator()
}

describe('Token Generator', () => {
    test('should return null if JWT returns null', async () => {
        const sut = makeSut()

        jwt.token = null

        const token = await sut.generate('any_id')

        expect(token).toBe(null)
    })

    test('should return a token if JWT returns a token', async () => {
        const sut = makeSut()

        const token = await sut.generate('any_id')

        expect(token).toBe(jwt.token)
    })
})