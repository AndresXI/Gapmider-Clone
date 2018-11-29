 
 d3.json("./data/data.json").then(function(data) {
  // Clean data 
  const formattedData = data.map(function(year) { // map through each year 
    // loop through all the countries in each year 
    // and filter out each country that has a null value for the income and life expectancy properties 
    return year["countries"].filter(function(country) { 
      if (country.income || country.life_exp !== null) {
        return country; 
      }
    }).map(function(country) {
      // convert income and life expectancy to numbers 
      country.income = +country.income; 
      country.life_exp = +country.life_exp; 
      // return data 
      return country; 
    }); 
  }); 
  

 }).catch(function(error) {
  console.log(error); 
 });  