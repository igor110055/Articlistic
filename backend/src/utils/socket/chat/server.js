const {
    Server
} = require("socket.io");

const mongo = require('../../../db/mongo/index')
const DatabaseError = require('../../../errors/DatabaseError');
const MissingParamError = require('../../../errors/MissingParamError');
const auth = require("../../../middleware/auth");

const wrap = middleware => (socket, next) => middleware(socket, {}, next);

// module.exports = ;
const logger = require('../../logger/index')



module.exports = async function startSocketServer(server) {
    logger.debug("HERE")
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3001",
            methods: ["GET", "POST"],
        }
    });


    io.use(wrap(auth(true)))

    io.on("connection", (socket) => {
        logger.debug(`User Connected: ${socket.id}`);
        socket.on("join_chat", (data) => {

            /*
            - This data can be an array or this can be a single string.
            - In case of getChats API this would be an array of chatIDs
            - And in case of respondToSelection API this would be a single string.
            */


            // Check if there - username & chatId - CONCURRENTLY. 

            // Check if the chat contains s or r as username. (no need to check if the username is there as - if it's in chat it does exist)

            // Emit error if not.

            if (!data) {
                return socket.emit('error', MissingParamError('please use chatId', 'join-chat-socket.io'));
                // return socket.emit();
            }


            socket.join(data);

            logger.debug(`User with ID: ${socket.id} joined chat: ${data}`);

        });


        socket.on("send_chat", async (data) => {

            // Check if chatId is correct. 
            let chatObj;
            let {
                username,
                message,
                chatId
            } = data;

            if (!username || !message || !chatId) {
                return socket.emit('error', new MissingParamError('Some parameters are missing: chatId, message, username', 'chatObj-chat-socket.io'));
                // next(new MissingParamError('missing some parameter', 'send_chat'))
            }

            chatObj = {
                username,
                message,
                timestamp: Date.now(),
                likes: 0
            }

            //Store the chat to be saved in mongodb. 

            try {
                await mongo.chats.addNewChat(chatId, chatObj);
            } catch (e) {
                return socket.emit('error', new DatabaseError('send-chat', e))
            }

            // Send to the specific room - in our case ~ chat Id.
            socket.to(chatId).emit("receive_chat", data);
        });



        socket.on("disconnect", () => {
            logger.debug("User Disconnected", socket.id);
        });


    });


}