
// d3 v4
// fillStyle shadow


//base zoom    // http://bl.ocks.org/mbostock/3680958
//Simplification    // http://bl.ocks.org/mbostock/7755778
                    // https://bl.ocks.org/mbostock/6245977 
                    // https://bost.ocks.org/mike/simplify/

// Map Pan & Zoom
    // https://bl.ocks.org/mbostock/09dd5ad7d6bfd40187e0
    // https://bl.ocks.org/mbostock/c1c0426d50ca8a9f4c97


var width = 800,
    height = 800;

// geoMercator geoConicEqualArea
var projection = d3.geoMercator()
    .center([104, 36])
    .scale(600)
    .translate([width/2, height/2]);
var projection = d3.geoConicConformal();
    // p.rotate([-lnglatCenter[0], 0]);
    projection.rotate([-110, 0]);
    projection.parallels([40, 45]);
    projection.scale(679.3644854473268);
    projection.translate([452.060155518524, 875.5932093078318]);

var zoom = d3.zoom()
    // .translate([0, 0])
    // .scale(1)
    // .scaleExtent([1, 8])

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");
context.fillStyle = "#ffffff";

var path = d3.geoPath()
    .projection(null)
    .context(context);

function _projection(geometry) {
    // 对 topojson.mesh 返回的数据进行 投影 处理，在render之前。比pre-projected topojson文件灵活些。
    geometry.coordinates = geometry.coordinates.map(arc => {
        return arc.map(point => projection(point))
    })
    return geometry
}

d3.json("world-50m.json", function(error, world) {
    if (error) throw error;
    d3.json("china.json", function(error, china) {
        if (error) throw error;

        // china = topojson.presimplify(china)
        // path(topojson.feature(china, china.objects.china_province)) // 970ms
        // path(topojson.mesh(china, china.objects.china_province)) // 420ms   
        
        // separating interior and exterior boundaries
        let interior = topojson.mesh(china, china.objects.china_province)   // 50ms
        interior = _projection(interior)
        let exterior = topojson.mesh(china, china.objects.china_province, function(a, b) { return a === b; })   // 110ms
        exterior = _projection(exterior)

        let countries = topojson.mesh(world, world.objects.countries)
        countries = _projection(countries)
        // console.log(countries)
        
        canvas
            .call(zoom.on("zoom", zoomed))
            // .call(zoom.event)
        draw()
        
        function zoomed() {
            context.clearRect(0, 0, width, height)
            context.save()

            // console.log(d3.event)
            let e = d3.event
            context.translate(e.transform.x, e.transform.y)
            context.scale(e.transform.k, e.transform.k)
            context.lineWidth = 1 / e.transform.k
            // projection.scale(d3.event.scale)

            draw()
            context.restore()
        }

        function draw() {
            let begin = Date.now()
            
            context.beginPath()
            context.fillStyle = 'rgba(255, 0, 0, 0.4)';
            context.strokeStyle = "#c8c8c8"
            path(countries)
            context.fill()
            context.stroke()

            context.beginPath()
            context.save()
            context.shadowOffsetX = 6;
            context.shadowOffsetY = 6;
            context.shadowBlur = 10;
            context.shadowColor = "rgba(0, 0, 0, 1)";
            context.fillStyle = 'rgba(0, 255, 0, 0.4)';
            path(exterior)
            context.stroke()
            context.restore()

            context.beginPath()
            context.strokeStyle = "#444444"
            path(interior)
            context.fillStyle = 'rgba(0, 0, 255, 0.4)';
            context.fill()
            context.stroke()

            console.log(Date.now() - begin)  // 320ms
        }

    });
});
