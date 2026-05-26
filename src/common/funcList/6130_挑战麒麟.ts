import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { Script } from '@/system/script';

const left = 0;
const center = 1;
const right = 2;

export class Func6130 implements IFuncOrigin {
	id = 6130;
	name = '挑战麒麟';
	desc = '在狩猎战界面选择六星麒麟并发起挑战';
	operator: IFuncOperatorOrigin[] = [{
		// 0 检测星级选择界面 → 点击六星麒麟 (待补充)
		desc: [1280, 720, []],
		oper: [[center, 1280, 720, 0, 0, 0, 0, 1000]]
	}, {
		// 1 检测六星已选中 → 点击开始狩猎 (待补充)
		desc: [1280, 720, []],
		oper: [[center, 1280, 720, 0, 0, 0, 0, 1000]]
	}, {
		// 2 检测挑战麒麟界面 → 点击挑战
		desc: [1280, 720, [
			[left, 72, 652, 0xe8bc61],
			[left, 142, 655, 0xdddddd],
			[left, 227, 654, 0xe6301e],
			[left, 293, 643, 0x6e3325],
			[center, 360, 648, 0xddad4c],
			[right, 1183, 596, 0xe3d7c1],
			[right, 1182, 656, 0xe3d7c1],
		]],
		oper: [[right, 1280, 720, 1141, 581, 1224, 679, 1000]]
	}, {
		// 3 检测借式神弹窗 → 点击取消
		desc: [1280, 720, [
			[center, 523, 260, 0xcbb59c],
			[right, 763, 352, 0xcbb59c],
			[center, 499, 348, 0xcbb59c],
			[center, 463, 437, 0xdf6851],
			[center, 580, 438, 0xdf6851],
			[right, 801, 440, 0xf3b25e],
			[right, 710, 437, 0xf3b25e],
		]],
		oper: [[center, 1280, 720, 434, 412, 600, 455, 1000]]
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		// TODO: op0 op1 待补充参数后恢复
		if (thisScript.oper({
			id: 6130,
			name: '挑战麒麟_流程',
			operator: [thisOperator[2], thisOperator[3]]
		})) {
			return true;
		}
		return false;
	}
}

export default new Func6130();
