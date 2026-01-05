/**
 * 获取系统当前时间并格式化
 * @returns yyyy-MM-dd
 */
export function getCurrentDateStr() {
	// 获取系统当前日期
	const date = new Date();
	// 获取当前年
	const currentYear = date.getFullYear();
	// 获取当前月
	let currentMonth: string | number = date.getMonth() + 1;
	currentMonth = currentMonth <= 9 ? `0${currentMonth}` : currentMonth;
	// 获取当前日
	let currentDay: string | number = date.getDate();
	currentDay = currentDay <= 9 ? `0${currentDay}` : currentDay;
	// yyyy-MM-dd
	return `${currentYear}-${currentMonth}-${currentDay}`;
}

/**
 * 获取系统当前时间并格式化
 * @returns yyyy-MM-dd HH:mm:ss
 */
export function getCurrentFormatDate() {
	// 系统当前时间格式化
	let currentFormatDate = "";
	// 获取系统当前日期
	const date = new Date();
	// 获取当前年
	const currentYear = date.getFullYear();
	// 获取当前月
	let currentMonth: string | number = date.getMonth() + 1;
	currentMonth = currentMonth <= 9 ? `0${currentMonth}` : currentMonth;
	// 获取当前日
	let currentDay: string | number = date.getDate();
	currentDay = currentDay <= 9 ? `0${currentDay}` : currentDay;
	// 时
	const currentHours = date.getHours();
	// 分
	const currentMinutes = date.getMinutes();
	// 秒
	const currentSeconds = date.getSeconds();
	// 毫秒
	const currentMilliSeconds = date.getMilliseconds();
	// yyyy-MM-dd HH:mm:ss
	currentFormatDate = `${currentYear}-${currentMonth}-${currentDay} ${currentHours}:${currentMinutes}:${currentSeconds} ${currentMilliSeconds}`;
	return currentFormatDate;
}

/**
 * 获取当前年
 */
export function getCurrentYear() {
	return new Date().getFullYear();
}

/**
 * 获取当前月
 */
export function getCurrentMonth() {
	return new Date().getMonth() + 1;
}

/**
 * 获取当前日
 */
export function getCurrentDay() {
	return new Date().getDate();
}

/**
 * 获取当前时
 */
export function getCurrentHours() {
	return new Date().getHours();
}

export function getCurrentDate2Seconds(): number {
	return Math.floor(Date.now() / 1000);
}
