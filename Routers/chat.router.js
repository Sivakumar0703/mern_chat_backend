import express from 'express';
import { protect } from '../Middleware/auth.middleware.js';
import { addGroupMembers, createGroup, deleteGroup, getAllChat, oneToOneChat, removeGroupMember, renameGroupChat } from '../Controller/chat.controller.js';



const chatRouter = express.Router();

chatRouter.post('/',protect,oneToOneChat);
chatRouter.get('/',protect,getAllChat);
chatRouter.post('/create_group',protect,createGroup );
chatRouter.delete('/delete_group/:id',protect,deleteGroup );
chatRouter.put('/group_rename',protect,renameGroupChat);
chatRouter.put('/group_add_member',protect,addGroupMembers);
chatRouter.put('/group_remove_member',protect,removeGroupMember);






export default chatRouter