import { Script } from '@/system/script';
import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';

// const normal = -1; //定义常量
const left = 0;
const center = 1;
const right = 2;

export class Func014 implements IFuncOrigin {
	id = 14;
	name = '探索_点击挑战图标';
	desc = '在探索界面时，选择小怪或boss进攻，优先打boss，可配置无差别挑战或只打经验怪或只打掉落怪';
	config = [{
		desc: '',
		config: [{
			name: 'type',
			desc: '挑战类型',
			type: 'list',
			data: ['无差别', '打经验', '打掉落'],
			default: '无差别',
		}, {
			name: 'swipeTime',
			desc: '划屏次数',
			type: 'list',
			data: ['2', '3', '4', '5'],
			default: '4',
		}, {
			name: 'swipeSpeed',
			desc: '划屏速度（滑不动可适当调整划屏速度）',
			type: 'list',
			data: ['快', '中', '慢'],
			default: '慢',
		}]
	}];
	operator: IFuncOperatorOrigin[] = [{ // 0 探索找怪界面
		desc: [1280, 720,
			[
				[left, 36, 569, 0x913157],
				[left, 47, 580, 0x85304f],
				[left, 62, 653, 0xefefe9],
				[left, 18, 634, 0x645c79],
				[right, 814, 658, 0xd7c8ab],
				[right, 732, 660, 0xd5c4a5],
			]
		],
		oper: [
			[left, 1280, 720, 0, 0, 42, 51, 1000],
			[right, 1280, 720, 1121, 117, 1224, 209, 1000],
			[left, 1280, 720, 46, 215, 162, 525, 1000],
			[center, 1280, 720, 32, 20, 69, 51, 1000],
			[center, 1280, 720, 702, 388, 846, 421, 1000],
			[left, 1280, 720, 0, 0, 16, 16, 1000],
			[right, 1280, 720, 0, 0, 1275, 715, 1000],
		]
	}, { // 1 探索地图界面
		desc: '探索地图界面',
		oper: [
			[center, 1280, 720, 1079, 468, 1255, 539, 1000],
		],
		retest: 1000
	}, { // 2 首领出现
		desc: [1280, 720,
			[
				[center, 512, 344, 0xffffde],
				[center, 558, 338, 0xfffff9],
				[center, 619, 340, 0xfffff0],
				[center, 675, 344, 0xfffff4],
				[center, 750, 348, 0xffffe0]
			]
		],
		oper: [
			[center, 1280, 720, 613, 248, 668, 297, 1000]
		]
	}, { // 3 困难界面进探索
		desc: [1280, 720,
			[
				[right, 898, 583, 0x523428],
				[right, 942, 589, 0xe4dac3],
				[right, 978, 625, 0xe1d6c0],
				[right, 1133, 659, 0xe2d7c1],
				[right, 1132, 596, 0xe7dbc4],
			]
		],
		oper: [
			[center, 1280, 720, 1090, 588, 1178, 663, 1000],
		]
	},];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		const thisconf = thisScript.scheme.config['14'];
		console.log(`[014] operatorFunc 开始, config: type=${thisconf.type}, swipeTime=${thisconf.swipeTime}, swipeSpeed=${thisconf.swipeSpeed}`);
		if (thisScript.oper({
			name: '探索界面_杂项',
			operator: [thisOperator[1]],
		})) {
			console.log('[014] 匹配到探索地图界面(operator[1])，点击进入探索');
			return true;
		}
		if (thisScript.oper({
			name: '困难界面进探索',
			operator: [{ desc: thisOperator[3].desc }]
		})) {
			console.log('[014] 匹配到困难界面');
			const point = thisScript.findMultiColor('探索_宝箱');
			if (point) {
				console.log(`[014] 困难界面找到宝箱 (${point.x}, ${point.y})，点击宝箱`);
				const oper = [[point.x, point.y, point.x + 10, point.y + 10, 500]];
				thisScript.regionClick(oper);
			} else {
				console.log('[014] 困难界面未找到宝箱，点击进入探索按钮');
				thisScript.regionClick([thisOperator[3].oper[0]]);
			}
			return true;
		}
		console.log('[014] 未匹配地图/困难界面，进入探索找怪主循环');
		let loopCount = 0;
		while (thisScript.oper({
			name: '探索界面_判断',
			operator: [{ desc: thisOperator[0].desc, retest: 500 }],
		})) {
			loopCount++;
			console.log(`[014] --- 主循环第 ${loopCount} 轮 ---`);
			if (thisScript.global.tsAttackSwhipeNum === undefined) {
				thisScript.global.tsAttackSwhipeNum = parseInt(String(thisconf.swipeTime), 10);
				console.log(`[014] 初始化滑屏计数器: ${thisScript.global.tsAttackSwhipeNum}`);
			}
			if (thisScript.oper({
				name: '首领出现',
				operator: [{ desc: thisOperator[2].desc }],
			})) {
				console.log('[014] 检测到首领出现，等待1s后点击首领');
				sleep(1000);
				thisScript.regionClick(thisOperator[2].oper);
				thisScript.global.tsAttackSwhipeNum = 1;
				return true;
			}
			console.log(`[014] 未检测到首领，开始找怪 (模式: ${thisconf.type})`);
			let point = null;
			if ('无差别' === thisconf.type) {
				point = thisScript.findMultiColor('探索_挑战BOSS');
				if (point) {
					console.log(`[014] 无差别模式: 找到BOSS (${point.x}, ${point.y})，点击`);
					const oper = [[point.x, point.y, point.x + thisOperator[0].oper[0][2], point.y + thisOperator[0].oper[0][3], thisOperator[0].oper[0][4]]];
					thisScript.regionClick(oper);
					thisScript.global.tsAttackSwhipeNum = 1;
					return true;
				}
				console.log('[014] 无差别模式: 未找到BOSS，尝试找普通挑战图标');
				point = thisScript.findMultiColor('探索_挑战');
				console.log(`[014] 无差别模式: 普通挑战图标 ${point ? `找到 (${point.x}, ${point.y})` : '未找到'}`);
			} else {
				let trycnt = 5;
				console.log(`[014] ${thisconf.type}模式: 开始重试循环 (最多5次)`);
				do {
					console.log(`[014] ${thisconf.type}模式: 重试剩余 ${trycnt} 次`);
					point = thisScript.findMultiColor('探索_挑战BOSS');
					if (point) {
						console.log(`[014] ${thisconf.type}模式: 找到BOSS (${point.x}, ${point.y})，点击`);
						const oper = [[point.x, point.y, point.x + thisOperator[0].oper[0][2], point.y + thisOperator[0].oper[0][3], thisOperator[0].oper[0][4]]];
						thisScript.regionClick(oper);
						thisScript.global.tsAttackSwhipeNum = 1;
						return true;
					}
					let flagPointAll = [];
					if ('打经验' === thisconf.type) {
						flagPointAll = thisScript.findMultiColorEx('探索_经验标识');
					} else if ('打掉落' === thisconf.type) {
						flagPointAll = thisScript.findMultiColorEx('探索_掉落标识');
					}
					console.log(`[014] ${thisconf.type}模式: 找到 ${flagPointAll.length} 个标识点`);
					if (flagPointAll.length > 0) {
						const pointAll = thisScript.findMultiColorEx('探索_挑战');
						console.log(`[014] ${thisconf.type}模式: 找到 ${pointAll.length} 个挑战图标`);
						if (pointAll.length > 0) {
							let minDistPow = 0xFFFFFFFF;
							for (const flagPoint of flagPointAll) {
								for (const kPoint of pointAll) {
									if (kPoint.y - thisOperator[0].oper[5][2] > flagPoint.y) {
										console.log(`[014] 排除: 挑战(${kPoint.x},${kPoint.y}) 在标识(${flagPoint.x},${flagPoint.y})下方`);
										continue;
									}
									const distPow = Math.pow(kPoint.x - flagPoint.x, 2) + Math.pow(kPoint.y - flagPoint.y, 2);
									if (minDistPow > distPow) {
										minDistPow = distPow;
										point = kPoint;
									}
								}
							}
							const dist = Math.sqrt(minDistPow);
							const threshold = thisOperator[0].oper[5][2] * 15 * 1.414;
							console.log(`[014] 最近距离: ${dist.toFixed(1)}, 阈值: ${threshold.toFixed(1)}, 匹配点: ${point ? `(${point.x},${point.y})` : 'null'}`);
							if (!(dist < threshold)) {
								console.log('[014] 距离超过阈值，丢弃匹配');
								point = null;
							}
						} else {
							console.log('[014] 有标识但无挑战图标');
						}
					} else {
						console.log('[014] 未找到标识点，刷新截屏重试');
						sleep(400);
						thisScript.keepScreen(true);
					}
				} while (!point && --trycnt > 0);
				console.log(`[014] ${thisconf.type}模式: 重试循环结束, point=${point ? `(${point.x},${point.y})` : 'null'}`);
			}
			if (point) {
				console.log(`[014] 找到目标 (${point.x}, ${point.y})，点击挑战`);
				const oper = [[point.x, point.y, point.x + thisOperator[0].oper[0][2], point.y + thisOperator[0].oper[0][3], thisOperator[0].oper[0][4]]];
				thisScript.regionClick(oper);
				return true;
			} else {
				console.log(`[014] 本轮未找到目标, 当前滑屏计数: ${thisScript.global.tsAttackSwhipeNum}`);
				if (--thisScript.global.tsAttackSwhipeNum <= 0) {
					console.log('[014] 滑屏次数耗尽，尝试退出重进探索');
					if (thisScript.oper({
						name: '探索界面_判断',
						operator: [{ desc: thisOperator[0].desc }],
					})) {
						console.log('[014] 仍在探索界面，点击退出重进 (oper[3]+oper[4])');
						thisScript.regionClick([thisOperator[0].oper[3], thisOperator[0].oper[4]]);
						thisScript.global.tsAttackSwhipeNum = undefined;
					} else {
						console.log('[014] 已不在探索界面（可能已切换场景）');
					}
					return true;
				}
				if (thisScript.oper({
					name: '探索界面_判断',
					operator: [{ desc: thisOperator[0].desc }],
				})) {
					console.log(`[014] 执行滑屏, 剩余次数: ${thisScript.global.tsAttackSwhipeNum}, 速度: ${thisconf.swipeSpeed}`);
					thisScript.myToast(`剩余滑屏次数：${thisScript.global.tsAttackSwhipeNum}`);
					thisScript.regionBezierSwipe(thisOperator[0].oper[1], thisOperator[0].oper[2], {
						'快': [200, 400],
						'中': [500, 700],
						'慢': [800, 1200],
					}[String(thisconf.swipeSpeed) || '慢'], 200);
					thisScript.keepScreen(true);
				} else {
					console.log('[014] 滑屏前检测已不在探索界面，返回false');
					return false;
				}
			}
		}
		console.log('[014] while循环退出: 未匹配探索界面比色，返回false');
		return false;
	}
}