import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./BarChart.css";

const BarChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load data from CSV
    d3.csv("/data.csv").then((csvData) => {
      const formattedData = csvData.map(d => ({ label: d.label, value: +d.value }));
      setData(formattedData);
      setFilteredData(formattedData);
      setCategories(["All", ...new Set(formattedData.map(d => d.label))]);
      renderChart(formattedData);
    });
  }, []);

  const handleFilterChange = (e) => {
    const selectedCategory = e.target.value;
    const filtered = selectedCategory === "All" ? data : data.filter(d => d.label === selectedCategory);
    setFilteredData(filtered);
    renderChart(filtered);
  };

  const renderChart = (chartData) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content
  
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  
    const x = d3.scaleBand()
      .domain(chartData.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top]);
  
    const svgContent = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .call(d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", (event) => {
          svgContent.attr("transform", event.transform);
        }));
  
    svgContent.append("g")
      .attr("class", "bars")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(chartData)
      .join("rect")
      .attr("x", d => x(d.label))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth())
      // Add mouseover event listener
      .on("mouseover", (event, d) => {
        const tooltip = svg.append("g")
          .attr("class", "tooltip")
          .style("pointer-events", "none");
  
        tooltip.append("rect")
          .attr("fill", "white")
          .attr("width", 100)
          .attr("height", 50)
          .attr("x", x(d.label) + x.bandwidth() / 2 - 50)
          .attr("y", y(d.value) - 60)
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("stroke", "black");
  
        tooltip.append("text")
          .attr("x", x(d.label) + x.bandwidth() / 2)
          .attr("y", y(d.value) - 40)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(`${d.label}: ${d.value}`);
      })
      // Add mouseout event listener
      .on("mouseout", () => {
        svg.selectAll(".tooltip").remove();
      });
  
    svgContent.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
  
    svgContent.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };
  

  return (
    <div className="chart-container">
      <div className="controls">
        <label htmlFor="filter">Filter by category: </label>
        <select id="filter" onChange={handleFilterChange}>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <svg ref={svgRef} width={800} height={400}></svg>
    </div>
  );
};

export default BarChart;
