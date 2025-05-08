#ifndef HARDWARE_INTERFACE_H
#define HARDWARE_INTERFACE_H

#include <string>

/**
 * @brief Initializes the hardware interface.
 * Connects to ports, sets up GPIO pins, etc.
 * @return true if initialization is successful, false otherwise.
 */
bool initialize_hardware();

/**
 * @brief Sends a command string to the connected hardware.
 * @param command The command to send.
 * @return true if the command was sent successfully, false otherwise.
 */
bool send_command_to_hardware(const std::string& command);

/**
 * @brief Reads data from a specified sensor.
 * @param sensor_id Identifier for the sensor to read.
 * @return A string containing the sensor data or an error message.
 */
std::string read_sensor_data(const std::string& sensor_id);

/**
 * @brief Cleans up hardware resources.
 * Closes ports, resets GPIO pins, etc.
 */
void cleanup_hardware();

#endif // HARDWARE_INTERFACE_H
