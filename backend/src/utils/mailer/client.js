var client = require("@sendgrid/client")
var config = require("../../../config");
const logger = require('../logger');

var senderId = 2248006;
var unsubscribeId = 18683;


//create a Mailing List which returns an id to store it in Database of Writer
async function createMailingList(name) {
    client.setApiKey(config.sendgrid.key)
    const data = { name };
    const request = {
        url: `/v3/marketing/lists`,
        method: 'POST',
        body: data
    }
    try {
        const response = await client.request(request);
        const id = response[0].body.id;
        //logger.info(response[0].body.id);
        return id
    }
    catch (e) {
        logger.debug(e);
    }
}


//This Function add mails of the follower to the writer's mailing list
async function addFollowerToList(email, listId, username) {
    client.setApiKey(config.sendgrid.key);
    const data =
    {
        "list_ids": [listId],
        "contacts": [{
            "email": email,
            "first_name": username,
            "last_name": ""
        }]
    };
    const request = {
        url: `/v3/marketing/contacts`,
        method: 'PUT',
        body: data
    }
    try {
        await client.request(request);
    }
    catch (e) {
        logger.debug(e);
    }

}



//This Function fetches the contact id of the email
async function getContactIdbyEmail(email) {
    client.setApiKey(config.sendgrid.key)
    const body = {
        "emails": [email]
    }
    const request = {
        url: `/v3/marketing/contacts/search/emails`,
        method: 'POST',
        body: body
    }
    try {
        const res = await client.request(request);
        const contactId = res[0].body.result[email].contact.id
        return contactId;
    }
    catch (e) {
        logger.info(e, "unable to fetch the contact id");
    }
}



//This function removes a contacct from the list using contact id
async function removeFromList(listId, email) {
    try {
        var contactId = await getContactIdbyEmail(email)
    } catch (e) {
        logger.debug(e, "Error in removeFromList function");
    }
    client.setApiKey(config.sendgrid.key)
    const queryString = {
        "contact_ids": contactId
    }
    const request = {
        url: `/v3/marketing/lists/${listId}/contacts`,
        method: 'DELETE',
        qs: queryString
    }
    try {
        await client.request(request);

    }
    catch (e) {
        logger.info(e, "Failed to remove the contact from the List")
    }
}




//Create singleSend draft for a List
async function createSingleSend(writers_name, list_id) {
    client.setApiKey(config.sendgrid.key);
    const data = {
        "name": `${writers_name}'s Update`,
        "send_to": {
            "list_ids": [list_id]
        },
        "email_config": {
            "subject": `Update! Check Out ${writers_name}'s new article on Attentioun`,
            "html_content": "<p>Read on Attentioun</p>",
            "sender_id": senderId,
            "suppression_group_id": unsubscribeId,
        }
    }
    const request = {
        url: `/v3/marketing/singlesends`,
        method: 'POST',
        body: data
    }
    try {
        const res = await client.request(request);
        const id = res[0].body.id;
        await scheduleSingleSend(id);
    } catch (e) {
        logger.debug(e, "<==ERRR in Creation and Scheduling Single Send");
    }
}


//This function will schedule the singlesend draft for Delivery
async function scheduleSingleSend(id) {
    const data = {
        "send_at": "now"
    };
    const request = {
        url: `/v3/marketing/singlesends/${id}/schedule`,
        method: 'PUT',
        body: data
    }
    try {
        const res = await client.request(request);
        logger.info(res[0].body.status);
    }
    catch (e) {
        logger.debug(e);
    }
}


async function deleteSingleSend(id) {
    client.setApiKey(config.sendgrid.key);
    const request = {
        url: `/v3/marketing/singlesends/${id}`,
        method: 'DELETE',
    }
    try {
        await client.request(request);
    }
    catch (e) {
        logger.debug(e, "Failed to delete Single Send");
    }

}


module.exports = {
    createMailingList,
    addFollowerToList,
    removeFromList,
    createSingleSend,
    deleteSingleSend
}