// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG
    let
      width = 600,
      height = 400;

    let margin = {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50};
    
    

    // Create the SVG container
    let svg = d3.select('#boxplot')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'pink')
    

    // Set up scales for x and y axes
    // You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
    // d3.min(data, d => d.Likes) to achieve the min value and 
    // d3.max(data, d => d.Likes) to achieve the max value
    // For the domain of the xscale, you can list all three age groups or use
    // [...new Set(data.map(d => d.AgeGroup))] to achieve a unique list of the age group
    let yScale = d3.scaleLinear()
              .domain([d3.min(data, d => d.Likes), d3.max(data, d => d.Likes)])
              .range([height - margin.bottom, margin.top])

    let xScale = d3.scaleBand()
                .domain([...new Set(data.map(d => d.AgeGroup))])
                .range([margin.left, width - margin.right])
                .padding(0.35)


    // Add scales
    let yAxis = svg.append('g')
              .call(d3.axisLeft().scale(yScale))
              .attr('transform', `translate(${margin.left} , 0)`)

    let xAxis = svg.append('g')
              .call(d3.axisBottom().scale(xScale))
              .attr('transform', `translate(0, ${height - margin.bottom})`)



    // Add x-axis label
    svg.append('text')
      .attr('x', width/2)
      .attr('y', height - 15)
      .text('Age Group')
      .style('text-anchor', 'middle')
    

    // Add y-axis label
    svg.append('text')
        .attr('x', 0 - height/2)
        .attr('y', 20)
        .text('Likes')
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'middle');
    

    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending);
        const min = d3.min(values); 
        const q1 = d3.quantile(values, 0.25);
        const med = d3.quantile(values, 0.50);
        const q3 = d3.quantile(values, 0.75);
        const max = d3.max(values)
        return {min, q1, med, q3, max};
    };

    // calculates the quantiles for each age group 
    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.AgeGroup);

    //Draw elements for each age groups quantiles 
    quantilesByGroups.forEach((quantiles, AgeGroup) => {
        const x = xScale(AgeGroup);
        const boxWidth = xScale.bandwidth();

        // Draw vertical lines
        svg.append('line')
            .attr('x1', x + boxWidth / 2)
            .attr('y1',yScale(quantiles.min) )
            .attr('x2', x + boxWidth/2)
            .attr('y2', yScale(quantiles.max))    
            .attr('stroke', 'black')
            .attr('stroke-width', 2)

        // Draw box
        const boxPad = 0.15;
        svg.append('rect')
            .attr('x', x + boxWidth * boxPad)
            .attr('y',  yScale(quantiles.q3))
            .attr('height',  Math.max(0, yScale(quantiles.q1) - yScale(quantiles.q3)))
            .attr('width', boxWidth * (1 - 2 * boxPad))
            .attr('fill', 'pink')
            .attr('stroke', 'black')
        

        // Draw median line
        svg.append('line')
            .attr('x1', x + boxWidth * boxPad)
            .attr('y1',  yScale(quantiles.med))
            .attr('x2', x + boxWidth * (1 - boxPad))
            .attr('y2', yScale(quantiles.med))    
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
        
    });
});

// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.AvgLikes = +d.AvgLikes;
    });
    // Define the dimensions and margins for the SVG
    let
      width = 600,
      height = 400;

    let margin = {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50};

    // Create the SVG container
    let svg = d3.select('#barplot')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'yellow')

    

    // Define four scales
    // Scale x0 is for the platform, which divide the whole scale into 4 parts
    // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
    // Recommend to add more spaces for the y scale for the legend
    // Also need a color scale for the post type

    const x0 = d3.scaleBand()
                  .domain([...new Set(data.map(d => d.Platform))])
                  .range([margin.left, width - margin.right])
                  .padding(0.3)
      

    const x1 = d3.scaleBand()
                 .domain([...new Set(data.map(d => d.PostType))])
                  .range([0,x0.bandwidth()])
                  .padding(0.2)
      

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.AvgLikes)])
                .range([height - margin.bottom, margin.top]);
      

    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.PostType))])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);    
         
    // Add scales x0 and y  
    let yAxis = svg.append('g')
              .call(d3.axisLeft(y))
              .attr('transform', `translate(${margin.left} , 0)`)

    let xAxis = svg.append('g')
              .call(d3.axisBottom(x0))
              .attr('transform', `translate(0, ${height - margin.bottom})`)

    // Add x-axis label
    // Add y-axis label
        // Add x-axis label
    svg.append('text')
      .attr('x', (margin.left + (width - margin.right)) / 2)
      .attr('y', height - 15)
      .text('Platform')
    
    // Add y-axis label
    svg.append('text')
        .attr('x', 0 - height/2)
        .attr('y', 20)
        .text('Avg Likes')


  // Group container for bars
    const barGroups = svg.selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x0(d.Platform)},0)`);

  // Draw bars
    barGroups.append("rect")
            .attr('x', d => x1(d.PostType))
            .attr('y', d => y(d.AvgLikes))
            .attr('height', d => (height - margin.bottom) - y(d.AvgLikes))
            .attr('width', x1.bandwidth())
            .attr('fill',  d => color(d.PostType))
      

    // Add the legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150}, ${margin.top})`);

    const types = [...new Set(data.map(d => d.PostType))];
 
    types.forEach((type, i) => {

    // Alread have the text information for the legend. 
    // Now add a small square/rect bar next to the text with different color.
      legend.append('rect')
            .attr("x", 60)
            .attr("y", i * 20 + 12)
            .attr('height', 15)
            .attr('width', 15)
            .attr('fill', color(type))
      legend.append("text")
          .attr("x", 20)
          .attr("y", i * 20 + 12)
          .text(type)
          .attr("alignment-baseline", "middle");
  });

});

// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

const socialMediaTime = d3.csv("socialMediaTime.csv");
socialMediaTime.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.AvgLikes = +d.AvgLikes;
    });
    
    // Define the dimensions and margins for the SVG
    let
      width = 600,
      height = 500;

    let margin = {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50};
    
    // Create the SVG container
     let svg = d3.select('#lineplot')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', 'lightblue')
    

    // Set up scales for x and y axes 
     let yScale = d3.scaleLinear()
              .domain([0, d3.max(data, d => d.AvgLikes + 50)])
              .range([height - margin.bottom, margin.top])
    let xScale = d3.scaleBand()
                .domain([...new Set(data.map(d => d.Date))])
                .range([margin.left, width - margin.right])
                
    // Draw the axis, you can rotate the text in the x-axis here
let xAxis = svg.append('g')
              .call(d3.axisBottom().scale(xScale))
              .attr('transform', `translate(0, ${height - margin.bottom})`)
              .style("text-anchor", "end")
              .selectAll('text')
              .attr("transform", "rotate(-25)")

let yAxis = svg.append('g')
              .call(d3.axisLeft().scale(yScale))
              .attr('transform', `translate(${margin.left}, 0)`)


    // Add x-axis label
    // Add y-axis label
    svg.append('text')
    .attr('x', width/2)
    .attr('y', height - 15)
    .style('text-anchor', 'middle')

    svg.append('text')
        .attr('x', 0-height/2)
        .attr('y', 20)
        .text('Avg Likes')
        .style('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')


    // Draw the line and path. Remember to use curveNatural. 
    let line = d3.line()
            .x(d => xScale(d.Date) + xScale.bandwidth()/2)
            .y(d => yScale(d.AvgLikes))
            .curve(d3.curveNatural)

    let path = svg.append('path')
                  .datum(data)
                  .attr('d', line)
                  .attr('stroke', 'black')
                  .attr('fill', 'none')

});
