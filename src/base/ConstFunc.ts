export function norm(n: number): number {
	if (Math.floor(n) > 0) {
		return 1;
	}
	return 0;
}

/**
 * 对应C 中的zrand伪随机函数
 * 0~max
 * @param max
 */
export function zrand(max): number {
	return Math.floor(Math.random() * (max + 1));
}

/**
 * 对应C 中的INT函数
 * @param n
 * @constructor
 */
export function INT(n: number): number {
	return Math.floor(n);
}
