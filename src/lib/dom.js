var VD = {},
	doc = document,
	creat = 'createElement',
	byid = 'getElementById',
	tags = 'getElementsByTagName';
var as = ['laydate_box', 'laydate_void', 'laydate_click', 'LayDateSkin', 'skins/', '/laydate.css'];
VD.query = function (node) {
	if (node && node.nodeType === 1) {
		if (node.tagName.toLowerCase() !== 'input') {
			throw new Error('选择器elem错误');
		}
		return node;
	}

	var node = (VD.trim(node)).split(' '),
		elemId = doc[byid](node[0].substr(1)),
		arr;
	if (!elemId) {
		return;
	} else if (!node[1]) {
		return elemId;
	} else if (/^\./.test(node[1])) {
		var find, child = node[1].substr(1),
			exp = new RegExp('\\b' + child + '\\b');
		arr = []
		find = doc.getElementsByClassName ? elemId.getElementsByClassName(child) : elemId[tags]('*');
		VD.each(find, function (ii, that) {
			exp.test(that.className) && arr.push(that);
		});
		return arr[0] ? arr : '';
	} else {
		arr = elemId[tags](node[1]);
		return arr[0] ? elemId[tags](node[1]) : '';
	}
};
VD.trim = function (str) {
	str = str || '';
	return str.replace(/^\s|\s$/g, '').replace(/\s+/g, ' ');
};

VD.each = function (arr, fn) {
	var i = 0,
		len = arr.length;
	for (; i < len; i++) {
		if (fn(i, arr[i]) === false) {
			break
		}
	}
};
//事件监听器
VD.on = function(elem, even, fn){
    elem.attachEvent ? elem.attachEvent('on'+ even, function(){
        fn.call(elem, win.even);
    }) : elem.addEventListener(even, fn, false);
    return VD;
};


module.exports = VD;