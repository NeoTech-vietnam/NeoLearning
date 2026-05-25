# TODO 1
cmake_minimum_required(VERSION 3.28.3)

# TODO 2
project(main)

# TODO 3
add_executable(main ./sources/main.c ./sources/other.c)

#TODO 4
target_include_directories(main PRIVATE ${CMAKE_SOURCE_DIR}/headers)