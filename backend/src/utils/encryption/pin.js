const bcryptjs = require('bcryptjs');

module.exports = class Pin {

    /**
     * It hashes the Pin using the bcryptjs library.
     * @param pin - The Pin to be hashed.
     * @returns The hash.
     */

    static async hash(pin) {
        let hash = await bcryptjs.hash(pin, 8);
        return hash;
    }

    /**
     * It compares the Pin that the user has entered with the Pin that is stored in the database.
     * @param requestPin - The Pin that the user has entered.
     * @param dbPin - The Pin stored in the database.
     * @returns The `compare` function returns a `Promise` object.
     */

    static async compare(requestPin, dbPin) {
        var res = await bcryptjs.compare(requestPin, dbPin);
        if (!res) throw new Error("PIN is wrong");
        return true;
    }
}