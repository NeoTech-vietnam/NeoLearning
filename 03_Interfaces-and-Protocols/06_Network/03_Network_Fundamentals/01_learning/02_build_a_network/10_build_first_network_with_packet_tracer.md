# Cornell Notes

## Topic: Build a Network with Packet Tracer

## Date: 

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Check ipconfig
- **Windows**:
  - To check the IP configuration of a device, you can use the `ipconfig` command.

```cmd
ipconfig
```
- This command will display the current network configuration of the device, including the IP address, subnet mask, default gateway, and other relevant information. It is a useful tool for troubleshooting network issues and verifying that the device is properly connected to the network.
- **Linux/Mac**:
  - On Linux or Mac, you can use the `ifconfig` command to check the IP configuration of a device.
  - *Note: Make sure you have installed the `net-tools` package to use the `ifconfig` command on Linux, as it may not be included by default in some distributions.*

```bash
ifconfig
```

#### MAC Address
- The `MAC` (Media Access Control) address is a unique identifier assigned to network interfaces for communications on the physical network segment. 
- It is a hardware address that is used to identify devices on a local network. 
- The MAC address is typically assigned by the manufacturer of the network interface card (NIC) and is stored in the hardware of the device. 
- It is a 48-bit address that is usually represented in hexadecimal format, such as `00:1A:2B:3C:4D:5E`. The MAC address is used for communication within a local network and is essential for the operation of the Ethernet protocol. 
- It allows devices to communicate with each other on the same network segment without the need for IP addresses.
- `MAC` address nowadays can be changed or spoofed using software tools, which can lead to security vulnerabilities if not properly managed. 
- It is important to ensure that MAC addresses are unique within a network to avoid conflicts and ensure proper communication between devices.

#### Subnet Mask
- A `subnet mask` is a 32-bit number that is used to divide an IP address into two parts: the network portion and the host portion. 
- It is used to determine which part of an IP address represents the network and which part represents the host. 
- The subnet mask is typically represented in dotted decimal notation, such as `255.255.2255.0`. 
- For example, if the subnet mask is `255.255..255.0`
  - The first three octets (255.255.255) represent the network portion
  - The last octet (0) represents the host portion.

- `Network portion`: This part of the IP address identifies the specific network to which the device belongs. It is used to route traffic between different networks.
- `Host portion`: This part of the IP address identifies the specific device within the network. It is used to communicate with other devices on the same network.
- The subnet mask is essential for determining the range of IP addresses that can be used within a network and for routing traffic between different networks. It allows devices to communicate with each other within the same network and helps to manage the allocation of IP addresses efficiently.

#### Default Gateway
- A `default gateway` is a device that serves as an access point or IP router that a networked computer uses to send information to a computer in another network or the internet.
- It is typically a router that connects the local network to the wider internet or to other networks.
- The default gateway is used when a device needs to communicate with a device that is outside of its local network. 
- When a device sends a packet to a destination that is not on the same local network, it will send the packet to the default gateway, which will then forward the packet to the appropriate destination. 
- The default gateway is essential for enabling communication between different networks and for providing access to the internet. It allows devices on a local network to communicate with devices on other networks and to access resources on the internet. 
- It is important to configure the default gateway correctly to ensure that devices can communicate with other networks and access the internet without issues. 
- If the default gateway is not configured correctly, devices may not be able to communicate with other networks or access the internet, which can lead to connectivity problems and hinder the functionality of the network.
- For example, if a device has an IP address of `192.168.1.254` and a subnet mask is `255.255.255.0`, the default gateway would typically be set to  `192.168.1.1`, which is the IP address of the router that connects the local network to the wider internet.

#### Ping
- The `ping` command is a network utility used to test the reachability of a host on an IP network and to measure the round-trip time for messages sent from the originating host to a destination computer.
- It works by sending Internet Control Message Protocol (ICMP) Echo Request messages to the target host and waiting for an Echo Reply. 
- The `ping` command is commonly used to troubleshoot network connectivity issues and to check if a specific host is reachable on the network. 
- It can also be used to measure the latency or response time of a network connection. 
- When you run the `ping` command, it will display the results, including the number of packets sent, received, and lost, as well as the round-trip time for each packet. 
- If the target host is reachable, you will receive a response indicating that the host is alive and the round-trip time. If the target host is not reachable, you will receive an error message indicating that the request timed out or that the destination host is unreachable. 
- The `ping` command is a valuable tool for network administrators and users to diagnose network issues and to verify the connectivity of devices on a network.

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]