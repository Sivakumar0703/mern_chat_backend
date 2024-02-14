import express from 'express';
import { protect } from '../Middleware/auth.middleware.js';
import { createGroup, getAllChat, oneToOneChat } from '../Controller/chat.controller.js';



const chatRouter = express.Router();

chatRouter.post('/',protect,oneToOneChat);
chatRouter.get('/',protect,getAllChat);
chatRouter.post('/group',protect,createGroup );
// chatRouter.put('/group/rename',protect,renameGroupChat);
// chatRouter.put('/group/add_user',protect,addUserFromGroup);
// chatRouter.put('/group/remove_user',protect,removeUserFromGroup);






export default chatRouter