const cheerio = require('cheerio');
const logger = require('../logger');
const scrapeMedia = require('./media');

async function scrapeArticle(origin, content, articleId, username) {

    if (!origin || !content || !articleId || !username) throw "Content, origin or article missing";

    try {

        if (origin == 'substack') {
            return await scrapeSubstackArticle(content, articleId, username)
        } else {
            return await scrapeMediumArticle(content, articleId, username)
        }

    } catch (e) {
        throw e;
    }
}


async function scrapeSubstackArticle(content, articleId, username) {

    /**
     * Load up the html content which is received
     * h1Short & h1Long are two types of Heading that are in substack
     * One of these will be present. 
     * Other than this a subtitle might be present. We scrape them out. 
     */
    const $ = cheerio.load(content);

    var heading;
    let h1Short = $(".post-title.short.unpublished").text();
    let h1Long = $("post-title.long.unpublished").text();

    heading = h1Short ? h1Short : h1Long;
    const subtitle = $(".subtitle").text();

    /**
     * We get hold of our images to get track 
     */

    const images = $('.image-link.image2')

    const substackImages = [];

    images.each((i, ele) => {
        substackImages.push($(ele).attr('href'));
    });

    if (substackImages.length) {
        // logger.debug(substackImages);
        var convertedImages = await scrapeMedia.convertMultipleImagesLinksToS3(substackImages, articleId, username);
    }



    /**
     * We're going to replace the captioned container with the image tag from the above images. 
     * This is a parent of the above image elements. 
     */

    const diveToBeReplaced = $('.captioned-image-container')


    diveToBeReplaced.each((i, ele) => {

        $(ele).replaceWith(`<img src=${convertedImages[i]} style="width: 100%;">`)

    });



    const strongTagsToBeReplaced = $('strong');

    strongTagsToBeReplaced.each((i, ele) => {

        $(ele).replaceWith(`<b>${$(ele).text()}</b>`);

    })


    /**
     * We remove the subscribe widget which is there in substack.
     */

    $('.subscribe-widget').remove();


    /*
    The main edited article is then returned over here in HTML format.  
    */

    const mainArticle = $(".body.markup").html();


    const obj = {
        heading: heading,
        subtitle: subtitle,
        HTML: mainArticle
    }

    return obj;
}

async function scrapeMediumArticle(content, articleId, username) {

}

module.exports = {
    scrapeArticle
}