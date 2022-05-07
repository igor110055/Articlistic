'use strict'

module.exports.users = require('./models/user');
module.exports.categories = require('./models/category');
module.exports.writers = require('./models/writer');
module.exports.email = require('./models/email')
module.exports.articles = require('./models/article');
module.exports.analytics = require('./models/analytics');
module.exports.chats = require('./models/chat');
module.exports.publications = require('./models/publication');
module.exports.selection = require('./models/selection');
module.exports.followers = require('./models/follower');
module.exports.bookmarks = require('./models/bookmarks');
module.exports.walletAdd = require('./models/wallet-add');
module.exports.dollarValue = require('./models/dollar-value');
module.exports.bookmarks = require('./models/bookmarks')
module.exports.security = require('./models/security');

module.exports.transactionsUserAnalytics = require('./transactions/user-analytics');
module.exports.transactionArticleChat = require('./transactions/article-chat');
module.exports.transactionWriterUser = require('./transactions/user-writer')
module.exports.transactionArticleCategory = require('./transactions/article-category')
module.exports.transactionPublicationWriter = require('./transactions/writer-publication');
module.exports.transactionWalletAddUser = require('./transactions/walletadd-user');
module.exports.transactionWalletTip = require('./transactions/txns-user-writer');
module.exports.transactionWalletEarnings = require('./transactions/txns-user-wallet-earnings');
module.exports.transactionUserPayout = require('./transactions/userWallet-payouts');