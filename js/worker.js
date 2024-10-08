/**
 * @file worker.js
 * @description Web worker script for performing Monte Carlo simulations with data aggregation.
 */

/**
 * Generates random numbers using the normal distribution.
 * @returns {number} A normally distributed random number.
 */
function gaussianRandom() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Handles messages received from the main thread.
 * @param {MessageEvent} e - The message event.
 */
self.addEventListener("message", function (e) {
  const { standardDeviations, totalIterations, data } = e.data;

  // Initialize histograms
  const histograms = {
    urban: { SOP: {}, ML: {}, AStar: {} },
    suburban: { SOP: {}, ML: {}, AStar: {} },
    airport: { SOP: {}, ML: {}, AStar: {} },
  };

  // Initialize sum and sum of squares for stats
  const stats = {
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

  for (let i = 0; i < totalIterations; i++) {
    ["urban", "suburban", "airport"].forEach((env) => {
      const envData = data[env];

      let sumSOP = 0,
        sumML = 0,
        sumAStar = 0;

      envData.forEach((item) => {
        const sopValue =
          (item.SOP * item.weight) / 100 +
          standardDeviations.SOP * gaussianRandom();
        const mlValue =
          (item.ML * item.weight) / 100 +
          standardDeviations.ML * gaussianRandom();
        const aStarValue =
          (item.AStar * item.weight) / 100 +
          standardDeviations.AStar * gaussianRandom();

        sumSOP += sopValue;
        sumML += mlValue;
        sumAStar += aStarValue;
      });

      // Update histograms
      updateHistogram(histograms[env].SOP, sumSOP);
      updateHistogram(histograms[env].ML, sumML);
      updateHistogram(histograms[env].AStar, sumAStar);

      // Update stats
      updateStats(stats[env].SOP, sumSOP);
      updateStats(stats[env].ML, sumML);
      updateStats(stats[env].AStar, sumAStar);
    });

    // Throttle progress updates
    if (
      i % Math.floor(totalIterations / 5) === 0 ||
      i === totalIterations - 1
    ) {
      const progress = ((i + 1) / totalIterations) * 100;
      self.postMessage({ progress });
    }
  }

  // Send aggregated data back to the main thread
  self.postMessage({ histograms, stats, totalIterations });
});

/**
 * Updates the histogram with a new value.
 * @param {Object} histogram - The histogram object.
 * @param {number} value - The value to add.
 */
function updateHistogram(histogram, value) {
  const roundedValue = Math.round(value * 10) / 10; // Round to one decimal place
  histogram[roundedValue] = (histogram[roundedValue] || 0) + 1;
}

/**
 * Updates statistical calculations with a new value.
 * @param {Object} stat - The stats object containing sum and sum of squares.
 * @param {number} value - The value to add.
 */
function updateStats(stat, value) {
  stat.sum += value;
  stat.sumSq += value * value;
}
