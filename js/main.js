// main.js

import { data } from "./data.js";

/**
 * @file main.js
 * @description Main script handling the initialization and management of the Monte Carlo simulation.
 */

/** Class representing the Monte Carlo Simulation application. */
class MonteCarloSimulationApp {
  constructor() {
    // UI Elements
    this.progressBarFill = document.getElementById("progress-bar-fill");
    this.recalculateButton = document.getElementById("recalculate");
    this.iterationsInput = document.getElementById("iterations");
    this.stdDevInputs = {
      SOP: document.getElementById("std-dev-sop"),
      ML: document.getElementById("std-dev-ml"),
      AStar: document.getElementById("std-dev-astar"),
    };
    this.stdDevValues = {
      SOP: document.getElementById("std-dev-sop-value"),
      ML: document.getElementById("std-dev-ml-value"),
      AStar: document.getElementById("std-dev-astar-value"),
    };

    // Charts
    this.charts = {};
    this.cdfCharts = {};

    // Worker Management
    this.numCores = navigator.hardwareConcurrency || 4;
    this.workers = [];
    this.workersCompleted = 0;
    this.totalIterations = 0;

    // Initialize aggregated data structures
    this.aggregatedHistograms = this.initializeAggregatedDataStructure();
    this.aggregatedStats = this.initializeAggregatedStatsStructure();

    // Event Listeners
    this.addEventListeners();

    // Start Simulation
    this.startSimulation();
  }

  /**
   * Initializes the aggregated histograms data structure.
   * @returns {Object} Aggregated histograms.
   */
  initializeAggregatedDataStructure() {
    return {
      urban: { SOP: {}, ML: {}, AStar: {} },
      suburban: { SOP: {}, ML: {}, AStar: {} },
      airport: { SOP: {}, ML: {}, AStar: {} },
    };
  }

  /**
   * Initializes the aggregated stats data structure.
   * @returns {Object} Aggregated stats.
   */
  initializeAggregatedStatsStructure() {
    return {
      urban: {
        SOP: { sum: 0, sumSq: 0 },
        ML: { sum: 0, sumSq: 0 },
        AStar: { sum: 0, sumSq: 0 },
      },
      suburban: {
        SOP: { sum: 0, sumSq: 0 },
        ML: { sum: 0, sumSq: 0 },
        AStar: { sum: 0, sumSq: 0 },
      },
      airport: {
        SOP: { sum: 0, sumSq: 0 },
        ML: { sum: 0, sumSq: 0 },
        AStar: { sum: 0, sumSq: 0 },
      },
    };
  }

  /**
   * Adds necessary event listeners for the application.
   */
  addEventListeners() {
    // Update standard deviation display values
    Object.keys(this.stdDevInputs).forEach((key) => {
      this.stdDevInputs[key].addEventListener("input", () => {
        this.stdDevValues[key].textContent = parseFloat(
          this.stdDevInputs[key].value
        ).toFixed(2);
      });
    });

    // Recalculate button
    this.recalculateButton.addEventListener("click", () => {
      this.startSimulation();
    });
  }

  /**
   * Starts the Monte Carlo simulation.
   */
  startSimulation() {
    const totalIterations = parseInt(this.iterationsInput.value, 10) || 1000;

    const standardDeviations = {
      SOP: parseFloat(this.stdDevInputs.SOP.value),
      ML: parseFloat(this.stdDevInputs.ML.value),
      AStar: parseFloat(this.stdDevInputs.AStar.value),
    };

    // Reset progress bar
    this.progressBarFill.style.width = "0%";

    // Show skeleton loaders
    this.showSkeletonLoaders();

    // Reset variables
    this.workersCompleted = 0;
    this.totalIterations = 0;
    this.aggregatedHistograms = this.initializeAggregatedDataStructure();
    this.aggregatedStats = this.initializeAggregatedStatsStructure();

    // Clear existing workers
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];

    // Distribute iterations among workers
    const iterationsPerWorker = Math.floor(totalIterations / this.numCores);
    let remainingIterations = totalIterations;

    for (let i = 0; i < this.numCores; i++) {
      const iterationsForThisWorker =
        i === this.numCores - 1 ? remainingIterations : iterationsPerWorker;

      remainingIterations -= iterationsForThisWorker;

      const worker = new Worker("js/worker.js");
      worker.progress = 0;

      // Handle messages from the worker
      worker.onmessage = (e) => this.handleWorkerMessage(e, worker);

      // Start worker
      worker.postMessage({
        standardDeviations,
        totalIterations: iterationsForThisWorker,
        data,
      });

      this.workers.push(worker);
    }
  }

  /**
   * Handles messages received from workers.
   * @param {MessageEvent} e - The message event.
   * @param {Worker} worker - The worker sending the message.
   */
  handleWorkerMessage(e, worker) {
    const { histograms, stats, totalIterations, progress } = e.data;

    if (progress !== undefined) {
      // Update progress for this worker
      worker.progress = progress;

      // Calculate total progress across all workers
      const totalProgress =
        this.workers.reduce((sum, w) => sum + (w.progress || 0), 0) /
        this.numCores;

      this.progressBarFill.style.width = `${totalProgress}%`;
    }

    if (histograms && stats) {
      // Merge histograms and stats
      ["urban", "suburban", "airport"].forEach((env) => {
        ["SOP", "ML", "AStar"].forEach((method) => {
          this.mergeHistograms(
            this.aggregatedHistograms[env][method],
            histograms[env][method]
          );
          this.mergeStats(
            this.aggregatedStats[env][method],
            stats[env][method]
          );
        });
      });

      this.totalIterations += totalIterations;
      this.workersCompleted++;

      if (this.workersCompleted === this.numCores) {
        // All workers have completed
        this.hideSkeletonLoaders();
        this.updateCharts();
        this.updateTables();
      }
    }
  }

  /**
   * Merges histograms from workers.
   * @param {Object} target - The target histogram to merge into.
   * @param {Object} source - The source histogram to merge from.
   */
  mergeHistograms(target, source) {
    for (const [key, value] of Object.entries(source)) {
      target[key] = (target[key] || 0) + value;
    }
  }

  /**
   * Merges statistical data from workers.
   * @param {Object} target - The target stats object to merge into.
   * @param {Object} source - The source stats object to merge from.
   */
  mergeStats(target, source) {
    target.sum += source.sum;
    target.sumSq += source.sumSq;
  }

  /**
   * Displays skeleton loaders while data is loading.
   */
  showSkeletonLoaders() {
    // Destroy existing charts if they exist
    Object.values(this.charts).forEach((chart) => chart.destroy());
    Object.values(this.cdfCharts).forEach((chart) => chart.destroy());

    // Display "Loading..." text in the charts
    const loadingMessage = "Loading...";
    const fontSize = 16;
    const font = `${fontSize}px Arial`;
    const textAlign = "center";

    const chartIds = [
      "urban-chart",
      "suburban-chart",
      "airport-chart",
      "cdf-urban-chart",
      "cdf-suburban-chart",
      "cdf-airport-chart",
    ];
    chartIds.forEach((chartId) => {
      const ctx = document.getElementById(chartId).getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.font = font;
      ctx.textAlign = textAlign;
      ctx.fillText(loadingMessage, ctx.canvas.width / 2, ctx.canvas.height / 2);
    });

    // Display "Loading..." in the tables
    document.getElementById("table-urban-data").innerHTML = "<p>Loading...</p>";
    document.getElementById("table-suburban-data").innerHTML =
      "<p>Loading...</p>";
    document.getElementById("table-airport-data").innerHTML =
      "<p>Loading...</p>";
  }

  /**
   * Hides skeleton loaders after data has loaded.
   */
  hideSkeletonLoaders() {
    // No action needed since new charts and tables overwrite the loading messages
  }

  updateCharts() {
    ["urban", "suburban", "airport"].forEach((env) => {
      const envHistograms = this.aggregatedHistograms[env];

      // Prepare data for normal (histogram) chart
      const datasetsForChart = ["SOP", "ML", "AStar"].map((method) => {
        const histogram = envHistograms[method];
        const labels = Object.keys(histogram)
          .map(Number)
          .sort((a, b) => a - b);
        const data = labels.map((label) => histogram[label]);

        return {
          label: method,
          data,
          labels,
          borderColor: this.getMethodColor(method),
          borderWidth: 1,
          fill: false,
          tension: 0,
        };
      });

      // Combine all labels
      const allLabels = Array.from(
        new Set(datasetsForChart.flatMap((dataset) => dataset.labels))
      ).sort((a, b) => a - b);

      // Align datasets for normal charts
      datasetsForChart.forEach((dataset) => {
        dataset.data = allLabels.map((label) => {
          const index = dataset.labels.indexOf(label);
          return index !== -1 ? dataset.data[index] : 0;
        });
        delete dataset.labels; // Remove redundant labels
      });

      // Create normal (histogram) chart
      const ctx = document.getElementById(`${env}-chart`).getContext("2d");
      this.charts[env] = new Chart(ctx, {
        type: "line",
        data: {
          labels: allLabels,
          datasets: datasetsForChart,
        },
        options: this.getChartOptions(
          `${
            env.charAt(0).toUpperCase() + env.slice(1)
          } Environment Distribution Chart`,
          "Total Utility Value",
          "Frequency"
        ),
      });

      // Prepare data for CDF chart
      const cdfDatasets = ["SOP", "ML", "AStar"].map((method) => {
        const histogram = envHistograms[method];
        const cdfData = this.generateCDFDataFromHistogram(histogram);
        return {
          label: method,
          data: cdfData.data,
          borderColor: this.getMethodColor(method),
          borderWidth: 1,
          fill: false,
          tension: 0,
        };
      });

      // Create CDF chart
      const cdfCtx = document
        .getElementById(`cdf-${env}-chart`)
        .getContext("2d");
      this.cdfCharts[env] = new Chart(cdfCtx, {
        type: "line",
        data: {
          labels: cdfDatasets[0].data.map((point) => point.x),
          datasets: cdfDatasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor,
            borderWidth: dataset.borderWidth,
            fill: false,
            tension: 0,
          })),
        },
        options: this.getChartOptions(
          `${
            env.charAt(0).toUpperCase() + env.slice(1)
          } Cumulative Distribution Chart`,
          "Total Utility Value",
          "Cumulative Probability",
          { min: 0, max: 1 }
        ),
      });
    });
  }

  /**
   * Generates CDF data from a histogram.
   * @param {Object} histogram - The histogram object.
   * @returns {Object} An object containing the labels and CDF data.
   */
  generateCDFDataFromHistogram(histogram) {
    const labels = Object.keys(histogram)
      .map(Number)
      .sort((a, b) => a - b);
    const frequencies = labels.map((label) => histogram[label]);

    const total = frequencies.reduce((acc, val) => acc + val, 0);
    let cumulative = 0;

    const data = labels.map((label, index) => {
      cumulative += frequencies[index];
      return { x: label, y: cumulative / total };
    });

    return { labels, data };
  }

  /**
   * Computes the median from a histogram.
   */
  computeMedianFromHistogram(histogram, totalIterations) {
    // Convert histogram to sorted array of {value, cumulativeFrequency}
    const sortedValues = Object.keys(histogram)
      .map(Number)
      .sort((a, b) => a - b);
  
    let cumulativeFrequency = 0;
    for (const value of sortedValues) {
      cumulativeFrequency += histogram[value];
      if (cumulativeFrequency >= totalIterations / 2) {
        return value;
      }
    }
    // In case cumulative frequency does not reach totalIterations/2 due to rounding errors
    return sortedValues[sortedValues.length - 1];
  }

  /**
   * Updates the tables with aggregated statistics.
   */
  updateTables() {
    ["urban", "suburban", "airport"].forEach((env) => {
      const envStats = this.aggregatedStats[env];
      const envHistograms = this.aggregatedHistograms[env];
  
      const stats = ["SOP", "ML", "AStar"].reduce((acc, method) => {
        const stat = envStats[method];
        const mean = stat.sum / this.totalIterations;
        const variance = stat.sumSq / this.totalIterations - mean * mean;
        const stdDev = Math.sqrt(variance);
  
        // Compute median from histogram
        const histogram = envHistograms[method];
        const median = this.computeMedianFromHistogram(histogram, this.totalIterations);
  
        // Calculate confidence intervals
        const ci1 = { lower: mean - stdDev, upper: mean + stdDev };
        const ci2 = { lower: mean - 2 * stdDev, upper: mean + 2 * stdDev };
        const ci3 = { lower: mean - 3 * stdDev, upper: mean + 3 * stdDev };
  
        acc[method] = {
          mean,
          median,
          stdDev,
          ci1,
          ci2,
          ci3,
        };
        return acc;
      }, {});
  
      // Generate table HTML
      const tableDiv = document.getElementById(`table-${env}-data`);
      tableDiv.innerHTML = this.generateTableHTML(env, stats);
    });
  }

  /**
   * Gets the color associated with a method.
   * @param {string} method - The method name.
   * @returns {string} The color string.
   */
  getMethodColor(method) {
    const colors = {
      SOP: "rgba(75, 192, 192, 1)",
      ML: "rgba(153, 102, 255, 1)",
      AStar: "rgba(255, 159, 64, 1)",
    };
    return colors[method] || "rgba(0, 0, 0, 1)";
  }

  /**
   * Generates options for the charts.
   * @param {string} title - The title of the chart.
   * @param {string} xLabel - The label for the x-axis.
   * @param {string} yLabel - The label for the y-axis.
   * @param {Object} yScaleOptions - Additional options for the y-axis scale.
   * @returns {Object} The options object for Chart.js.
   */
  getChartOptions(title, xLabel, yLabel, yScaleOptions = {}) {
    return {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xLabel,
          },
          type: "linear",
        },
        y: {
          title: {
            display: true,
            text: yLabel,
          },
          type: "linear",
          ...yScaleOptions,
        },
      },
    };
  }

  /**
   * Generates HTML for the statistical tables.
   * @param {string} env - The environment name.
   * @param {Object} stats - The statistical data.
   * @returns {string} The HTML string for the table.
   */
  generateTableHTML(env, stats) {
    return `
      <h2 class="text-xl font-bold mb-2">${
        env.charAt(0).toUpperCase() + env.slice(1)
      } Environment</h2>
      <table class="min-w-full bg-white mb-4">
        <thead>
          <tr>
            <th class="py-2"></th>
            <th class="py-2">SOP</th>
            <th class="py-2">ML</th>
            <th class="py-2">CF-A*</th>
          </tr>
        </thead>
        <tbody>
          ${this.generateTableRow("Mean", stats)}
          ${this.generateTableRow("Median", stats, "median")}
          ${this.generateTableRow("Std Dev", stats, "stdDev")}
          ${this.generateTableRow("1σ CI", stats, "ci1")}
          ${this.generateTableRow("2σ CI", stats, "ci2")}
          ${this.generateTableRow("3σ CI", stats, "ci3")}
        </tbody>
      </table>
    `;
  }

  /**
   * Generates a table row for the statistical tables.
   * @param {string} label - The label for the row.
   * @param {Object} stats - The statistical data.
   * @param {string} [key="mean"] - The key to access in the stats object.
   * @returns {string} The HTML string for the table row.
   */
  generateTableRow(label, stats, key = "mean") {
    const formatValue = (value) =>
      typeof value === "number"
        ? value.toFixed(4)
        : `${value.lower.toFixed(4)} to ${value.upper.toFixed(4)}`;
    return `
      <tr>
        <td class="border px-4 py-2">${label}</td>
        <td class="border px-4 py-2">${formatValue(stats.SOP[key])}</td>
        <td class="border px-4 py-2">${formatValue(stats.ML[key])}</td>
        <td class="border px-4 py-2">${formatValue(stats.AStar[key])}</td>
      </tr>
    `;
  }
}

// Instantiate the application
new MonteCarloSimulationApp();
