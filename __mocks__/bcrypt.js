module.exports = {
    isValid: true,
    value: '',
    hash: '',

    async compare(string, hashedString) {
        this.value = string
        this.hash = hashedString
        
        return this.isValid
    }
}