import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { Script } from '@/system/script';

const left = 0;
const center = 1;
const right = 2;

export class Func6120 implements IFuncOrigin {
	id = 6120;
	name = '庭院进入寮神社';
	desc = '从庭院(默认皮肤)导航进入寮神社，可选进入麒麟、道馆或阴界之门';
	config = [{
		desc: '',
		config: [{
			name: 'type',
			desc: '进入目标',
			type: 'list',
			data: ['麒麟', '道馆', '阴界之门'],
			default: '麒麟',
		}]
	}];
	operator: IFuncOperatorOrigin[] = [{
		// 0 在庭院打开菜单
		desc: '页面是否为庭院_菜单未展开_只支持默认庭院皮肤与默认装饰',
		oper: [
			[right, 1280, 720, 1168, 592, 1230, 690, 1200]
		]
	}, {
		// 1 点击阴阳寮
		desc: '页面是否为庭院_菜单已展开_只支持默认庭院皮肤与默认装饰',
		oper: [
			[center, 1280, 720, 544, 612, 594, 661, 1200]
		]
	}, {
		// 2 点击阴阳寮(御祝图标)
		desc: '页面是否为庭院_菜单已展开_另一种图标_御祝图标_只支持默认庭院皮肤与默认装饰',
		oper: [
			[center, 1280, 720, 544, 612, 594, 661, 1200]
		]
	}, {
		// 3 点击阴阳寮(另一种图标)
		desc: '庭院已打开菜单_另另外一种图标',
		oper: [
			[center, 1280, 720, 544, 612, 594, 661, 1200]
		]
	}, {
		// 4 判断是否为寮首页，点击神社
		desc: [1280, 720,
			[
				[right, 1096, 630, 0xb1251f],
				[right, 1105, 662, 0xdbe3f1],
				[left, 45, 39, 0xf4e4a3],
				[center, 886, 644, 0xe0cbaa],
			]
		],
		oper: [
			[center, 1280, 720, 868, 627, 927, 684, 1200]
		],
		retest: 1000
	}, {
		// 5 在神社页面点击狩猎战图标
		desc: [1280, 720,
			[
				[left, 242, 487, 0xf99184],
				[left, 262, 487, 0xf9ad9b],
				[left, 287, 486, 0xfcfaf7],
				[left, 288, 510, 0xbe6c77],
				[left, 237, 515, 0xcf838e],
			]
		],
		oper: [
			[center, 1280, 720, 203, 449, 343, 554, 1000]
		]
	}, {
		// 6 检测已进入狩猎战内部(麒麟界面)
		desc: [1280, 720,
			[
				[left, 112, 594, 0x664b30],
				[left, 139, 590, 0x5b452c],
				[left, 175, 603, 0x966f47],
				[left, 187, 593, 0x7a5836],
			]
		]
	}, {
		// 7 在神社页面点击道馆区域
		desc: [1280, 720,
			[
				[center, 498, 264, 0xc2bca9],
				[center, 546, 265, 0xbabaac],
				[center, 550, 293, 0xc5924c],
				[center, 467, 300, 0xa67636],
				[center, 468, 276, 0xcfcdb7],
				[center, 507, 267, 0xd6d0bc],
			]
		],
		oper: [
			[center, 1280, 720, 396, 126, 625, 351, 1000]
		]
	}, {
		// 8 在神社页面点击阴界之门按钮
		desc: [1280, 720,
			[
				[left, 107, 127, 0xe8d8c6],
				[left, 101, 137, 0x371517],
				[left, 253, 500, 0xedc7ed],
				[left, 194, 460, 0xc1ae93],
				[left, 233, 531, 0x7c526e],
				[left, 294, 542, 0x925195],
				[right, 1216, 414, 0xc17749],
			]
		],
		oper: [
			[left, 1280, 720, 163, 430, 358, 584, 1000]
		]
	}, {
		// 9 检测已进入阴界之门内部
		desc: [1280, 720,
			[
				[right, 1109, 641, 0x2b153f],
				[right, 1089, 648, 0x300812],
				[right, 1087, 670, 0x552a30],
				[right, 1124, 657, 0x8d2a6e],
				[right, 1141, 678, 0x3b132a],
				[left, 44, 39, 0xf3e8a7],
				[left, 66, 39, 0xb3834d],
			]
		]
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		// 6130 已标记麒麟结束时（已击杀/已挑战），本方案进入返回庭院收尾阶段：
		// 庭院出现后不得抢先导航进寮，否则 503 没机会确认庭院并结束（2026-09-14 实测竞态）。
		// 标记按方案名隔离，切换到其他方案后不影响本功能。
		if (thisScript.global.qilinFinishedScheme === thisScript.scheme.schemeName) {
			return false;
		}
		const thisConf = thisScript.scheme.config['6120'];
		// 根据配置选择神社内的目标：麒麟(狩猎战)、道馆或阴界之门
		let targetOper = thisOperator[5];
		let arrivalDesc = thisOperator[6].desc;
		if (thisConf && thisConf.type === '道馆') {
			targetOper = thisOperator[7];
			arrivalDesc = null;
		} else if (thisConf && thisConf.type === '阴界之门') {
			targetOper = thisOperator[8];
			arrivalDesc = thisOperator[9].desc;
		}
		if (thisScript.oper({
			id: 6120,
			name: '庭院进入寮神社_导航',
			operator: [thisOperator[0], thisOperator[1], thisOperator[2], thisOperator[3], thisOperator[4], targetOper]
		})) {
			return true;
		}

		if (arrivalDesc && thisScript.oper({
			name: '检测_已进入目标界面',
			operator: [{
				desc: arrivalDesc
			}]
		})) {
			return false;
		}

		return false;
	}
}

export default new Func6120();
