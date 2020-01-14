/**
 * 对JQuery Cookie操作扩展
 * <P>
 * 所需JS:<p>
 * jquery-plugin-cookie.js
 * json2.js
 */

/**
 * JQuery Cookie扩展的工具类
 */
function JQueryCookieUtil() {};

/**
 * Cookie保存路径
 */
JQueryCookieUtil.COOKIE_PATH = '/';

/**
 * 保存数据至Cookie
 * 
 * @param key
 * @param value
 */
JQueryCookieUtil.setCookie = function(key, value) {
	// 转换为字符串形式保存
	var valueStr = JSON.stringify(value);
	$.cookie(key, valueStr, {
		path : JQueryCookieUtil.COOKIE_PATH
	});
};

/**
 * 读取Cookie中的数据
 * 
 * @param key
 * @returns
 */
JQueryCookieUtil.getCookie = function(key) {
	var value = $.cookie(key);
	value = JSON.parse(value);
	return value;
};

