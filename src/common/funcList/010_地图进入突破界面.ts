import { Script } from '@/system/script';
import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
// const normal = -1; // 定义常量
const left = 0;
const center = 1;
const right = 2;

export class Func010 implements IFuncOrigin {
	id = 10;
	name = '地图进入突破界面';
	desc = '在地图界面时点击突破按钮进入突破界面，可配置进入个人突破或寮突破界面';
	config = [{
		desc: '',
		config: [{
			name: 'type',
			desc: '突破类型',
			type: 'list',
			data: ['个人突破', '寮突破'],
			default: '个人突破',
			value: null,
		}]
	}];
	operator: IFuncOperatorOrigin[] = [{  // 0
		desc: '探索地图界面',
		oper: [
			[left, 1280, 720, 244, 641, 310, 704, 1500],
			[center, 1280, 720, 1210, 405, 1254, 509, 1500]
		]
	}, { // 1
		desc: [1280, 720,
			[
				[right, 722, 90, 0x593716],
				[right, 728, 86, 0xe3c559],
				[right, 740, 97, 0x805534],
				[right, 770, 585, 0x070401],
				[right, 793, 608, 0xd32c21],
				[right, 779, 589, 0xf1efe3],
				[right, 1205, 115, 0x652c37],
				[right, 1205, 132, 0xe6c5c5],
				[right, 1225, 137, 0x6a2c46],
			]
		],
		oper: [
			[center, 1280, 720, 1200, 403, 1256, 515, 500]
		]
	}, { // 2 原含时空秘境布局（按钮位置右移），现改为新版体服突破按钮
		desc: '新版探索地图界面',
		oper: [
			[center, 1280, 720, 248, 636, 322, 696, 1000],
			[center, 1280, 720, 1210, 366, 1254, 453, 1500]
		]
	}, { // 3 探索地图界面_新版
		desc: '探索地图界面_新版',
		oper: [
			[center, 1280, 720, 261, 650, 296, 688, 500]
		]
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		const thisconf = thisScript.scheme.config['10']; // 获取配置
		if ('个人突破' === thisconf.type) {
			return thisScript.oper({
				name: '地图进入个人突破',
				operator: [{
					desc: thisOperator[2].desc,
					oper: [thisOperator[2].oper[0]]
				}, {
					desc: thisOperator[0].desc,
					oper: [thisOperator[0].oper[0]]
				}, thisOperator[1], thisOperator[3]]
			});
		} else if ('寮突破' === thisconf.type) {
			return thisScript.oper({
				name: '地图进入寮突破',
				operator: [thisOperator[2], thisOperator[0], thisOperator[1]]
			});
		}
		return false;
	}
}