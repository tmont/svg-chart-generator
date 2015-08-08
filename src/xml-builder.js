var defaultIndentChar = '  ';

function XmlBuilder() {
}

XmlBuilder.prototype = {
	create: function(tagName, attr) {
		return new XmlElement(tagName, attr);
	},
	cdata: function(content) {
		return new XmlCData(content);
	},
	text: function(content) {
		return new XmlText(content);
	},
	encode: encode
};

function XmlText(content) {
	this.content = content;
}

XmlText.prototype = {
	getMarkup: function(options) {
		return getIndent(options) + encode(this.content);
	},
	toString: function() {
		return this.getMarkup();
	}
};

function XmlCData(content) {
	this.content = content;
}

XmlCData.prototype = {
	getMarkup: function(options) {
		return getIndent(options) + '<![CDATA[' + this.content + ']]>';
	},
	toString: function() {
		return this.getMarkup();
	}
};

function XmlElement(tagName, attr) {
	this.tagName = tagName;
	this.attributes = attr || {};
	this.children = [];
}

XmlElement.prototype = {
	attr: function(name, value) {
		var attrs = {};
		if (typeof(name) === 'string') {
			attrs[name] = value;
		}

		var self = this;
		Object.keys(attrs).forEach(function(name) {
			self.attributes[name] = attrs[name];
		});

		return this;
	},
	append: function(element) {
		if (!element.getMarkup) {
			element = new XmlText(element);
		}

		this.children.push(element);
		return this;
	},
	getMarkup: function(options) {
		options = options || {};
		options.depth = options.depth || 1;

		var attrs = this.attributes;
		var attributes = Object.keys(attrs)
			.map(function(name) {
				var value = attrs[name].toString();
				return name + '="' + encode(value) + '"';
			})
			.join(' ');

		var tag = '<' + this.tagName + (attributes.length ? ' ' + attributes : ''),
			joiner = (options.pretty ? '\n' : '') + getIndent(options);
		if (this.children.length) {
			tag += '>';
			tag += this.children
				.map(function(child) {
					return child.getMarkup({
						indentChar: options.indentChar || defaultIndentChar,
						pretty: options.pretty,
						depth: options.depth + 1
					});
				})
				.join(joiner);

			tag += joiner + '</' + this.tagName + '>';
		} else {
			//no children, self-close it
			tag += '/>';
		}

		if (options.pretty) {
			tag += '\n';
		}

		return tag;
	},
	toString: function() {
		return this.getMarkup();
	}
};

function encode(value) {
	return value.toString()
		.replace(/&/g, '&#38;')
		.replace(/</g, '&#60;')
		.replace(/>/g, '&#62;')
		.replace(/'/g, '&#39;')
		.replace(/"/g, '&#34;');
}

function getIndent(options) {
	options = options || {};
	var indentChar = options.indentChar || defaultIndentChar;
	return options.pretty ? new Array(options.depth || 0).join(indentChar) : '';
}

module.exports = XmlBuilder;

/*
var xml = new XmlBuilder();
var root = xml.create('svg', { version: '1.1' });
root.append(xml.create('text', { 'text-anchor': 'middle' }).append(xml.text('Hello World')));
var markup = root.toString();

 */
