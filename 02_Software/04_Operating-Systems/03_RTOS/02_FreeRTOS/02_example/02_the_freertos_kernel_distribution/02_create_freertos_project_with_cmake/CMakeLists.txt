cmake_minimum_required(VERSION 3.15)
project(MyApp_Posix_GCC C)

# ── Path to the FreeRTOS kernel source ───────────────────────────────────────
set(FREERTOS_KERNEL_PATH
    "${CMAKE_CURRENT_SOURCE_DIR}/../../../03_resources/01_FreeRTOS/01_Source"
    CACHE PATH "Path to FreeRTOS kernel source")

# ── Port: GCC_POSIX is auto-detected on Linux, but set explicitly ─────────────
set(FREERTOS_PORT GCC_POSIX CACHE STRING "FreeRTOS port")

# ── Heap implementation: 3 = wraps system malloc/free (best for POSIX sim) ───
set(FREERTOS_HEAP 3 CACHE STRING "FreeRTOS heap implementation [1..5]")

# ── freertos_config: exposes FreeRTOSConfig.h to the kernel ──────────────────
add_library(freertos_config INTERFACE)
target_include_directories(freertos_config SYSTEM INTERFACE
    ${CMAKE_CURRENT_SOURCE_DIR}   # directory containing FreeRTOSConfig.h
)

# ── Pull in the FreeRTOS kernel (defines the 'freertos_kernel' target) ────────
add_subdirectory(${FREERTOS_KERNEL_PATH} freertos_kernel)

# ── Application executable ────────────────────────────────────────────────────
add_executable(my_app main.c)

target_link_libraries(my_app PRIVATE
    freertos_kernel   # kernel + POSIX port + selected heap
    freertos_config   # FreeRTOSConfig.h
    pthread           # required by the POSIX port (tasks → pthreads)
)

target_compile_options(my_app PRIVATE -Wall -Wextra -std=gnu11)
