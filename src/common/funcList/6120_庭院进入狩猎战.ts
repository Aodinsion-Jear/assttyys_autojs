import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { Script } from '@/system/script';

const left = 0;
const center = 1;
const right = 2;

export class Func6120 implements IFuncOrigin {
	id = 6120;
	name = '庭院进入狩猎战';
	desc = '从庭院(默认皮肤)导航进入狩猎战界面';
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
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		if (thisScript.oper({
			id: 6120,
			name: '庭院进入狩猎战_导航',
			operator: [thisOperator[0], thisOperator[1], thisOperator[2], thisOperator[3], thisOperator[4], thisOperator[5]]
		})) {
			return true;
		}

		if (thisScript.oper({
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
