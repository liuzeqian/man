<template>
	<view class="title">
		<image :src="url" mode="aspectFit" @click="clickImg(url)"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ""
			};
		},
		onLoad(option) {
			console.log(option.url)
			this.url = option.url
		},
		methods: {
			clickImg(url) {
				wx.previewImage({
					urls: [url], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
					current: '', // 当前显示图片的http链接，默认是第一个
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
			},
		}
	}
</script>

<style lang="less">
	.title {
		width: 90%;
		border: 2px solid #00007f;
		margin: 10rpx auto;
		padding: 10rpx;

		image {
			width: 100%;
		}
	}
</style>
