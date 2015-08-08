module.exports = function(context) {
	var xml = context.svg.builder,
		root = context.svg.root;

	var filter = xml.create('filter', { id: 'line-drop-shadow' });
	filter.append(xml.create('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: 2 }));
	filter.append(xml.create('feOffset', { dx: 1, dy: 2 }));
	filter.append(xml.create('feMerge', { dx: 1, dy: 2 })
		.append(xml.create('feMergeNode'))
		.append(xml.create('feMergeNode', { in: 'SourceGraphic' }))
	);

	root.append(filter);
};