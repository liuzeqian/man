'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//连接数据库
	const db = uniCloud.database();
	//获取指令
	const dbCmd = db.command
	console.log(event)
	let res = await db.collection('man_img').add({
		fileID: event.fileID,
		time: event.time,
		name: event.name,
		flag: event.flag
	})

	return res // 返回json给客户端
};
