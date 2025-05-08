#include "simulation.h"
#include <iostream>
#include <vector>
#include <numeric>
#include <cmath>
#include <thread> // For simulating work
#include <chrono> // For simulating work

// Placeholder for complex simulation logic
double run_complex_simulation(double param1, int param2) {
    std::cout << "  [C++ Simulation] Starting simulation with param1=" << param1
              << ", param2=" << param2 << std::endl;

    // Simulate some heavy computation
    double result = 0.0;
    std::vector<double> data(param2 * 100000, 0.0); // Allocate some memory

    for (int i = 0; i < param2; ++i) {
        for (size_t j = 0; j < data.size(); ++j) {
            data[j] = std::sin(param1 * i * (j + 1)) * std::cos(param2 / (j + 1.0));
        }
        // Accumulate some value based on the computed data
        result += std::accumulate(data.begin(), data.end(), 0.0) / (i + 1.0);
    }

    // Simulate waiting time (e.g., for I/O or just to show it takes time)
    std::this_thread::sleep_for(std::chrono::milliseconds(50 + (param2 * 10)));

    std::cout << "  [C++ Simulation] Finished simulation." << std::endl;
    return result;
}
