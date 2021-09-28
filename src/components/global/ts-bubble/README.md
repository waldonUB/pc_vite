<!--
 * @Author: ADI
 * @Date: 2021-03-19 17:26:57
 * @LastEditors: ADI
 * @LastEditTime: 2021-03-19 17:26:58
-->
	//自定义封装气泡弹窗
	//这里只是为了能够统一一下样式，实际上没有什么卵用
	/*
		使用例子
		<ts-bubble class="messageBox"
			:isShow="poupUpInfo.isChangeStatus"
			:style="poupUpInfo.styles"
			@cancel="cancelShow"
			@sure="sureShow">
			<template v-slot:boxContent>
				<div class="radioBox">
					<span v-for="(item,index) in payTypeList">
						<input type="radio"
							v-model="poupUpInfo.voteStatus"
							:id="'changePayType'+index" name="changePayType" :value="item.value" >
						<label :for="'changePayType'+index">{{item.changeLabel}}</label>
					</span>
				</div>
				<div class="tipsText">修改后将会改变分佣状态</div>
			</template>
		</ts-bubble>
	*/
