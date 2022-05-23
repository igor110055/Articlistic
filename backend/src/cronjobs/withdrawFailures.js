async function withdrawDatabaseFailureReverse() {
    /**
     * Algorithm: 
     * 1. Get all the files from s3. 
     * 2. Extract a list of Objects from these files. 
     * 3. - Iterate over the last list - do the query of reversing a payout. 
     *    - If it succeeds add into an array of successful reversals. 
     *    - Log something if the file fails. 
     * 5. Delete all the files which have succeeded. 
     */
}

async function withdrawDatabaseFailureMarkSuccess() {
    /**
     * Algorithm: 
     * 1. Get all the files from s3. 
     * 2. Extract a list of strings from these files. 
     * 3. - Iterate over the last list - do the query of marking as successful. 
     *    - If it succeeds add into an array of successful mark of success. 
     *    - Log something if the file fails. 
     * 5. Delete all the files which have succeeded. 
     */


}


module.exports = {
    withdrawDatabaseFailureMarkSuccess,
    withdrawDatabaseFailureReverse
}