/**
 * MongoDB collections. 
 */
const MDB_COLLECTION_USERS = 'users';
const MDB_COLLECTION_ARTICLES = 'articles';
const MDB_COLLECTION_PUBLICATIONS = 'publications';
const MDB_COLLECTION_CATEGORY = 'categories';
const MDB_COLLECTION_WRITERS = 'writers';
const MDB_COLLECTION_CHATS = 'chats';
const MDB_COLLECTION_ANALYTICS = 'analytics';
const MDB_COLLECTION_SELECTION = 'selection';
const MDB_COLLECTION_SECURITY = 'security';
const MDB_COLLECTION_FOLLOWERS = 'followers';
const MDB_COLLECTION_EMAIL = 'email';
const MDB_COLLECTION_BOOKMARKS = 'bookmarks';

const MDB_COLLECTION_EARNINGS_TO_WALLET = 'wallet-txn-earn-wallet';
const MDB_COLLECTION_INTERNAL_TRANSACTIONS = 'wallet-txn-internal';
const MDB_COLLECTION_WALLET_ADD = 'wallet-add';
const MDB_COLLECTION_WALLET_OUT = 'wallet-out';
const MDB_COLLECTION_DOLLAR_VALUE = 'dollar-value';

/**
 * Wallet related things. 
 */

const WALLET_ATT_CUT_RATE = 0.1; //10 Percent


/**
 * Misc
 */

const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024 // 5 mb.
const DELETE_AFTER_ARTICLE_TIMING = 21600000; //6 hours.
const DELETE_AFTER_PUBLICATION_TIMING = 86400000; //24 hours. 


module.exports = {
    MDB_COLLECTION_USERS,
    MDB_COLLECTION_ARTICLES,
    MDB_COLLECTION_PUBLICATIONS,
    MDB_COLLECTION_CATEGORY,
    MDB_COLLECTION_CHATS,
    MDB_COLLECTION_WRITERS,
    MDB_COLLECTION_INTERNAL_TRANSACTIONS,
    MDB_COLLECTION_ANALYTICS,
    MDB_COLLECTION_WALLET_ADD,
    MDB_COLLECTION_WALLET_OUT,
    MDB_COLLECTION_SELECTION,
    MDB_COLLECTION_SECURITY,
    MDB_COLLECTION_FOLLOWERS,
    MDB_COLLECTION_DOLLAR_VALUE,
    MDB_COLLECTION_EMAIL,
    MDB_COLLECTION_BOOKMARKS,
    MDB_COLLECTION_EARNINGS_TO_WALLET,
    WALLET_ATT_CUT_RATE,
    IMAGE_SIZE_LIMIT,
    DELETE_AFTER_ARTICLE_TIMING,
    DELETE_AFTER_PUBLICATION_TIMING
}