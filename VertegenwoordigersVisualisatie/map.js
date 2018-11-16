var margin = { top:50, left: 50, right: 50, bottom: 50},
    height = window.innerHeight,
    width = window.innerWidth;

var colors= ["red","green","blue","yellow","orange"];

var svg = d3.select("#map")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")

d3.queue()
  .defer(d3.json, "belgium-provinces.json")
  .defer(d3.csv, "locations.csv")
  .await(ready)

var projection = d3.geoMercator()
    .translate([-350,10050])
    .scale(9500)

var path = d3.geoPath()
    .projection(projection)

function ready (error,data,locations) {
    var countries = topojson.feature(data, data.objects.BEL_adm1).features

    svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
            .attr("class", "country")
            .attr("d", path)
            .on("mouseover", function(d){
                
            });

    console.log(locations);

    svg.selectAll(".locationpins")
        .data(locations)
        .enter().append("circle")
        .attr("r",3)
        .attr("fill", "green")
        .attr("stroke", "black")
        .attr("cx", function(d){
            var coords = projection([d.Y, d.X])
            return coords[0];
        })
        .attr("cy",function(d){
            var coords = projection([d.Y, d.X])
            return coords[1];
        })
        .on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r',10)
                .attr('stroke-width',3);
            d3.select(this)
                .append("svg:title")
                .text(function(d) { return d.OrderKlant; });
        })
        .on("mouseout",function(d){
            d3.select(this)
                .transition()
                .duration(500)
                .attr('r',3)
                .attr('stroke-width',1);
        });

    svg.selectAll(".locationnames")
        .data(locations)
        .enter().append("text")
        .attr("class","locationnames")
        .attr("fill",function(d){
            if (d.vertegenwoordiger === "nape") {
                return colors[0];
            }
            else if (d.vertegenwoordiger === "joha"){
                return colors[1];
            }
            else if (d.vertegenwoordiger === "sebi"){
                return colors[2];
            }
            else if(d.vertegenwoordiger === "heco"){
                return colors[3];
            }
            else if (d.vertegenwoordiger === "stva"){
                return colors[4];
            }
        })
        .attr("x", function(d){
            var coords = projection([d.Y, d.X])
            return coords[0];
        })
        .attr("y",function(d){
            var coords = projection([d.Y, d.X])
            return coords[1];
        })
        .text(function(d) {
            return d.vertegenwoordiger
        })
        .attr("dx",10)
        .attr("dy",5);
        
}