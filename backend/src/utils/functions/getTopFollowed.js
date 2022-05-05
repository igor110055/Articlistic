const logger = require("../logger");

module.exports =
    function getTopFollowed(analytics, user) {

        /*
        ATT005
        optimise the next two lines - O(N*N);
        convert user.following to set. 
        */

        let startTime = Date.now();
        const sortedFollowing = [];

        const following = new Set(user.public.following); // O(n)

        analytics.writers.sort((a, b) => a.articleVisits + a.profileVisits > b.articleVisits + b.profileVisits ? -1 : 1); //O(n*log(n))

        analytics.writers.forEach((x) => {
            let name = x.name;
            if (following.has(name)) {
                sortedFollowing.push(name);
                following.delete(name)
            }
        }); // O(n)


        following.forEach(x => sortedFollowing.push(x)); // O(N)
        let finishTime = Date.now();

        logger.info("getTopFollowed took: " + (finishTime - startTime).toString());
        return sortedFollowing;
    }