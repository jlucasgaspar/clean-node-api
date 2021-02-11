const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
    constructor(authUseCase) {
        this.authUseCase = authUseCase
    }

    route(httpRequest) {
        if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.auth) {
            return HttpResponse.serverError()
        }

        const { email, password } = httpRequest.body

        if (!email) {
            return HttpResponse.badRequest('email')
        }

        if (!password) {
            return HttpResponse.badRequest('password')
        }

        if (email === 'invalid_email@gmail.com' || password === 'invalid_password') {
            return HttpResponse.unauthorizedError()
        }

        this.authUseCase.auth(email, password)
    }
}