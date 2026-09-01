import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { Script } from '@/system/script';

const left = 0;
const center = 1;
const right = 2;

export class Func6120 implements IFuncOrigin {
	id = 6120;
	name = '庭院进入寮神社';
	desc = '从庭院(默认皮肤)导航进入寮神社，可选进入麒麟或道馆';
	config = [{
		desc: '',
		config: [{
			name: 'type',
			desc: '进入目标',
			type: 'list',
			data: ['麒麟', '道馆'],
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
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		const thisConf = thisScript.scheme.config['6120'];
		// 根据配置选择神社内的目标：道馆或麒麟(狩猎战)
		const targetOper = thisConf && thisConf.type === '道馆' ? thisOperator[7] : thisOperator[5];
		if (thisScript.oper({
			id: 6120,
			name: '庭院进入寮神社_导航',
			operator: [thisOperator[0], thisOperator[1], thisOperator[2], thisOperator[3], thisOperator[4], targetOper]
		})) {
			return true;
		}

		if (thisConf && thisConf.type !== '道馆' && thisScript.oper({
			name: '检测_已进入狩猎战',
			operator: [{
				desc: thisOperator[6].desc
			}]
		})) {
			return false;
		}

		return false;
	}
}

export default new Func6120();
