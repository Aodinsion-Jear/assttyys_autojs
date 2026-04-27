import { Script } from '@/system/script';
import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';

const left = 0;
const center = 1;
const right = 2;

export class Func013 implements IFuncOrigin {
	id = 13;
	name = '探索_地图进入章节';
	desc = '在探索地图界面展开章节面板，OCR滑动找到目标章节，进入二级界面后选困难并点击探索';
	config = [{
		desc: '',
		config: [{
			name: 'chapterName',
			desc: '目标章节名（OCR识别文字）',
			type: 'text',
			default: '第二十八章',
		}, {
			name: 'maxSwipes',
			desc: '最大滑屏次数（超出则放弃本轮）',
			type: 'list',
			data: ['5', '8', '10', '15', '20'],
			default: '10',
		}]
	}];
	operator: IFuncOperatorOrigin[] = [
		{ // 0: 探索章节面板已展开
			desc: '探索章节面板已展开',
			oper: [
				// [0] 滑动起点（列表下方区域，从这里往上划，露出更靠下的章节）
				[center, 1280, 720, 1076, 439, 1233, 537, 0],
				// [1] 滑动终点（列表上方区域）
				[center, 1280, 720, 1076, 239, 1233, 337, 0],
			]
		},
		{ // 1: 探索章节面板未展开（探索地图界面）
			desc: '探索章节面板未展开',
			oper: [
				// [0] 展开按钮点击区域
				[right, 1280, 720, 1243, 122, 1262, 135, 1000],
			]
		},
		{ // 2: 探索二级界面（困难模式下）
			desc: '探索二级界面_困难',
			oper: [
				// [0] 困难难度选择区域
				[left, 1280, 720, 35, 334, 150, 354, 500],
				// [1] 探索按钮区域
				[center, 1280, 720, 1094, 583, 1171, 654, 1000],
			]
		},
	];
	// OCR扫描区域：章节面板内章节名文字所在的矩形 [x1, y1, x2, y2]
	// 对应章节面板展开时右侧列表区域（1280×720 基准）
	private readonly ocrRegion = [1076, 239, 1233, 537];

	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		const thisconf = thisScript.scheme.config[13];

		// --- 状态 C：二级界面（困难）→ 点击探索按钮 ---
		if (thisScript.oper({
			id: 13,
			name: '探索二级界面_点击探索',
			operator: [{
				desc: thisOperator[2].desc,
				oper: [thisOperator[2].oper[1]],
			}]
		})) {
			thisScript.global.tsChapterSwipeNum = undefined;
			thisScript.global.tsAttackSwhipeNum = undefined;
			return true;
		}

		// --- 状态 B：章节面板已展开 → OCR找章节，找不到则下滑 ---
		if (thisScript.oper({
			id: 13,
			name: '探索章节面板已展开_判断',
			operator: [{ desc: thisOperator[0].desc, retest: 500 }]
		})) {
			const chapterName = String(thisconf.chapterName || '第二十八章');
			const result = thisScript.findText(chapterName, 500, this.ocrRegion, '包含');

			if (result.length > 0) {
				// 点击识别到的章节文字中心
				const p = {
					x: Math.round((result[0].points[0].x + result[0].points[1].x) / 2),
					y: Math.round((result[0].points[0].y + result[0].points[3].y) / 2),
				};
				thisScript.myToast(`OCR命中：${chapterName}，点击 (${p.x}, ${p.y})`);
				thisScript.regionClick([[p.x - 10, p.y - 10, p.x + 10, p.y + 10, 1000]]);
				thisScript.global.tsChapterSwipeNum = undefined;
				return true;
			} else {
				// 未找到，向下滑动（起点在列表下方，终点在上方，内容向上滚动露出更靠下的章节）
				if (thisScript.global.tsChapterSwipeNum === undefined) {
					thisScript.global.tsChapterSwipeNum = 0;
				}
				const maxSwipes = parseInt(String(thisconf.maxSwipes || '10'), 10);
				if (thisScript.global.tsChapterSwipeNum >= maxSwipes) {
					thisScript.myToast(`未找到"${chapterName}"，已达最大划屏次数`);
					thisScript.global.tsChapterSwipeNum = undefined;
					return false;
				}
				thisScript.myToast(`划屏寻找 ${chapterName}（${thisScript.global.tsChapterSwipeNum + 1}/${maxSwipes}）`);
				thisScript.regionBezierSwipe(
					thisOperator[0].oper[0], // 起点（下方）
					thisOperator[0].oper[1], // 终点（上方）
					[600, 1000],
					300
				);
				thisScript.global.tsChapterSwipeNum++;
				return true;
			}
		}

		// --- 状态 A：面板未展开（探索地图界面）→ 点击展开按钮 ---
		if (thisScript.oper({
			id: 13,
			name: '探索地图_点击展开章节面板',
			operator: [{
				desc: thisOperator[1].desc,
				oper: [thisOperator[1].oper[0]],
			}]
		})) {
			thisScript.global.tsChapterSwipeNum = undefined;
			return true;
		}

		return false;
	}
}

export default new Func013();
