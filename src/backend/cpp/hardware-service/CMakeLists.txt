cmake_minimum_required(VERSION 3.10)

project(HardwareService LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add executable
add_executable(hardware_service main.cpp hardware_interface.cpp) # Example source files

# Add include directories (if needed)
# target_include_directories(hardware_service PUBLIC include)

# Link libraries (e.g., Boost.Asio, serial port library, GPIO library, web framework)
# Example: Linking Boost.Asio (if used for networking)
# find_package(Boost REQUIRED COMPONENTS system asio)
# target_link_libraries(hardware_service PRIVATE Boost::system Boost::asio)

# Example: Linking a serial port library (adjust name as needed)
# find_package(Serial REQUIRED)
# target_link_libraries(hardware_service PRIVATE Serial::Serial)

# Example: Linking Pistache (if used as web framework)
# find_package(Pistache REQUIRED)
# target_link_libraries(hardware_service PRIVATE Pistache::pistache)


message(STATUS "CMake configuration complete for HardwareService.")
