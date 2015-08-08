module.exports = function(context) {
	if (!context.params.title) {
		return;
	}

	var xml = context.svg.builder,
		root = context.svg.root,
		d = context.dimensions;

	var text = xml.create('text', {
		x: d.chartOrigin.x + (d.chartWidth / 2),
		y: d.margin + (d.titleHeight * 3 / 4),
		'font-size': 24,
		'font-family': context.params.style.fontFamily,
		'text-anchor': 'middle'
	});
	text.append(xml.text(context.params.title));

	root.append(text);
};