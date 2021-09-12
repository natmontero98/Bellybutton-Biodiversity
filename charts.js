function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
 
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samplesArray = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var filteredArray = samplesArray.filter(sampleObj => sampleObj.id == sample);

      //  5. Create a variable that holds the first sample in the array.
      var filteredresult = filteredArray[0];
      // console.log(filteredArray);
      console.log(filteredresult);
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        
      var otuIDS = filteredresult.otu_ids;
      // console.log(otuIDS);
      var otuLabels = filteredresult.otu_labels;
      var sampleValues = filteredresult.sample_values;

      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var topSampleValues = sampleValues.slice(0,10).reverse();
      var yticks = otuIDS.slice(0,10);
      var top10labels = otuLabels.slice(0,10).reverse();

      console.log(yticks);
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
          x: topSampleValues,
          yticks,
          text: otuLabels,
          type: "bar",
          orientation: 'h'
      }];
    
      // 9. Create the layout for the bar chart. 
      var barLayout = {
          title: "Top 10 Bacterial Species",
          xaxis: {title: "Values"},
          yaxis: {title: "OTU Ids"}
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);

        // 1. Create the trace for the bubble chart.
            var bubbleData = [{
                x: otuIDS,
                y: topSampleValues,
                text: otuLabels,
                type: "bubble",
                mode: "markers",
                marker: {
                    size: topSampleValues,
                    color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(93, 164, 214)', 'rgb(255, 144, 14)'],
                    
                }
            }];
    
        
        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
            title: "Top 10 Bacterial Species",
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"},
            hovermode: "closest",
            hoverlabel: otuLabels
        };

        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

        // Create a variable that filters the samples for the object with the desired sample number.
        // 1. Create a variable that filters the metadata array for the object with the desired sample number.
        var matchingobject = metadata.filter(sampleObj => sampleObj.id == sample);

        // 2. Create a variable that holds the first sample in the metadata array.
        var firstmatchingobject = matchingobject[0];

        // 3. Create a variable that holds the washing frequency.
        
        var washingFrequency = parseFloat(firstmatchingobject.wfreq);
    
        // 4. Create the trace for the gauge chart.
        var gaugeData = [
            { 
                domain: { x: [0, 1], y: [0, 1] },
                value: washingFrequency,
                title: { text: "Washing Frequency"},
                type: "indicatior",
                mode: "gauge+number",
                gauge: { 
                    axis: { range: [null, 10], tickwidth:1, tickcolor: "pink"}
                },
                bar: {color: "black"},
                steps: [
                    {range: [0,2], color: "red" },
                    {range: [2,4], color: "orange"},
                    {range: [4,6], color: "yellow"},
                    {range: [6,8], color: "lightgreen"},
                    {range: [8,10], color: "darkgreen"},
                ]

            }
        
        ];
        
        // 5. Create the layout for the gauge chart.
        var gaugeLayout = { 
            width: 600,
            height: 450,
            margin: { t: 0, b: 0 }
        };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);


    });
  }


