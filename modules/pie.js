function createPie(width, height) {
  const pie = d3.select('#pie')
                .attr('width', width)
                .attr('height', height);

  pie.append('g')
		.attr('transform', `translate(${width/2}, ${height/2 +10})`)
		.classed('chart', true)

  pie.append('text')
		.attr('x', width/2)
		.attr('y', '16px')
		.attr('font-size', '24px')
		.style('text-anchor', 'middle')
			.classed("pie-title", true);
}

function drawPie(data, currentYear) {
	const pie   	= d3.select('#pie'),
		arcs  		= d3.pie()
						.sort((a, b) => {
								if(a.continent < b.continent) return -1;
								if(a.continent > b.continent) return 1;
								return a.emissions - b.emissions;
							})
						.value(d => d.emissions),
        path  		= d3.arc()
						.outerRadius(+pie.attr('height') / 2 - 50)
						.innerRadius(0),
        yearData	= data.filter(d => d.year === currentYear),
        continents 	= [];
	let i 			= 0,
		max 		= yearData.length;
	for(i; i < max; i+=1) {
		let continent = yearData[i].continent;
		if (!continents.includes(continent)) {
			continents.push(continent);
		}
	}

  	const colorScale  	= d3.scaleOrdinal()
							.domain(continents)
							.range(['#ab47bc', '#7e57c2', '#26a69a', '#42a5f5', '#78909c']),
        update      	= pie
							.select('.chart')
							.selectAll('.arc')
							.data(arcs(yearData));
                    
	update
		.exit()
		.remove();

	update
		.enter()
		.append('path')
		.classed('arc', true)
		.attr('stroke', '#dff1ff')
		.attr('stroke-width', '0.25px')
		.merge(update)
		.attr('fill', d => colorScale(d.data.continent))
		.attr('d', path);
	
	pie.select('.pie-title')
		.text('Total emissions by continent and region, ' + currentYear);
}



export {createPie, drawPie};