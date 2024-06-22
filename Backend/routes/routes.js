module.exports = (app) => {
    app.get('/register', (req,res) => {
        require('../controllers/AuthController.js');
    })
}