const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-use-case')

const makeEncrypterSpy = () => {
    class EncrypterSpy {
        async hash() {

        }

        async compare(password, hashedPassword) {
            this.password = password
            this.hashedPassword = hashedPassword
            
            return this.isValid
        }
    }

    const encrypterSpy = new EncrypterSpy()

    encrypterSpy.isValid = true

    return encrypterSpy
}

const makeLoadUserByEmailRepositorySpy = () => {''
    class LoadUserByEmailRepositorySpy {
        async load(email) {
            this.email = email

            return this.user
        }
    }

    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
    
    loadUserByEmailRepositorySpy.user = {
        id: 'any_id',
        password: 'hashed_password'
    }

    return loadUserByEmailRepositorySpy
}

const makeTokenGeneratorSpy = () => {
    class TokenGeneratorSpy {
        async generate(userId) {
            this.userId = userId

            return this.accessToken
        }
    }

    const tokenGeneratorSpy = new TokenGeneratorSpy()

    tokenGeneratorSpy.accessToken = 'any_token'

    return tokenGeneratorSpy
}

const makeSut = () => {
    const encrypterSpy = makeEncrypterSpy()
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy()
    const tokenGeneratorSpy = makeTokenGeneratorSpy()
    
    const sut = new AuthUseCase({
        loadUserByEmailRepository: loadUserByEmailRepositorySpy,
        encrypter: encrypterSpy,
        tokenGenerator: tokenGeneratorSpy
    })

    return {
        sut,
        loadUserByEmailRepositorySpy,
        encrypterSpy,
        tokenGeneratorSpy
    }
}

describe('Auth UseCase', () => {
    test('Should return null if no email is provided', async () => {
        const { sut } = makeSut()

        const promise = sut.auth()

        expect(promise).rejects.toThrow(new MissingParamError('email'))
    })

    test('Should return null if no password is provided', async () => {
        const { sut } = makeSut()

        const promise = sut.auth('any_email@gmail.com')

        expect(promise).rejects.toThrow(new MissingParamError('password'))
    })

    test('Should call LoadUserByEmailRepository with correct email', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut()

        await sut.auth('any_email@gmail.com', 'any_password')

        expect(loadUserByEmailRepositorySpy.email).toBe('any_email@gmail.com')
    })

    test('Should throw if no LoadUserByEmailRepository is provided', async () => {
        const sut = new AuthUseCase({})

        const promise = sut.auth('any_email@gmail.com', 'any_password')

        expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
    })

    test('Should throw if LoadUserByEmailRepository has no load method', async () => {
        const sut = new AuthUseCase({ loadUserByEmailRepository: {} }) // Obj vazio quer dizer que é uma instancia inválida do LoadUserByEmailRepository

        const promise = sut.auth('any_email@gmail.com', 'any_password')

        expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailRepository'))
    })

    test('Should return null if an invalid email is provided', async () => {
        const { sut, loadUserByEmailRepositorySpy } = makeSut()

        loadUserByEmailRepositorySpy.user = null

        const accessToken = await sut.auth('invalid_email@gmail.com', 'any_password')

        expect(accessToken).toBe(null)
    })

    test('Should return null if an invalid password is provided', async () => {
        const { sut, encrypterSpy } = makeSut()
        
        encrypterSpy.isValid = false

        const accessToken = await sut.auth('valid_email@gmail.com', 'invalid_password')

        expect(accessToken).toBeNull()
    })

    test('Should call Encrypter with correct values', async () => {
        const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()

        await sut.auth('valid_email@gmail.com', 'any_password')

        expect(encrypterSpy.password).toBe('any_password')
        expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
    })
    
    test('Should call TokenGenerator with correct userId', async () => {
        const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()

        await sut.auth('valid_email@gmail.com', 'valid_password')

        expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    })

    test('Should return accessToken if correct credentials are provided', async () => {
        const { sut, tokenGeneratorSpy } = makeSut()

        const accessToken = await sut.auth('valid_email@gmail.com', 'valid_password')

        expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
        expect(accessToken).toBeTruthy() // Pra garantir que não seja null, undefined, vazio ou 0
    })
})