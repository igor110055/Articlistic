'use strict'

module.exports.users = require('./models/user');
module.exports.categories = require('./models/category');
module.exports.writers = require('./models/writer');
module.exports.blacklist = require('./models/blacklist');
module.exports.email = require('./models/email')
module.exports.articles = require('./models/article');
module.exports.analytics = require('./models/analytics');
module.exports.chats = require('./models/chat');
module.exports.publications = require('./models/publication');
module.exports.selection = require('./models/selection');
module.exports.followers = require('./models/follower');
module.exports.bookmarks = require('./models/bookmarks')

module.exports.transactionsUserAnalytics = require('./transactions/user-analytics');
module.exports.transactionsUserArticles = require('./transactions/article-user');
module.exports.transactionArticleChat = require('./transactions/article-chat');
module.exports.transactionWriterUser = require('./transactions/user-writer')
module.exports.transactionArticleCategory = require('./transactions/article-category')
module.exports.transactionPublicationWriter = require('./transactions/writer-publication');