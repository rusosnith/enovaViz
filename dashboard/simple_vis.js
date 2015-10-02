/********************************************************
*                                                       *
*   dj.js example using Yelp Kaggle Test Dataset        *
*   Eamonn O'Loughlin 9th May 2013                      *
*                                                       *
********************************************************/
 
/********************************************************
*                                                       *
*   Step0: Load data from json file                     *
*                                                       *
********************************************************/
d3.csv("data/graduados.csv", function (datosGraduados) {
     
    var dateFormat = d3.time.format('%m/%d/%Y');
    var numberFormat = d3.format('.2f');

    datosGraduados.forEach(function (d) {
        d.fecha_inicio_curso = dateFormat.parse(d.fecha_inicio_curso);
        d.fecha_fin_curso = dateFormat.parse(d.fecha_fin_curso);
        //d.month = d3.time.month(d.fecha_inicio_curso); // pre-calculate month for better performance
    
    });
/********************************************************
*                                                       *
*   Step1: Create the dc.js chart objects & ling to div *
*                                                       *
********************************************************/
/*var bubbleChart = dc.bubbleChart("#dc-bubble-graph");*/
var pieChart = dc.pieChart("#dc-pie-graph");
var pieChartGraduados = dc.pieChart("#dc-pie-graph-grad");
var volumeChartEdades = dc.barChart("#dc-edades-barras");
var lineChart = dc.lineChart("#dc-line-chart");
var dataTable = dc.dataTable("#dc-table-graph");
var rowChart = dc.rowChart("#dc-row-graph");
 
/********************************************************
*                                                       *
*   Step2:  Run data through crossfilter                *
*                                                       *
********************************************************/
var ndx = crossfilter(datosGraduados);

 
 var dateDimension = ndx.dimension(function (d) {
        return d.fecha_inicio_curso;
    });
   var dateDimensionGroup = dateDimension.group(); 
   
var monthDimension = ndx.dimension(function (d) {
        return d.month;
    });

    var monthDimensionGroup = monthDimension.group();


 var esGraduado = ndx.dimension(function (d) {
        return d.graduados > 0 ? 'Graduado' : 'No Graduado';
    });

    var esGraduadoGroup = esGraduado.group();



/********************************************************
*                                                       *
*   Step3:  Create Dimension that we'll need            *
*                                                       *
********************************************************/
 
    // for volumechart
    var cityDimension = ndx.dimension(function (d) { return d.nombre_centro; });
    var cityGroup = cityDimension.group();
    var cityDimensionGroup = cityDimension.group().reduce();
    
 
    // for pieChart
    var startValue = ndx.dimension(function (d) {
        return d.sexo_alumno;
    });

    var startValueGroup = startValue.group();


    // for edadChart
    var startValueEdad = ndx.dimension(function (d) {
        return d.edad_alumno;
    });

    var startValueEdadGroup = startValueEdad.group();
 
    // For datatable
    var businessDimension = ndx.dimension(function (d) { return d.centro_id; });
/********************************************************
*                                                       *
*   Step4: Create the Visualisations                    *
*                                                       *
********************************************************/
     
 // bubbleChart.width(650)
 //            .height(300)
 //            .dimension(dateDimension)
 //            .group(esGraduadoGroup)
 //            .transitionDuration(1500)
 //            /*.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
 //            .colorDomain([-12000, 12000])*/
         
 //            .x(d3.scale.linear())
 //            .y(d3.scale.linear())
 //            .r(d3.scale.linear())
 //            .keyAccessor(function (p) {
 //                return p.fecha_fin_curso;
 //            })
 //            .valueAccessor(function (p) {
 //                return p.fecha_inicio_curso;
 //            })
 //            .radiusValueAccessor(function (p) {
 //                return p.edad_alumno;
 //            })
 //            .transitionDuration(1500)
 //             .elasticY(true)
 //             .elasticX(true)
 //            .yAxisPadding(1)
 //            .xAxisPadding(1)
 //            .label(function (p) {
 //                return p.key;
 //                })
 //            .renderLabel(true)
 //            .renderlet(function (chart) {
 //                rowChart.filter(chart.filter());
 //            })
 //            .on("postRedraw", function (chart) {
 //                dc.events.trigger(function () {
 //                    rowChart.filter(chart.filter());
 //                });
 //                        });
 //            ;
 
 
pieChart.width(200)
        .height(200)
        .transitionDuration(1500)
        .dimension(startValue)
        .group(startValueGroup)
        .radius(90)
        .colors(["#FF9B9B","#9BC2FF"])
        // .colorDomain(["M", "F"])
        .minAngleForLabel(0)
        .label(function(d) { return d.data.key; })
        .on("filtered", function (chart) {
            dc.events.trigger(function () {
                volumeChartEdades.filterAll();
            });
        });


pieChartGraduados.width(200)
        .height(200)
        .transitionDuration(1500)
        .dimension(esGraduado)
        .group(esGraduadoGroup)
        .radius(90)
        .colors(["#FF9400","gray"])
        // .colorDomain(["M", "F"])
        .minAngleForLabel(0)
        .label(function(d) { return d.data.key; })
        .on("filtered", function (chart) {
            dc.events.trigger(function () {
                volumeChartEdades.filterAll();
            });
        });
        
 
volumeChartEdades.width(650)
            .height(200)
            .dimension(startValueEdad)
            .group(startValueEdadGroup)
            .transitionDuration(1500)
            .centerBar(true)    
            .gap(1)
            .x(d3.scale.linear().domain([5, 100]))
            .elasticY(true)
            .on("filtered", function (chart) {
                dc.events.trigger(function () {
                    lineChart.filterAll()
                });
            })
            .xAxis().tickFormat(function(v) {return v;});   
 
 
lineChart.width(620)
        .height(200)
        .dimension(dateDimension)
        .group(dateDimensionGroup)
        .x(d3.time.scale().domain([new Date(2015, 0, 1), new Date(2015, 6, 31)]))
        .valueAccessor(function(d) {
            return d.value;
            })
        .renderHorizontalGridLines(true)
        .elasticY(true)
        .xUnits(d3.time.months);   
 
rowChart.width(340)
            .height(850)
            .dimension(cityDimension)
            .group(cityGroup)
            .renderLabel(true)
            .colors(["#FF4D4D"])
            .colorDomain([0, 0])
            .renderlet(function (chart) {
                volumeChartEdades.filter(chart.filter());
            })
            .on("filtered", function (chart) {
                dc.events.trigger(function () {
                    volumeChartEdades.filter(chart.filter());
                });
                        });
 
 
dataTable.width(800).height(800)
    .dimension(businessDimension)
    .group(function(d) { return "List of all Selected Businesses"
     })
    .size(100)
    .columns([
        function(d) { return d.nombre_curso; },
        function(d) { return d.nombre_alumno; },
        function(d) { return d.edad_alumno; },
        function(d) { return d.fecha; }
      
    ])
    .sortBy(function(d){ return d.nombre_centro; })
    // (optional) sort order, :default ascending
    .order(d3.ascending);
/********************************************************
*                                                       *
*   Step6:  Render the Charts                           *
*                                                       *
********************************************************/
             
    dc.renderAll();
});