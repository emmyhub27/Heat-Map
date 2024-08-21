
document.addEventListener("DOMContentLoaded", function(){
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(res => res.json())
  .then(data =>{
    const baseTemp = data.baseTemperature;
    const dataset = data.monthlyVariance;
    console.log(baseTemp);
    console.log(dataset);

    // Declare the chart dimensions and margins.
    const width = 1200;
    const height = 400;
    const padding = 60;

    // Declare the x (horizontal position) scale.
    const xScale = d3.scaleLinear()
        .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year) + 1])
        .range([padding, width - padding]);
  
    // Declare the y (vertical position) scale.
    const yScale = d3.scaleBand()
        .domain(d3.range(1, 13))
        .range([padding, height - padding]);
  
    // Create the SVG container.
    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);
  
    // Add the x-axis.
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format("d"));
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0, "+ (height - padding) +")")
        .call(xAxis);

    // Add the y-axis.
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d => {
                        const date = new Date(0);
                        date.setUTCMonth(d - 1);
                        return d3.timeFormat('%B')(date);
                      });
    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", 'translate(' + padding + ', 0)')
       .call(yAxis);

       //   Add tooltip
       const tooltip = d3.select("#tooltip");

       //    Add svg circle
    svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("width", (width - 2 * padding) / (d3.max(dataset, d => d.year) - d3.min(dataset, d => d.year)))
    .attr("height", yScale.bandwidth())
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month))
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => baseTemp + d.variance)
    .attr("fill", (d) => {
       const variance = d.variance
        if(variance <= -1){
            return "blue"
        }else if(variance <= 0){
            return "steelBlue"
        }else if(variance <= 1){
            return "red"
        }else if(variance <= 2){
            return "orange"
        }else{
            return "purple"
        }
    })
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

    function showTooltip (event, d) {
        tooltip.style("display", "block")
              .data(dataset)
              .style('left', `${event.pageX}px`)
              .style('top', `${event.pageY}px`)
              .attr("data-year", d.year)

              let months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
              ]

                tooltip.html(`${d.year} - ${months[d.month -1]} <br> ${baseTemp + d.variance}℃ <br> ${d.variance}℃`)
              console.log(d.year)
       };

       function hideTooltip () {
        tooltip.style("display", "none")
       }



  })
})
