const express = require('express')
const router = express.Router()

module.exports = () => {
    const router = new SignUpRouter()

    router.post('/signup', ExpressRouterAdapter.adapt(router))
}

class ExpressRouterAdapter {
    static adapt(router) {
        return async (req, res) => {
            const httpRequest = {
                body: req.body
            }

            const httpResponse = await router.route(httpRequest)

			res.status(httpResponse.statusCode).json(httpResponse.body)
        }
    }
}


// Presentation
// Signup Router
class SignUpRouter {
    async route (httpRequest) {
        const { email, password, repeatPassword } = httpRequest.body

        const user = new SignUpUseCase().signUp(email, password, repeatPassword)

		return {
			statusCode: 200,
			body: user
		}
    }
}


// Domain
// Signup usecase
class SignUpUseCase {
    async signUp(email, password, repeatPassword) {
        if (password === repeatPassword) {
            const user = new AddAccountRepository().add(email, password)
            
            return user
        }
    }
}


// Infra
// Add Account Repository
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

class AddAccountRepository {
    async add(email, password) {
        const user = await AccountModel.create({ email, password })

        return user
    }
}