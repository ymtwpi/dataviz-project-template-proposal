import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SportsBarChart = ({ data, countryCode }) => {
    const svgRef = useRef();
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 100, left: 50 };

    useEffect(() => {
        if (!data || data.length === 0 || !countryCode) return;

        const filteredData = data.filter(d => d.Country === countryCode);

        const sportCounts = d3.rollups(
            filteredData,
            v => v.length,
            d => d.Sport
        ).map(([sport, count]) => ({ sport, count }));

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const xScale = d3
            .scaleBand()
            .domain(sportCounts.map(d => d.sport))
            .range([margin.left, width - margin.right])
            .padding(0.2);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(sportCounts, d => d.count)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = g =>
            g.attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale).tickSize(0))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

        const yAxis = g =>
            g.attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale));

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

        svg.append("g")
            .selectAll("rect")
            .data(sportCounts)
            .join("rect")
            .attr("x", d => xScale(d.sport))
            .attr("y", d => yScale(d.count))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(d.count))
            .attr("fill", "#f5deb3");
    }, [data, countryCode]);

    return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default SportsBarChart;