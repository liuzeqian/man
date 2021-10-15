<template>
	<view class="content" :class="{'white':colorFlag == 0,'dark':colorFlag == 1,'lightBlue':colorFlag == 2}">
		<common-img ref="mychild" :imgList="imgList" :index="index" @chang-color="changeColor"></common-img>
	</view>
</template>

<script>
	import uniCard from '@/uni_modules/uni-card/components/uni-card/uni-card.vue'
	import CommonImg from '@/components/CommonImg.vue'
	export default {
		components: {
			uniCard,
			CommonImg,
		},
		data() {
			return {
				index: 1,
				colorFlag: 2,
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: '美食'
			})
			this.colorFlag = uni.getStorageSync("colorData")
			this.$refs.mychild.getImg()
		},
		methods: {
			onShareAppMessage() {
				let title = '照片集'
				return {
					title: title,
					path: 'pages/index/index'
				}
			},
			changeColor(val) {
				this.colorFlag = val
				uni.setStorageSync("colorData", val)
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		min-height: 1600rpx;
	}

	.white {
		background-color: #ffffff;
	}

	.dark {
		background-color: #333333;
	}

	.lightBlue {
		background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
	}
</style>
