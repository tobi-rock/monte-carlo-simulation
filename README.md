# Monte Carlo Simulation for Utility Analysis

An interactive web application that performs Monte Carlo simulations to analyze utility values for different environments using three methods: SOP, ML, and CF-A\*. The simulation results are visualized through dynamic charts and tables, allowing users to adjust parameters and observe the effects in real-time.

## Table of Contents

- [Monte Carlo Simulation for Utility Analysis](#monte-carlo-simulation-for-utility-analysis)
  - [Usage](#usage)
    - [Running Locally](#running-locally)
    - [Interacting with the Application](#Interacting-with-the-Application)
  - [Configuration](#configuration)

# Usage
## Live Version / Demo Version
You can use the [Live Version](https://tobi-rock.github.io/monte-carlo-simulation/), to access the Simulation directly in your Web-Browser. 
## Running Locally

To run the application locally, simply open the `index.html` file in your web browser.

Due to the use of Web Workers, some browsers may prevent local execution. To avoid this, you can use a local HTTP server.

## Interacting with the Application

1. **Adjust Parameters:**

   - **Iterations**: Set the number of simulation iterations (e.g., 100,000).
   - **Standard Deviations**: Adjust the standard deviations for SOP, ML, and CF-A\* methods using the sliders.

2. **Run the Simulation:**

   - Click the **Recalculate** button to start the simulation with the new parameters.
   - The progress bar will update as the simulation runs.

3. **View Results:**

   - **Distribution Functions**: Observe the distribution of utility values for each environment.
   - **Cumulative Distribution Functions**: Analyze the cumulative probabilities.
   - **Distribution Values**: Review statistical measures in the tables.

## Configuration

- **Iterations**: Controls the number of simulations to run. Higher numbers provide more accurate results but take longer to compute.
- **Standard Deviations**: Adjust the standard deviation in the utility values for each method.
  - **SOP Std Dev**
  - **ML Std Dev**
  - **CF-A\* Std Dev**

These parameters can be adjusted in the menu at the bottom of the application.


---
