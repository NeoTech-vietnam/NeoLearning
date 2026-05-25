# Cornell Notes

## Topic: Why is ARP used in networks

## Date: 23/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### ARP (Address Resolution Protocol)
- Not all the networks use MAC addresses for communication. In the old days, we had serial interfaces connected by serial cables from router to router, called point-to-oint connections.
- Ethernet, Wi-Fi, and other LAN technologies use MAC addresses to identify devices on the local network. As many devices can be connectedd to the same network, we need a way to resolve the IP address to the corresponding MAC address. This is where ARP comes in.
- ARP is a protocol used to map an IP address to a MAC address. When a device wants to communicate with another device on the same local network, it sends an ARP request to find out the MAC address associated with the destination IP address. 
- The device with the matching IP address will respond with an ARP reply, providing its MAC address. 
- This allows the sender to encapsulate the data in an Ethernet frame and send it to the correct destination on the local network.
- ARP is essential for the operation of Ethernet and other LAN technologies, as it enables devices to communicate with each other using their IP addresses while still utilizing the underlying MAC addresses for local communication. 
- Without ARP, devices would not be able to communicate effectively on a local network, as they would not be able to determine the MAC address of the destination device based on its IP address.

---

### Summary Section (Summary of Notes)

- MAC addresses allow you to communicate in local networks.
- IP addresses allow you to connect to remote networks.
- Certain technologies like Ethernet and Wi-Fi use MAC addresses for communication, thoses require for local networks. 