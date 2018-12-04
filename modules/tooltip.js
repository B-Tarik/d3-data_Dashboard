function updateTooltip() {
    const tooltip 	= d3.select('.tooltip'),
		tgt			= d3.select(d3.event.target),
		isCountry	= tgt.classed('country'),
		isBar		= tgt.classed('bar'),
		isArc		= tgt.classed('arc'),
		dataType	= d3.select('input:checked')
						.property('value'),
		units		= dataType === 'emissions' ? 'thousand metric tons' : 'metric tons per capita';
	let	data		= '',
		percentage	= '';
			
	if(isCountry) data 	= tgt.data()[0].properties;
	if(isArc) {
		data 			= tgt.data()[0].data;
		percentage		= `<p>Percentage of total: ${getPercentage(tgt.data()[0])}</p>`
	}
	if(isBar) data 		= tgt.data()[0];

	tooltip
		.style('opacity', +(isCountry || isArc || isBar))
		.style('left', (d3.event.pageX - tooltip.node().offsetWidth / 2) + 'px')
		.style('top', (d3.event.pageY - tooltip.node().offsetHeight - 10) + 'px');
	
	if (data) {
		let dataValue = data[dataType] ?
							data[dataType].toLocaleString() + ' ' + units :
							'Data Not Available';
		tooltip
			.html(`
				<p>Country: ${data.country}</p>
				<p>${formatDataType(dataType)}: ${dataValue}</p>
				<p>Year: ${data.year || d3.select('#year').property('value')}</p>
				${percentage}
			`)
	}
}

function formatDataType(key) {
	return key[0].toUpperCase() + key.slice(1).replace(/[A-Z]/g, c => ' ' + c);
}

function getPercentage(d) {
	let angle 		= d.endAngle - d.startAngle,
		fraction	= 100 * angle / (Math.PI * 2);
	return fraction.toFixed(2) + '%';
}

export {updateTooltip};