// define our margins 
const margin = {
  left: 80,
  right: 20,
  top: 50,
  bottom: 100
}

// Time to update function 
let time = 0; 
 
// defining our width and height 
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;  

// Adding the svg canvas adding a group for our svg elements  
const g = d3.select("#chart-area")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", width + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");    

// Creating our X scale 
const x = d3.scaleLog()
  .base(10)
  .range([0, width])
  .domain([140, 150000]);  // GDP

// Creating our Y scale 
const y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 90]); // life expec.  

// Creating our area
let area = d3.scaleLinear()
  .range([25 * Math.PI, 1500 * Math.PI])
  .domain([2000, 1400000000]); 

const continentColor = d3.scaleOrdinal(d3.schemeSet1);   

// Creating our x label 
const xLabel = g.append("text")
  .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("font-size", "22px")
  .attr("text-anchor", "middle")
  .text("GDP per Capita ($)");
// Creating our y label 
const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -170)
  .attr("y", -40)
  .attr("font-size", "22px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy (Years)"); 
// time label 
const timeLabel = g.append("text")
  .attr("y", height - 10)
  .attr("x", width - 40)
  .attr("font-size", "52px")
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle")
  .text("1800");

// Appending our axis
const xAxisCall = d3.axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$")); 
g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxisCall);   

const yAxisCall = d3.axisLeft(y)  
  .tickFormat(function(d){ return +d; }); 
g.append("g")
  .attr("class", "y axis")
  .call(yAxisCall); 



// Working with our data in d3
d3.json("./data/data.json").then(function(data) {
  // Clean data 
  const formattedData = data.map(function(year) { // map through each year 
    // loop through all the countries in each year 
    // and filter out each country that has a null value for the income and life expectancy properties 
    return year["countries"].filter(function(country) { 
      const dataExists = (country.income && country.life_exp);
      return dataExists; 
    }).map(function(country) {
      // convert income and life expectancy to numbers 
      country.income = +country.income; 
      country.life_exp = +country.life_exp; 
      // return data 
      return country; 
    }); 
  }); 

  // Run code every 0.1 seconds
  d3.interval(function() {
    // Loop back at the end of our data
    time = (time < 214) ? time + 1: 0; 
    update(formattedData[time]); 
  }, 110); 

  // First run of our visualization 
  update(formattedData[0]); 


  // function to update our data every 0.1 seconds
  function update(data) {
    // Standard transition time for the visualization 
    const t = d3.transition().duration(100); 

    // JOIN new data elements with old elements 
    let circles = g.selectAll("circle").data(data, function(d) {
      return d.country; 
    }); 

    // EXIT old elements not present in new data 
    circles.exit()
      .attr("class", "exit")
      .remove(); 

    // ENTER new elements present in new data 
    circles.enter()
      .append("circle")
      .attr("class", "enter")
      .attr("fill", function(d) { return continentColor(d.continent); })
      .merge(circles)
      .transition(t)
        .attr("cy", function(d) { return y(d.life_exp) })
        .attr("cx", function(d) { return x(d.income) })
        .attr("r", function(d) { return Math.sqrt(area(d.population) / Math.PI) }); 

    // Update the time label 
    timeLabel.text(+(time + 1800)); 
  }
   
}).catch(function(error) {
  console.log(error); 
});  