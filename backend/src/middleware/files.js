var multer = require('multer');
const file = multer({
    storage: multer.memoryStorage()
})

module.exports = file;