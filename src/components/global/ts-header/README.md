	//封装每一页的header组件
	/*
		使用示例
		<global-ts-header>  
			<template v-slot:leftPart>产品管理</template>
			<template v-slot:rightPart>
				<global-ts-button
					class="pro_header_addEm"
					type="primary"
					size="small"
					icon="icon-icon-11"
					@click="newAddProduct">产品录入
				</tanshu-button>
			</template>
		</tanshu-header>
		目的是统一样式处理
	*/
