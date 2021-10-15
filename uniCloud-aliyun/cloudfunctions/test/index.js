'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
//连接数据库
	const db = uniCloud.database();
//获取指令
	const dbCmd = db.command
//db.collection('product_list') 连接product_list表 获取所有的数据,连接自己创建的表,
	let res = await db.collection('man_img').add({fileID:event.fileID})
	console.log(event)
    return res // 返回json给客户端
};
