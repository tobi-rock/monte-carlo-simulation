/**
 * @file data.js
 * @description Exports data for different environments used in the Monte Carlo simulation.
 */

/**
 * Data structure containing the utility values for different environments.
 * @type {Object}
 */
export const data = 
  {
    "urban": [
      { "requirement": "Noise", "weight": 8.24, "SOP": 7, "ML": 5, "AStar": 5 },
      { "requirement": "Safety", "weight": 14.29, "SOP": 9, "ML": 7, "AStar": 8 },
      { "requirement": "Social Acceptance", "weight": 7.69, "SOP": 7, "ML": 3, "AStar": 5 },  
      { "requirement": "Efficiency", "weight": 6.59, "SOP": 5, "ML": 8, "AStar": 8 },
      { "requirement": "Costs", "weight": 6.04, "SOP": 8, "ML": 2, "AStar": 4 },
      { "requirement": "Environmental Impact", "weight": 6.04, "SOP": 5, "ML": 8, "AStar": 7 },
      { "requirement": "Infrastructure Readiness", "weight": 8.24, "SOP": 8, "ML": 4, "AStar": 5 },
      { "requirement": "Scalability", "weight": 8.24, "SOP": 4, "ML": 8, "AStar": 7 },
      { "requirement": "Adaptability", "weight": 6.59, "SOP": 2, "ML": 8, "AStar": 6 },
      { "requirement": "Feasibility", "weight": 5.49, "SOP": 8, "ML": 3, "AStar": 4 },
      { "requirement": "Security", "weight": 7.69, "SOP": 8, "ML": 4, "AStar": 4 },
      { "requirement": "Interoperability", "weight": 3.30, "SOP": 8, "ML": 5, "AStar": 5 },
      { "requirement": "Regulations", "weight": 7.14, "SOP": 8, "ML": 4, "AStar": 4 },
      { "requirement": "Comfort", "weight": 4.40, "SOP": 8, "ML": 6, "AStar": 6 }
    ],
    "suburban": [
      { "requirement": "Noise", "weight": 7.14, "SOP": 7, "ML": 5, "AStar": 5 },
      { "requirement": "Safety", "weight": 14.29, "SOP": 9, "ML": 7, "AStar": 8 },
      { "requirement": "Social Acceptance", "weight": 5.49, "SOP": 7, "ML": 3, "AStar": 5 },  
      { "requirement": "Efficiency", "weight": 8.24, "SOP": 5, "ML": 8, "AStar": 8 },
      { "requirement": "Costs", "weight": 4.40, "SOP": 8, "ML": 2, "AStar": 4 },
      { "requirement": "Environmental Impact", "weight": 6.59, "SOP": 5, "ML": 8, "AStar": 7 },
      { "requirement": "Infrastructure Readiness", "weight": 10.44, "SOP": 8, "ML": 4, "AStar": 5 },
      { "requirement": "Scalability", "weight": 7.69, "SOP": 4, "ML": 8, "AStar": 7 },
      { "requirement": "Adaptability", "weight": 6.59, "SOP": 2, "ML": 8, "AStar": 6 },
      { "requirement": "Feasibility", "weight": 6.59, "SOP": 8, "ML": 3, "AStar": 4 },
      { "requirement": "Security", "weight": 6.59, "SOP": 8, "ML": 4, "AStar": 4 },
      { "requirement": "Interoperability", "weight": 3.85, "SOP": 8, "ML": 5, "AStar": 5 },
      { "requirement": "Regulations", "weight": 5.49, "SOP": 8, "ML": 4, "AStar": 4 },
      { "requirement": "Comfort", "weight": 6.59, "SOP": 8, "ML": 6, "AStar": 6 }
    ],
    "airport": [
      { "requirement": "Noise", "weight": 5.46, "SOP": 7, "ML": 5, "AStar": 5 },
      { "requirement": "Safety", "weight": 14.21, "SOP": 9, "ML": 7, "AStar": 8 },  
      { "requirement": "Social Acceptance", "weight": 4.37, "SOP": 7, "ML": 3, "AStar": 5 },
      { "requirement": "Efficiency", "weight": 8.20, "SOP": 5, "ML": 8, "AStar": 8 },
      { "requirement": "Costs", "weight": 6.01, "SOP": 8, "ML": 2, "AStar": 4 },
      { "requirement": "Environmental Impact", "weight": 7.10, "SOP": 5, "ML": 8, "AStar": 7 },
      { "requirement": "Infrastructure Readiness", "weight": 5.46, "SOP": 8, "ML": 4, "AStar": 5 },
      { "requirement": "Scalability", "weight": 7.10, "SOP": 4, "ML": 8, "AStar": 7 },
      { "requirement": "Adaptability", "weight": 6.56, "SOP": 2, "ML": 8, "AStar": 6 },
      { "requirement": "Feasibility", "weight": 6.56, "SOP": 8, "ML": 3, "AStar": 4 },
      { "requirement": "Security", "weight": 7.10, "SOP": 8, "ML": 4, "AStar": 4 },
      { "requirement": "Interoperability", "weight": 9.29, "SOP": 8, "ML": 5, "AStar": 5 },
      { "requirement": "Regulations", "weight": 6.56, "SOP": 8, "ML": 4, "AStar": 4 },
      { "requirement": "Comfort", "weight": 6.01, "SOP": 8, "ML": 6, "AStar": 6 }
    ]
  }
  