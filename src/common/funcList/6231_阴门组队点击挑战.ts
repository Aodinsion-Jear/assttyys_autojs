import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { Script } from '@/system/script';

const left = 0;
const right = 2;

export class Func6231 implements IFuncOrigin {
	id = 6231;
	name = '阴门组队&点击挑战';
	desc = '在阴界之门组队界面(取色判断)，点击右下角挑战按钮';
	operator: IFuncOperatorOrigin[] = [{
		// 0 阴界之门组队界面 → 点击右下角挑战按钮
		desc: [1280, 720,
			[
				[right, 803, 56, 0xfce9d1],
				[right, 831, 58, 0xfadabf],
				[right, 1164, 46, 0xcfa578],
				[right, 1238, 42, 0xcba275],
				[right, 1210, 615, 0xf1de93],
				[right, 1210, 655, 0x35281c],
				[left, 60, 552, 0xf9f3e0],
				[left, 61, 647, 0xf7f6df],
			]
		],
		oper: [
			[right, 1280, 720, 1174, 597, 1269, 691, 1200],
		]
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		if (thisScript.oper({
			id: 6231,
			name: '阴门组队_点击挑战',
			operator: [thisOperator[0]]
		})) {
			return true;
		}
		return false;
	}
}

export default new Func6231();
