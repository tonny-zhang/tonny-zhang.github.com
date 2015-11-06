$(document).ready(function () {
    if(document.referrer && document.referrer.indexOf("stackoverflow") !== -1) {
        d3.select("body").append("div")
            .attr("id", "so-header")
            .style("position", "fixed")
            .style("width", "80%")
            .style("left", "10%")
            .style("top", "0%")
            .style("text-align", "center")
            .style("line-height", "200%")
            .style("border", "2px solid black")
            .style("border-top", "none")
            .style("background-color", "orange")
            .html("Need help with d3.js? I offer consulting, just <a href='mailto:lars@larsko.org'>drop me an email</a>!")
            .append("div")
            .style("position", "fixed")
            .style("top", "0%")
            .style("right", "11%")
            .html("<a href='#'>close</a>")
            .on("click", function() { d3.select("#so-header").remove(); });
    }
});
