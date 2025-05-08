#include "hardware_interface.h"
#include <iostream>
#include <string>
#include <map>
#include <stdexcept> // For exceptions

// --- Placeholder Globals/State ---
// In a real application, this state management would be more robust.
static bool hardware_initialized = false;
static std::map<std::string, double> sensor_values; // Store mock sensor data

// --- Function Implementations ---

bool initialize_hardware() {
    if (hardware_initialized) {
        std::cout << "  [HW Interface] Hardware already initialized." << std::endl;
        return true;
    }
    std::cout << "  [HW Interface] Initializing hardware connections (e.g., opening serial ports, setting up GPIO)..." << std::endl;
    // Simulate initialization
    sensor_values["temp"] = 25.5; // Mock initial temperature
    sensor_values["humidity"] = 60.0; // Mock initial humidity
    hardware_initialized = true; // Set flag on success
    std::cout << "  [HW Interface] Hardware initialization successful." << std::endl;
    return true;
    // In a real scenario, return false if initialization fails
}

bool send_command_to_hardware(const std::string& command) {
    if (!hardware_initialized) {
        std::cerr << "  [HW Interface] Error: Cannot send command, hardware not initialized." << std::endl;
        return false;
    }

    std::cout << "  [HW Interface] Sending command: '" << command << "'" << std::endl;

    // --- Simulate command processing ---
    if (command == "LED_ON") {
        std::cout << "  [HW Interface] Turning LED ON." << std::endl;
    } else if (command == "LED_OFF") {
        std::cout << "  [HW Interface] Turning LED OFF." << std::endl;
    } else if (command.rfind("MOTOR_SPEED=", 0) == 0) { // Check if string starts with "MOTOR_SPEED="
         try {
            int speed = std::stoi(command.substr(12)); // Extract value after '='
             std::cout << "  [HW Interface] Setting motor speed to " << speed << "." << std::endl;
         } catch (const std::invalid_argument& ia) {
             std::cerr << "  [HW Interface] Error: Invalid speed value in command '" << command << "'" << std::endl;
             return false;
         } catch (const std::out_of_range& oor) {
             std::cerr << "  [HW Interface] Error: Speed value out of range in command '" << command << "'" << std::endl;
              return false;
         }
    } else {
        std::cout << "  [HW Interface] Unknown command." << std::endl;
        // return false; // Optionally return false for unknown commands
    }
    // --- End Simulation ---

    // In a real scenario, interact with the actual hardware (serial write, GPIO write)
    // and return true on success, false on failure.
    return true;
}

std::string read_sensor_data(const std::string& sensor_id) {
     if (!hardware_initialized) {
        std::cerr << "  [HW Interface] Error: Cannot read sensor, hardware not initialized." << std::endl;
        return "ERROR: NOT_INITIALIZED";
    }

    std::cout << "  [HW Interface] Reading data from sensor: '" << sensor_id << "'" << std::endl;

    // --- Simulate reading sensor ---
    if (sensor_values.count(sensor_id)) {
        // Simulate slight value change
        sensor_values[sensor_id] += (rand() % 10 - 5) / 10.0; // Add small random fluctuation
        return std::to_string(sensor_values[sensor_id]);
    } else {
        std::cout << "  [HW Interface] Unknown sensor ID." << std::endl;
        return "ERROR: UNKNOWN_SENSOR";
    }
    // --- End Simulation ---

    // In a real scenario, read from the actual hardware (serial read, GPIO read, I2C/SPI communication)
    // and return the formatted data string or an error string.
}

void cleanup_hardware() {
    if (hardware_initialized) {
        std::cout << "  [HW Interface] Cleaning up hardware connections (e.g., closing ports, resetting GPIO)..." << std::endl;
        // Simulate cleanup
        hardware_initialized = false;
        sensor_values.clear();
        std::cout << "  [HW Interface] Hardware cleanup complete." << std::endl;
    } else {
         std::cout << "  [HW Interface] Hardware already cleaned up or never initialized." << std::endl;
    }
}
