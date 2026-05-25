# ========================================================================
# Makefile for Example to create FreeRTOS project with Make
# ========================================================================

CC := gcc
BIN := my_main

BUILD_DIR := ./build
BUILD_DIR_ABS := $(abspath $(BUILD_DIR))

# Path relative to this makefile
FREERTOS_DIR_REL := ../../..
FREERTOS_DIR := $(abspath $(FREERTOS_DIR_REL)/03_resources/01_FreeRTOS)
KERNEL_DIR := $(FREERTOS_DIR)/01_Source

# Include directories
INCLUDE_DIRS := -I.
INCLUDE_DIRS += -I$(KERNEL_DIR)/include
INCLUDE_DIRS += -I$(KERNEL_DIR)/portable/ThirdParty/GCC/Posix
INCLUDE_DIRS += -I$(KERNEL_DIR)/portable/ThirdParty/GCC/Posix/utils

# FreeRTOS kernel source files
SOURCE_FILES  :=
SOURCE_FILES  += $(KERNEL_DIR)/tasks.c
SOURCE_FILES  += $(KERNEL_DIR)/list.c
SOURCE_FILES  += $(KERNEL_DIR)/queue.c
SOURCE_FILES  += $(KERNEL_DIR)/timers.c
SOURCE_FILES  += $(KERNEL_DIR)/event_groups.c
SOURCE_FILES  += $(KERNEL_DIR)/stream_buffer.c

# Memory management: heap_3 delegates to the system malloc() / free()
SOURCE_FILES  += $(KERNEL_DIR)/portable/MemMang/heap_3.c

# POSIX port (simulates FreeRTOS taks as Linux pthreads)
SOURCE_FILES 	+= $(KERNEL_DIR)/portable/ThirdParty/GCC/Posix/utils/wait_for_event.c
SOURCE_FILES  	+= $(KERNEL_DIR)/portable/ThirdParty/GCC/Posix/port.c

# Application source files
SOURCE_FILES += main.c

# Compiler / linker flags
CFLAGS   := -ggdb3 -O0 -Wall -Wextra
LDFLAGS  := -ggdb3 -pthread

# -D_WINDOWS_ is required by the POSIX port (historical naming artefact)
CPPFLAGS := $(INCLUDE_DIRS) -D_WINDOWS_ -DBUILD_DIR=\"$(BUILD_DIR_ABS)\"

# Disable optional tracing so no extra dependencies are needed
CPPFLAGS += -DprojENABLE_TRACING=0
CPPFLAGS += -DprojCOVERAGE_TEST=0

# Build rules
# ---------------------------------------------------------------------------
OBJ_FILES := $(SOURCE_FILES:%.c=$(BUILD_DIR)/%.o)
DEP_FILES := $(OBJ_FILES:%.o=%.d)

$(BIN): $(BUILD_DIR)/$(BIN)

$(BUILD_DIR)/$(BIN): $(OBJ_FILES)
	-mkdir -p $(@D)
	$(CC) $^ $(LDFLAGS) -o $@

-include $(DEP_FILES)

$(BUILD_DIR)/%.o: %.c Makefile
	-mkdir -p $(@D)
	$(CC) $(CPPFLAGS) $(CFLAGS) -MMD -c $< -o $@

.PHONY: clean
clean:
	-rm -rf $(BUILD_DIR)
