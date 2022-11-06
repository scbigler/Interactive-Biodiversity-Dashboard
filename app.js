function buildMetadata(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let metadata= data.metadata;

    // Filter the data for the object with the desired sample number
    let resultsarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    let result= resultsarray[0]

    // Select the panel with id of `#sample-metadata`
    let demoPanel = d3.select("#sample-metadata");

      // Clear any existing metadata
    demoPanel.html("");

    // Loop through all key/value pairs for selected sample number to populate the Demographic Info panel
    Object.entries(result).forEach(([key, value]) => {
      demoPanel.append("h6").text(`${key}: ${value}`);
    });

  });
}


function buildCharts(sample) {
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
  let samples= data.samples;
  let resultsarray= samples.filter(sampleobject => 
      sampleobject.id == sample);
  let result= resultsarray[0]

  let otu_ids = result.otu_ids;
  let otu_labels = result.otu_labels;
  let sample_values = result.sample_values;
  let sub_name = result.id;

  // Prepare bubble chart layout
  let bubbleLayout = {
    margin: {t: 0},
    xaxis: {title: "OTU ID Number"},
    hovermode: "closest",
    };

  // Prepare bubble chart data
    let bubbleData = [ 
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        }
    }
  ];

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  // ***** Create horizontal bar chart displaying top ten bacteria for selected sample number **********

  let bar_data =[
    {
      // Reverse data to show bacteria with greatest quantity highest on chart. (Descending order)
      y:otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:sample_values.slice(0,10).reverse(),
      text:otu_labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];

  let barLayout = {
    title: `Top 10 Bacteria OTUs Found in Subject No. ${sub_name}`,
    margin: { t: 30, l: 150 }
  };

  Plotly.newPlot("bar", bar_data, barLayout);
});
}
 

function init() {
 // Select the dropdown element ($selDataset)
let selector = d3.select("#selDataset");


d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
  let samples= data.samples;
  let sampleNames = data.names;
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
});
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

// To initialize the dashboard
init();