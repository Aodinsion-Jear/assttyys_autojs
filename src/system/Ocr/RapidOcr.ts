import { nlpSimilarity } from '@/common/toolAuto';
import drawFloaty from '../drawFloaty';
import { IOcr, IOcrDetector, OcrResult } from './IOcr';

/**
 * RapidOcr：离线 OCR 扩展（onnxruntime + PP-OCRv5 mobile 模型，armeabi-v7a + x86_64）。
 * 插件工程见 C:/Users/Administrator/rapidocr_plugin，打包产物 rapidocr_v1.zip
 * 通过 install() 从服务器下载解压到 外部存储/assttyus_ng/rapidocr/。
 */
class RapidOcrDetector implements IOcrDetector {
	instance = null;
	initResult: boolean = false;

	constructor(detPath: string, clsPath: string, recPath: string, keysPath: string) {
		// dex 已由 RapidOcr.prepare 通过 runtime.loadDex 加载
		const loaded = com.tyys.rapidocr.RapidOcrPlugin.loadNative(runtime.libraryDir);
		console.log(`RapidOcr loadNative(${runtime.libraryDir}): ${loaded}`);
		this.instance = new com.tyys.rapidocr.RapidOcrPlugin();
		this.initResult = this.instance.init(detPath, clsPath, recPath, keysPath);
		if (!this.initResult) {
			console.error(`RapidOcr init 失败: ${this.instance.getLastError()}`);
		}
		events.on('exit', () => {
			this.destroy(); // 释放 session，否则下次无法 init
		});
	}

	loadImage(bitmap) {
		if (this.initResult === true) {
			const result = this.instance.ocr(bitmap);
			return JSON.parse(result);
		} else {
			return null;
		}
	}

	destroy() {
		if (this.instance) {
			this.instance.destroy();
		}
	}
}

export class RapidOcr implements IOcr {
	detector: RapidOcrDetector;
	typeName: string = 'RapidOcr';

	// 下载地址：rapidocr_v1.zip 需手动上传到服务器
	static get downloadUrl(): string {
		return 'https://asttyys.gzlyyds.cn/assttyys/rapidocr_v1.zip';
	}

	static get basePath(): string {
		return context.getExternalFilesDir(null).getAbsolutePath() + '/assttyus_ng/rapidocr';
	}

	/**
	 * 当前进程的 native ABI 目录名（nativeLibraryDir 以 /lib/arm、/lib/arm64、/lib/x86_64 等结尾）
	 */
	static get abiDir(): string {
		const libDir: string = context.getApplicationInfo().nativeLibraryDir;
		const suffix = libDir.substring(libDir.lastIndexOf('/') + 1);
		const map = { arm: 'armeabi-v7a', arm64: 'arm64-v8a', x86: 'x86', x86_64: 'x86_64' };
		return map[suffix] || 'armeabi-v7a';
	}

	/**
	 * 获取ocr是否安装
	 */
	isInstalled(): boolean {
		const path = RapidOcr.basePath;
		const abi = RapidOcr.abiDir;
		const toCheckPaths = [
			path + '/libs/RapidOcr.dex',
			path + `/libs/${abi}/libonnxruntime.so`,
			path + `/libs/${abi}/libonnxruntime4j_jni.so`,
			path + '/models/ch_PP-OCRv5_det_mobile.onnx',
			path + '/models/ch_PP-LCNet_x0_25_textline_ori_cls_mobile.onnx',
			path + '/models/ch_PP-OCRv5_rec_mobile.onnx',
			path + '/models/ppocrv5_dict.txt',
		];
		let flag = true;
		for (const path of toCheckPaths) {
			if (!files.exists(path)) {
				console.error(`该文件不存在${path}`);
				flag = false;
			}
		}
		return flag;
	}

	/**
	 * 安装：从服务器下载 zip 并解压（约 20MB）
	 */
	install(option) {
		// 已安装（含手动 adb push 部署的情况）直接成功，避免重复下载
		if (this.isInstalled()) {
			option.successCallback();
			return;
		}
		const self = this;
		dialogs.confirm('提示', '大约消耗20Mb，是否下载OCR扩展（RapidOcr）？', function (cr) {
			if (cr) {
				try {
					threads.start(function () {
						try {
							toastLog('下载中，请稍后...');
							const path = RapidOcr.basePath;
							const url = RapidOcr.downloadUrl;
							const r = http.get(url);
							// @ts-expect-error d.ts文件问题
							if (r.statusCode !== 200) {
								toastLog('下载失败');
								option.failCallback();
								return;
							}
							console.log(`解压路径：${path}`);
							files.ensureDir(path + '/rapidocr_v1.zip');
							// @ts-expect-error d.ts文件问题
							files.writeBytes(path + '/rapidocr_v1.zip', r.body.bytes());
							$zip.unzip(path + '/rapidocr_v1.zip', path);
							toastLog('下载完成');
							files.remove(path + '/rapidocr_v1.zip');
							if (self.isInstalled()) {
								option.successCallback();
							} else {
								option.failCallback();
							}
						} catch (e) {
							toast(e);
							console.error($debug.getStackTrace(e));
							option.failCallback();
						}
					});
				} catch (e) {
					toast(e);
					console.error($debug.getStackTrace(e));
					option.failCallback();
				}
			} else {
				option.failCallback();
			}
		});
	}

	prepare() {
		const path = RapidOcr.basePath;
		console.log(`RapidOcr Path: ${path}`);
		runtime.loadDex(path + '/libs/RapidOcr.dex');
		const abi = RapidOcr.abiDir;
		const soLibs = ['libonnxruntime.so', 'libonnxruntime4j_jni.so'];
		for (const so of soLibs) {
			if (!files.exists(runtime.files.join(runtime.libraryDir, so))) {
				files.copy(path + `/libs/${abi}/` + so, runtime.files.join(runtime.libraryDir, so));
			}
		}
		this.detector = new RapidOcrDetector(
			path + '/models/ch_PP-OCRv5_det_mobile.onnx',
			path + '/models/ch_PP-LCNet_x0_25_textline_ori_cls_mobile.onnx',
			path + '/models/ch_PP-OCRv5_rec_mobile.onnx',
			path + '/models/ppocrv5_dict.txt'
		);
		return this.detector;
	}

	findTextByOcr(detector: RapidOcrDetector, getBmpFunc: Function, text: string, timeout: number, region: number[], textMatchMode: string) {
		const startTime = new Date().getTime();
		// eslint-disable-next-line no-constant-condition
		while (true) {
			console.time('ocr.detect');
			let bmp = getBmpFunc();
			if (region) {
				const newBmp = android.graphics.Bitmap.createBitmap(bmp, region[0], region[1], region[2] - region[0], region[3] - region[1]);
				bmp.recycle();
				bmp = newBmp;
			}
			const rs = detector.loadImage(bmp);
			bmp.recycle()
			console.timeEnd('ocr.detect');

			if (rs == null) {
				return [];
			}

			if (region) {
				rs.forEach(item => {
					item.points.forEach(point => {
						point.x += region[0];
						point.y += region[1];
					})
				});
			}

			const res = this.findTextByOcrResult(text, rs, textMatchMode);

			if (res.length > 0) {
				console.log('识别结果', JSON.stringify(rs));
				return res;
			}
			console.log(`RapidOcr 区域识别无匹配（共 ${rs.length} 条原始结果）`, JSON.stringify(rs));
			if (new Date().getTime() - startTime > timeout) {
				return [];
			}
			// 循环延时作为sleep，防止一直在执行ocr导致cpu占用过高，与findTextWithCompareColor的做法保持一致
			sleep(200);
		}
	}

	findText(getBmpFunc: Function, text: string, timeout: number, region: number[], textMatchMode: string): OcrResult[] {
		return this.findTextByOcr(this.detector, getBmpFunc, text, timeout, region, textMatchMode);
	}

	findTextByOcrResult(text: string, ocrResult: OcrResult[], textMatchMode: string, similarityRatio?: number): OcrResult[] {
		let res = [];
		let toDraw = [];
		if (textMatchMode === '包含') {
			const reg = new RegExp(text);
			res = ocrResult.filter(item => reg.test(item.label));
			toDraw = ocrResult.map(item => ({
				region: [item.points[0].x, item.points[0].y, item.points[2].x, item.points[2].y],
				color: reg.test(item.label) ? 'green' : 'red',
				text: item.label + ':' + item.confidence
			}));
		} else /* if (textMatchMode === '模糊') */{
			res = ocrResult.filter(item => {
				item.similar = nlpSimilarity(item.label, text);
				return (item.similar as number) >= (similarityRatio || .7)
			});
			res.sort((a, b) => (b.similar || 0) - (a.similar || 0));
			toDraw = ocrResult.map(item => ({
				region: [item.points[0].x, item.points[0].y, item.points[2].x, item.points[2].y],
				color: item.similar as number >= (similarityRatio || .7) ? 'green' : 'red',
				text: item.label + ':' + item.confidence
			}));
		}
		// 开了绘制有可能绘制内容也被ocr给识别了
		if (drawFloaty.instacne) {
			drawFloaty.draw(toDraw, 200);
		}
		return res;
	}
}

export const rapidOcr = new RapidOcr();
