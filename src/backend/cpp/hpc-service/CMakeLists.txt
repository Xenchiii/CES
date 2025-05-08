cmake_minimum_required(VERSION 3.10)

project(HpcService LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add executable
add_executable(hpc_service main.cpp simulation.cpp) # Example source files

# Add include directories (if needed)
# target_include_directories(hpc_service PUBLIC include)

# Link libraries (e.g., Boost, Eigen, web framework)
# find_package(Boost REQUIRED COMPONENTS system program_options)
# find_package(Eigen3 REQUIRED)

# target_link_libraries(hpc_service PRIVATE
#   Boost::system
#   Boost::program_options
#   Eigen3::Eigen
#   # Add web framework library here (e.g., Pistache::pistache)
# )

# Example for Pistache (if installed via system package manager or vcpkg)
# find_package(Pistache REQUIRED)
# target_link_libraries(hpc_service PRIVATE Pistache::pistache)

# Installation (optional)
# install(TARGETS hpc_service DESTINATION bin)

message(STATUS "CMake configuration complete for HpcService.")
