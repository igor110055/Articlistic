
const fastCsv = require("@fast-csv/parse")
const logger = require("../logger/index")
//function to parse CSV from S3


let data = [];
async function parseUploadedFile(fileStream) {
    const options = {
        objectMode: true,
        delimiter: ",",
        quote: null,
        headers: true,
        renameHeaders: false,
    };
    return (await pareser(options, fileStream))
}

async function pareser(options, fileStream) {
    await new Promise((resolve, reject) => {
        fastCsv.parseStream(fileStream, options)
            .on("error", (error) => {
                logger.info(error, "<---/utils/parser");
                reject();
            })
            .on("data", async (row) => {
                data.push(row);
                logger.info("data in array")
            })
            .on("end", async (rowCount) => {
                logger.info(rowCount);
                logger.info("parsing end");
                // logger.info(data)
                resolve(data);
                //return data;
            });
    })
    return data;
}

// async function buildDataArray(data, row) {
//     data.push(row);
//     logger.info()
// }

module.exports = { parseUploadedFile }