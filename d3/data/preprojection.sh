/f/source/git_projects/nodejs/node_modules/topojson/bin/topojson \
    -q 1e5 \
    -o test.json \
    --projection='width = 960, height = 960, d3.geo.mercator().translate([width / 2, height / 2]).scale((width - 1) / 2 / Math.PI)' \
    -- test=world-110m.json    