import {createMap, drawMap} from './modules/map.js';
import {createPie, drawPie} from './modules/pie.js';
import {createBar, drawBar, highlightBars} from './modules/bar.js';
import {updateTooltip} from './modules/tooltip.js';

window.addEventListener('load', () => {
  
// 1. get data into JS
// 2. make map
// 3. make pie chart
// 4. make bar chart
// 5. tooltip

async function getData() {
try {
  const jsonData          = await d3.json('./data/world-atlas-topo.json'),
        csvData           = await d3.csv('./data/all_data.csv', (row) => {
          return {
            continent           : row.Continent,
            country             : row.Country,
            countryCode         : row['Country Code'],
            emissions           : +row.Emissions,
            emissionsPerCapita  : +row['Emissions Per Capita'],
            region              : +row.Region,
            year                : +row.Year
          }
        }),
        [mapData, data]   = await Promise.all([jsonData, csvData]),

        extremeYears      = d3.extent(data, d => d.year),
        geoData           = topojson.feature(mapData, mapData.objects.countries).features,
        width             = +d3.select('.chart-container')
                               .node().offsetWidth,
        height            = 300;
  let currentYear         = extremeYears[0],
      currentDataType     = d3.select('input[name="data-type"]:checked')
                              .attr('value');

  createMap(width, width * 4 / 5);
  createPie(width, height);
  createBar(width, height);
  drawMap(geoData, data, currentYear, currentDataType);
  drawPie(data, currentYear);
  drawBar(data, currentDataType, '');

  d3.select('#year')
      .property('min', currentYear)
      .property('max', extremeYears[1])
      .property('value', currentYear)
      .on('input', () => {
        currentYear = +d3.event.target.value;
        drawMap(geoData, data, currentYear, currentDataType);
        drawPie(data, currentYear);
        highlightBars(currentYear);
      });

  d3.selectAll('input[name="data-type"')
      .on('change', () => {
        let active 	= d3.select('.active').data()[0],
            country	= active ? active.properties.country : '';
        currentDataType = d3.event.target.value;
				drawMap(geoData, data, currentYear, currentDataType);
				drawBar(data, currentDataType, country);
      });
		
			
	d3.selectAll('svg')
			.on('mousemove touchmove', updateTooltip);
		
    
} catch (error) {
  console.log(error);
}
}
getData();


});

