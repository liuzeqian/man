<template>
	<view class="container">
		<view v-for="(item,index) in imgList" :key="item._id" class="imgList">
			<uni-card mode="style" :is-shadow="true" class="card" :thumbnail="item.fileID" :extra="item.time"
				:note="item.name" @click="turnImg(item.fileID)">
			</uni-card>
		</view>
		<!-- pattern可选样式配置项
					content展开菜单内容配置项
					horizontal水平对齐方式。left:左对齐，right：右对齐
					vertical水平对齐方式。bottom:下对齐，top：上对齐
					direction展开菜单显示方式。horizontal:水平显示，vertical：垂直显示
					trigger展开菜单点击事件，返回点击信息
				 -->
		<uni-fab :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
			:direction="direction" @trigger="trigger"></uni-fab>
		<uni-fab :pattern="pattern1" :content="content1" :horizontal="horizontal1" :vertical="vertical1"
			:direction="direction1" @trigger="changeColor"></uni-fab>
		<!-- 		<button type="primary" @click="getUser()">上传</button> -->
	</view>
</template>

<script>
	export default {

		props: {
			index: {
				type: Number,
				default: 0,
			}
		},
		name: "CommonImg",
		data() {
			return {
				room: 0,
				percentCompleted: 0,
				imgList: [],
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF'
				},
				horizontal: 'left',
				vertical: 'bottom',
				direction: 'horizontal',
				content: [{
						iconPath: '/static/desk-gray@2x.png',
						selectedIconPath: '/static/desk-gray1@2x.png',
						text: '上传美景',
						active: false
					},
					{
						iconPath: '/static/mine-gray@2x.png',
						selectedIconPath: '/static/mine-gray1@2x.png',
						text: '上传美食',
						active: false
					}
				],
				pattern1: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#ff1928',
					buttonColor: '#ff6694'
				},
				horizontal1: 'right',
				vertical1: 'bottom',
				direction1: 'vertical',
				content1: [{
						iconPath: '/static/mine-gray@2x.png',
						selectedIconPath: '/static/mine-gray1@2x.png',
						text: '白色',
						active: false
					},
					{
						iconPath: '/static/mine-gray@2x.png',
						selectedIconPath: '/static/mine-gray1@2x.png',
						text: '暗黑',
						active: false
					},
					{
						iconPath: '/static/mine-gray@2x.png',
						selectedIconPath: '/static/mine-gray1@2x.png',
						text: '蓝色',
						active: false
					}
				],
			}
		},
		onShow() {
			this.getImg()
		},
		methods: {
			turnImg(url) {
				uni.navigateTo({
					url: `/pages/imgContent/imgContent?url=${url}`
				})
			},
			onShareAppMessage() {
				let title = '照片集'
				return {
					title: title,
					path: 'pages/index/index'
				}
			},
			trigger(e) {
				// 找到当前内容数组中的索引
				this.content[e.index].active = !e.item.active;
				let that = this
				let content = "即将上传照片到美景空间"
				e.index == 0 ? content = "即将上传照片到美景空间" : content = "即将上传照片到美食空间"
				uni.showModal({
					title: '提示',
					content,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							that.getUser(e.index)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			changeColor(e) {
				this.$emit("chang-color", e.index)
			},
			getUser(flag) {
				let that = this
				if (!uni.getStorageSync("userInfo")) {
					uni.getUserProfile({
						desc: "您即将授权登录香江购物",
						success: (res1) => {
							const userInfo = res1.userInfo;
							if (flag) {
								that.upload(userInfo, flag)
							}
							uni.setStorageSync("userInfo", userInfo)
						},
						fail: (err) => {
							console.log(err)
						}
					})
				} else {
					const userInfo = uni.getStorageSync("userInfo")
					that.upload(userInfo, flag)
				}

			},
			upload(userInfo, flag) {
				let that = this
				var moment = require('moment');
				let time = moment().format('YYYY年MM月DD日 h:mm:ss')

				if (uni.getStorage("room")) {
					this.room = uni.getStorageSync("room")
				}
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						let filePath = res.tempFilePaths;
						let count = 0
						for (var i = 0; i < filePath.length; i++) {
							uni.showLoading({
								title: `上传${filePath.length}张ing`,
								mask: true
							})
							const result = uniCloud.uploadFile({
								filePath: filePath[i],
								cloudPath: String(Math.random() * 5).split('.')[1] + '.png',
								onUploadProgress: function(progressEvent) {
									that.percentCompleted = Math.round(
										(progressEvent.loaded * 100) / progressEvent.total
									);
									// that.percentCompleted += that.percentCompleted
									if (that.percentCompleted == 100) {
										count++
										if (count == filePath.length) {
											console.log("完成")
											uni.hideLoading()
										}
									}

								},
							})
							result.then(res => {

								// 获取到上传到云储存的url地址 
								uniCloud.callFunction({ //客户端调用云函数，云函数调用数据库
									name: 'upload_img', //在云函数中的函数名,也就是创建的云函数的文件夹的名字
									data: {
										fileID: res['fileID'], //图片的url地址
										time,
										name: userInfo.nickName,
										flag,
										room: that.room
									},
									success: (res) => {
										that.getImg()
									},
									error: function(e) {}
								})
							})
						}
					},
				})
			},
			getImg() {
				if (uni.getStorage("room")) {
					this.room = uni.getStorageSync("room")
				}
				uni.showLoading({
					title: `加载最新图片...`,
					mask: true
				})
				let that = this
				uniCloud.callFunction({
					name: "get_img",
					data: {
						room: that.room
					},
					success: (e) => {
						this.imgList = Array.prototype.slice.call(e.result.data).filter(item => {
							return item.flag == that.index
						})
						uni.hideLoading()
					}
				})
			},

		}
	}
</script>

<style lang="less" scoped>
	.img {
		height: 200rpx;
	}



	.container {
		display: flex;
		flex-wrap: wrap;
		height: 100%;

		.imgList {
			width: 50%;
		}
	}

	image {
		width: 300rpx;
		height: 300rpx;
	}

	button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
	}
</style>
