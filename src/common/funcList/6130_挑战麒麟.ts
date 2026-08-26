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
		// 0 检测星级选择界面 → 点击六星麒麟
		desc: [1280, 720, [
			[left, 56, 37, 0x9f6b3c],
			[left, 110, 29, 0xf8edb6],
			[center, 371, 671, 0xcca05a],
			[center, 367, 659, 0xb29a1b],
			[right, 1182, 625, 0xe5d9c4],
			[right, 1188, 563, 0x8a6b54],
			[right, 1180, 671, 0xddd2bd],
		]],
		oper: [[center, 1280, 720, 1049, 337, 1141, 423, 1000]]
	}, {
		// 1 检测六星已选中 → 点击开始狩猎
		desc: [1280, 720, [
			[center, 357, 655, 0xdbaa4e],
			[center, 368, 659, 0xb2991c],
			[left, 116, 27, 0xf9eeb7],
			[left, 36, 37, 0xf5e2a3],
			[right, 1185, 627, 0xe3d9c5],
			[right, 1038, 344, 0xfee9a7],
			[right, 1040, 365, 0xfeeda7],
		]],
		oper: [[right, 1280, 720, 1144, 580, 1226, 673, 1000]]
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
		// 3 检测麒麟已被击杀 → 点击返回并停止脚本
		desc: [1280, 720, [
			[left, 67, 655, 0xdcb576],
			[left, 143, 661, 0x868686],
			[left, 228, 657, 0xed4b36],
			[left, 296, 655, 0xb73a1a],
			[right, 1177, 599, 0xdcdcdc],
			[right, 1183, 645, 0xd8d8d8],
			[right, 856, 564, 0xbe1010],
		]],
		oper: [[left, 1280, 720, 98, 19, 137, 60, 2000]]
	}, {
		// 4 检测借式神弹窗 → 点击取消
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
		if (thisScript.oper({
			name: '检测_麒麟已被击杀',
			operator: [thisOperator[3]]
		})) {
			thisScript.myToast('麒麟已被击杀，返回庭院并停止脚本');
			sleep(2000);
			thisScript.stop();
			return true;
		}
		if (thisScript.oper({
			id: 6130,
			name: '挑战麒麟_流程',
			operator: [thisOperator[0], thisOperator[1], thisOperator[2], thisOperator[4]]
		})) {
			return true;
		}
		return false;
	}
}

export default new Func6130();
