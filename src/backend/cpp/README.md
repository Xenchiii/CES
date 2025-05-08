# C++ Backend Services

This directory contains conceptual outlines for C++ based backend services for the ICCT CES website. C++ would typically be used for performance-critical tasks. Communication with the Next.js frontend would usually happen via:

1.  **WebAssembly (WASM):** Compile C++ code to WASM and run it directly in the browser (for client-side calculations) or on the server using Node.js WASM support (less common for backend APIs compared to Python/Java/Node).
2.  **Native Node.js Addons:** Create native modules that can be called from the Next.js backend (API routes or server components).
3.  **Separate C++ Server/API:** Build a standalone C++ web server (using frameworks like Boost.Beast, Pistache, Crow) exposing REST or gRPC endpoints that the Next.js application calls.

## Potential Use Cases

1.  **High-Performance Computing (`hpc-service/`)**
    *   Purpose: Execute computationally intensive simulations, complex algorithm processing (e.g., advanced physics simulations for projects, large-scale data crunching beyond typical Python Pandas capabilities).
    *   Technology: Standard C++, potentially libraries like Eigen (linear algebra), Boost.Compute (GPU), MPI (parallel processing).
    *   Implementation:
        *   **API Server:** Create a C++ server exposing endpoints like `POST /api/hpc/run-simulation`. The Next.js app sends simulation parameters, the C++ server runs the computation and returns results.
        *   **WASM:** Compile the C++ simulation logic to WASM. The Next.js app could load and run this in a Web Worker to avoid blocking the main thread. Suitable if the computation can run client-side.

2.  **Hardware Interaction (`hardware-service/`)**
    *   Purpose: Low-level control of specific hardware requiring high speed or direct OS interaction (e.g., real-time control for robotics projects by GHZ Builders).
    *   Technology: Standard C++, system libraries (`serial`, GPIO libraries specific to the platform like WiringPi for Raspberry Pi), possibly Boost.Asio for networking.
    *   Implementation:
        *   **API Server:** A C++ server directly connected to the hardware, exposing endpoints like `POST /api/hardware/send-command` or providing data streams via WebSockets.
        *   **Native Addon:** Build a Node.js addon that the Next.js backend can `require` or `import` to directly call C++ functions interacting with hardware.

## Example (Conceptual API Server - Placeholder)

```cpp
// placeholder_server.cpp (using a hypothetical simple framework)
#include <iostream>
// #include <some_web_framework.h> // e.g., Boost.Beast, Pistache

// Placeholder for simulation logic
double run_complex_simulation(double param1, int param2) {
    std::cout << "Running C++ simulation with " << param1 << ", " << param2 << std::endl;
    // ... complex calculations ...
    return param1 * param2 * 3.14;
}

int main() {
    // Hypothetical server setup
    // WebFramework::Server server;

    // server.route("/api/hpc/run-simulation", Methods::POST, [](Request req, Response res) {
    //     try {
    //         // Parse parameters from req.body() (e.g., JSON)
    //         double p1 = req.body()["param1"].as<double>();
    //         int p2 = req.body()["param2"].as<int>();
    //
    //         double result = run_complex_simulation(p1, p2);
    //
    //         res.send(Status::Ok, json({"simulationResult": result}));
    //     } catch (const std::exception& e) {
    //         res.send(Status::BadRequest, json({"error": e.what()}));
    //     }
    // });

    std::cout << "Starting C++ placeholder server..." << std::endl;
    // server.listen(9090); // Example port

    // Keepalive or actual server run loop
    while(true) { /* keep server alive */ }

    return 0;
}

// Compilation might look like:
// g++ placeholder_server.cpp -o placeholder_server -std=c++17 -lsome_web_framework_lib -lpthread
```

**Note:** Building robust C++ web services is significantly more complex than using frameworks like Spring Boot or Flask. Consider the development effort and maintainability trade-offs carefully. WASM or Native Addons might be more practical integration points if the C++ logic is self-contained.
