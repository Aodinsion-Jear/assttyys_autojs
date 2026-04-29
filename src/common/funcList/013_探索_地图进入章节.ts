import { Script } from '@/system/script';
import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
// const normal = -1; //定义常量

// 坐标对齐方式常量：0=靠左，1=居中，2=靠右
const left = 0;
const center = 1;
const right = 2;

export class Func013 implements IFuncOrigin {
	id = 13;
	name = '探索_地图进入章节';
	desc = '在地图界面时，默认选择最后一章进行挑战';

	// 前端 UI 显示的配置项
	config = [{
		desc: '',
		config: [{
			name: 'xy_switch',
			desc: '是否手动选章节',
			type: 'switch',
			default: false,
		}, {
			name: 'xy',
			// 手动选章节时，填入目标章节文字的中心坐标，点击范围会在 x/y 各扩展 20px
			desc: '文本的坐标中心（区域为左右各增加20）,格式为x,y',
			type: 'text',
			default: '1151,348',
		}]
	}];

	// operator 数组：每一项描述一个界面状态或操作步骤
	operator: IFuncOperatorOrigin[] = [{ // 0 探索地图主界面
		desc: '探索地图界面',
		oper: [
			// 格式：[对齐, 基准宽, 基准高, x1, y1, x2, y2, 等待ms]
			[right, 1280, 720, 1056, 503, 1246, 581, 1000], // 点击最后一章入口区域
			[center, 1280, 720, 446, 201, 492, 255, 200],   // 点击"普通"按钮
			[center, 1280, 720, 889, 517, 1002, 559, 1000]  // 点击"挑战"按钮
		],
		retest: 1000 // 判断失败时等待 1000ms 再重试
	}, { // 1 章节选择窗口已打开（通过比色判断）
		desc: [1280, 720,
			[
				// 多点比色：检测这些坐标的颜色是否匹配，用于确认界面状态
				[center, 276, 129, 0x493624],
				[center, 867, 131, 0x493624],
				[center, 1043, 147, 0xeecccc],
				[center, 904, 535, 0xf4b25f],
				[right, 1121, 35, 0xd7b389],
				[right, 1222, 32, 0xd3af85]]
		],
		oper: [
			[center, 1280, 720, 1036, 133, 1065, 158, 500] // 点击"困难"选项卡
		]
	}, { // 2 点击返回按钮（左上角）
		oper: [
			[left, 1280, 720, 0, 0, 77, 45, 1000]
		]
	}, { // 3 "普通"按钮高亮状态（比色判断）
		desc: [1280, 720,
			[
				[center, 333, 204, 0x4b1d53],
				[center, 340, 253, 0x670ecb],
			]
		],
	}];

	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		// 读取本功能的用户配置
		const thisconf = thisScript.scheme.config[13];

		// 判断当前是否在探索地图主界面
		if (thisScript.oper({
			name: '探索_地图判断',
			operator: [{ desc: thisOperator[0].desc, retest: 500 }]
		})) {
			// 进入地图界面后，重置滑动计数
			thisScript.global.tsAttackSwhipeNum = undefined;

			// 优先寻找宝箱（多点找色），找到就点击宝箱
			const point = thisScript.findMultiColor('探索_宝箱');
			if (point) {
				const oper = [[point.x, point.y, point.x + thisOperator[2].oper[0][2], point.y + thisOperator[2].oper[0][3], thisOperator[2].oper[0][4]]];
				thisScript.regionClick(oper);
				return true;
			} else {
				// 没有宝箱，尝试点击章节入口
				if (thisScript.oper({
					name: '探索_地图章节',
					operator: [{ desc: thisOperator[0].desc }]
				})) {
					if (thisconf.xy_switch) {
						// 手动指定章节坐标模式
						const xy = String(thisconf.xy).split(',');
						if (xy.length !== 2) {
							thisScript.myToast('自定义坐标格式定义错误，请检查');
							return true;
						}
						const inX1 = parseInt(xy[0]);
						const inY1 = parseInt(xy[1]);
						// 以配置坐标为中心，上下左右各扩展 20px 作为点击区域
						thisScript.regionClick([[inX1 - 20, inY1 - 20, inX1 + 20, inY1 + 20, 1000]]);
					} else {
						// 默认点击最后一章入口
						thisScript.regionClick([thisOperator[0].oper[0]]);
					}

					// 等待最多 3000ms，检测章节窗口是否打开（比色验证）
					if (thisScript.compareColorLoop(thisOperator[1].desc, 3000)) {
						// 章节窗口已打开，判断"普通"按钮是否高亮
						if (thisScript.oper({
							id: 13,
							name: '探索_普通切困难_挑战',
							operator: [{
								desc: thisOperator[3].desc,
								// 先点"困难"选项卡，再点"挑战"
								oper: [thisOperator[0].oper[1], thisOperator[0].oper[2]]
							}]
						})) {
							return true;
						} else {
							// 已在困难模式，直接点击"挑战"
							console.log('探索_困难_挑战');
							thisScript.regionClick([thisOperator[0].oper[2]]);
							return true;
						}
					}
				}
				return false;
			}
		} else if (thisScript.oper({
			// 不在地图主界面，尝试关闭章节选择窗口（点返回）
			name: '探索_地图进入最后一章_关闭章节窗口',
			operator: [thisOperator[1]]
		})) {
			thisScript.global.tsAttackSwhipeNum = undefined;
			return true;
		}
		return false;
	}
}
