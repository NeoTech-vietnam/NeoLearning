# Cornell Notes

## Topic: What is a Switch? A Router? What network is this? And what are these?

## Date: 

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Basic Network Communication
- Two devices connected via cable or wireless can communicate with each other using a common communication protocol. The most common protocol used for communication over the Internet is the Internet Protocol (IP).
- When a device wants to communicate with another device, it sends data packets that include the destination IP address and port number. The network infrastructure (routers, switches, etc.) then routes the packets to the correct destination based on the IP address and port number. The receiving device processes the packets and responds accordingly, allowing for communication between the two devices.

#### What is a bus network?
- A bus network is a type of network topology in which all devices are connected to a single communication line, called a bus. In a bus network, data is transmitted in both directions along the bus, and each device can communicate with any other device on the network. However, if the bus fails, the entire network can be affected. Bus networks are relatively simple and inexpensive to set up, but they are not commonly used in modern networking due to their limitations in terms of scalability and reliability.
- `10base2` (10 Mbps, baseband, `2` means 185 meters) and `10base5` (10 Mbps, baseband, `5` means 500 meters) are examples of bus network standards that used coaxial cables. However, these older standards have largely been replaced by newer technologies such as `Ethernet` and `Wi-Fi`.
  - `baseband` refers to the method of transmitting data over the bus, where the entire bandwidth of the bus is used for a single communication channel. This means that only one device can transmit data at a time, and all other devices must wait until the bus is free before they can transmit.
  - `10 Mbps` refers to the maximum data transfer rate of the bus, which is 10 megabits per second. This means that the bus can transmit up to 10 million bits of data per second under ideal conditions. However, in practice, the actual data transfer rate may be lower due to factors such as network congestion, signal interference, and the distance between devices on the bus.
  - `2` and `5` stands for the maximum length of the bus in hundreds of meters. For example, `10base2` allows for a maximum bus length of 185 meters, while `10base5` allows for a maximum bus length of 500 meters. This means that devices connected to the bus must be within these distances from each other in order to communicate effectively.
- `10base5` is also known as `Thicknet`, while `10base2` is known as `Thinnet`. Both of these standards were used in the early days of networking but have since been largely replaced by newer technologies such as `Ethernet` and `Wi-Fi`.

![alt text](<Screenshot from 2026-04-19 15-32-57.png>)

- In the image, PC1 will send a packet to the network through the drop cable that would be transmitted across the cable (make sure to have the terminators at the end of the bus to avoiding bouncing signals could cause a collision in the network).
- `10base2` is created which is easier, cheaper and more flexible than `10base5` but it is still not widely used in modern networking due to its limitations in terms of scalability and reliability. Instead, newer technologies such as `Ethernet` and `Wi-Fi` have become the standard for modern networking.
- There would be a lot of disadvatages using bus network, such as:
  - If the bus fails, the entire network can be affected.
  - It is not scalable, as adding more devices to the bus can lead to increased collisions and decreased performance.
  - It is not secure, as all devices on the bus can see all data transmitted on the bus, making it vulnerable to eavesdropping and unauthorized access.

#### Flat UTP (Unshielded Twisted Pair) Network - 10baseT
- A flat UTP network is a type of network topology in which all devices are connected to a central device, such as a switch or hub, using unshielded twisted pair (UTP) cables. 
- In a flat UTP network, each device is connected to the central device using a separate cable, and the central device is responsible for routing data between devices on the network.
- Getting rid of `10base2` and `10base5` and using `10baseT` (10 Mbps, baseband, twisted pair) is a significant improvement in terms of scalability, reliability, and ease of installation. `10baseT` uses twisted pair cables, which are easier to install and maintain than coaxial cables used in bus networks.
  - `10baseT`, at the end we have RJ45 connectors that are used to connect devices to the central switch or hub. The twisted pair cables used in `10baseT` are also less susceptible to interference and signal degradation than coaxial cables, which can help to improve network performance and reliability. 
  - `10baseT` allows for a `star topology`, where each device is connected to a central switch or hub, which can help to reduce collisions and improve network performance. Overall, the transition from bus networks to flat UTP networks has been a major advancement in networking technology.

![alt text](<Screenshot from 2026-04-19 15-44-00.png>)

- This type of network topology is relatively simple and easy to set up, but it can become congested and slow as more devices are added to the network. Additionally, if the central device fails, the entire network can be affected. Flat UTP networks are commonly used in small to medium-sized businesses and home networks due to their simplicity and cost-effectiveness.

#### Star Topology
- A star topology is a type of network topology in which all devices are connected to a central device, such as a switch or hub. In a star topology, each device is connected to the central device using a separate cable, and the central device is responsible for routing data between devices on the network. 
- Star topologies are commonly used in modern networking due to their scalability, reliability, and ease of maintenance. In a star topology, if one device fails, it does not affect the rest of the network, as each device is connected to the central device independently. 
- Star topologies can be easily expanded by adding more devices to the central device, making them suitable for growing networks. Overall, star topologies are a popular choice for modern networking due to their advantages in terms of performance, reliability, and scalability.

#### Hub
- A hub is a networking device that connects multiple devices in a star topology. It is a simple device that receives data packets from one device and broadcasts them to all other devices connected to the hub. Hubs operate at the physical layer of the OSI model and do not perform any intelligent routing or switching functions. 
- People use `hub` as the central device in a star topology, such as: Cisco Fash Hub 400 series. However, `hubs` are not commonly used in modern networking due to their limitations in terms of performance and security.
- - Hubs are not commonly used in modern networking due to their limitations in terms of performance and security. Since hubs **broadcast** data packets to all devices connected to the hub, they can lead to increased collisions and decreased performance as more devices are added to the network. All the bandwidth of the hub is shared among all devices connected to it, which can lead to congestion and slow network performance.
- Hubs do not provide any security features, as all devices connected to the hub can see all data transmitted on the hub, making it vulnerable to eavesdropping and unauthorized access.

#### Unicast, Broadcast, Multicast
- **Unicast** is a communication method in which data is sent from one device to another specific device on a network. 
  - In unicast communication, the sender specifies the destination device's IP address, and the data is transmitted directly to that device. 
  - Unicast is the most common form of communication on a network and is used for tasks such as web browsing, email, and file transfers.
- **Broadcast** is a communication method in which data is sent from one device to all devices on a network. 
  - In broadcast communication, the sender does not specify a specific destination device, and the data is transmitted to all devices on the network. 
  - Broadcast is used for tasks such as network discovery and address resolution, but it can lead to increased network traffic and decreased performance if used excessively.
- **Multicast** is a communication method in which data is sent from one device to a specific group of devices on a network. 
  - In multicast communication, the sender specifies a multicast group address, and the data is transmitted to all devices that are members of that group. 
  - Multicast is used for tasks such as streaming media and online gaming, where data needs to be sent to multiple devices simultaneously without broadcasting to the entire network.

#### Network with Hub
- Seems to be star topology but it is actually a bus network because the hub is broadcasting the data to all devices connected to it, which can lead to increased collisions and decreased performance as more devices are added to the network. 
- If the hub fails, the entire network can be affected. Overall, while a network with a hub may appear to be a star topology, it is actually a bus network due to the way data is transmitted and shared among devices.

#### CSMA/CD (Carrier Sense Multiple Access with Collision Detection)
- CSMA/CD is a network protocol used in Ethernet networks to manage access to the shared communication medium. It stands for Carrier Sense Multiple Access with Collision Detection. 
- In a CSMA/CD network, devices listen to the communication medium (carrier sense) to determine if it is free before transmitting data. If the medium is busy, the device waits until it becomes free. 
- If two devices transmit at the same time, a collision occurs, and both devices stop transmitting and wait for a random amount of time before attempting to transmit again. 
- This protocol helps to manage access to the shared communication medium and reduce the likelihood of collisions, which can improve network performance and reliability. 
- However, CSMA/CD is not commonly used in modern networking due to the widespread adoption of full-duplex communication and switched Ethernet, which eliminates the need for collision detection.   

#### Bridge
- A bridge is a networking device that connects two or more network segments, allowing them to function as a single network. Bridges operate at the data link layer of the OSI model and are used to divide a large network into smaller segments, which can help to reduce collisions and improve network performance.
- Bridges use MAC addresses to forward data packets between network segments. When a device sends a data packet, the bridge examines the destination MAC address and determines which segment the packet should be forwarded to. If the destination device is on the same segment as the sender, the bridge does not forward the packet. If the destination device is on a different segment, the bridge forwards the packet to the appropriate segment.
- Bridges can be used to connect different types of network media, such as Ethernet and Wi-Fi, allowing devices on different types of networks to communicate with each other. 
- However, bridges are not commonly used in modern networking due to the widespread adoption of switches, which provide more advanced features and better performance than bridges.

#### Switch
- A switch is a networking device that connects devices in a network and uses MAC addresses to forward data packets to the correct destination. Switches operate at the data link layer of the OSI model and are used to create a network that is more efficient and secure than a hub-based network.
- Switches use a process called switching to forward data packets between devices on the network. When a device sends a data packet, the switch examines the destination MAC address and determines which port the packet should be forwarded to. If the destination device is on the same port as the sender, the switch does not forward the packet. If the destination device is on a different port, the switch forwards the packet to the appropriate port.
- Switches can be used to create VLANs (Virtual Local Area Networks), which allow for the segmentation of a network into smaller, more manageable parts. This can help to improve network performance and security by isolating different groups of devices on the network. 
- Switches can also support higher data transfer rates and more simultaneous connections than bridges, making them a better choice for modern networking environments.

##### Difference between Bridge and Switch
- Bridges do things in software, while switches do things in hardware. This means that switches are generally faster and more efficient than bridges, as they can process data packets at the hardware level without the need for software intervention.
- They have what are called **ASIC** (Application-Specific Integrated Circuit) that allows them to process data packets at high speeds, while bridges rely on software to perform the same functions, which can lead to slower performance and increased latency.
- Switches also have more advanced features than bridges, such as support for VLANs (Virtual Local Area Networks), which allow for the segmentation of a network into smaller, more manageable parts. Switches can also support higher data transfer rates and more simultaneous connections than bridges, making them a better choice for modern networking environments.

##### Unmanaged Switch vs Managed Switch
- An unmanaged switch is a simple networking device that allows devices to connect to each other and communicate without any configuration or management. 
  - Unmanaged switches are typically plug-and-play devices that do not require any setup or maintenance. They are suitable for small networks or home use where advanced features and customization are not necessary.
- A managed switch, on the other hand, is a more advanced networking device that allows for configuration and management of the switch's features and settings. 
  - Managed switches provide greater control over the network, allowing administrators to optimize performance, enhance security, and troubleshoot issues. 
  - Managed switches typically support features such as VLANs (Virtual Local Area Networks), Quality of Service (QoS), port mirroring, and remote management capabilities. They are suitable for larger networks or enterprise environments where advanced features and customization are required.

#### Routed Network
- A routed network is a type of network topology in which devices are connected to each other through `routers`. In a routed network, each device is connected to a router, and the routers are responsible for routing data packets between devices on the network.
- Routed networks are commonly used in modern networking due to their scalability, reliability, and ability to connect different types of networks together. In a routed network, if one device fails, it does not affect the rest of the network, as each device is connected to a router independently. 
- Routed networks can be easily expanded by adding more devices and routers to the network, making them suitable for growing networks. Overall, routed networks are a popular choice for modern networking due to their advantages in terms of performance, reliability, and scalability.
![alt text](<Screenshot from 2026-04-19 16-31-29.png>)
- The idea is we need to connect our `LAN` to `WAN` (Wide Area Network) to access the Internet, and we need a router to do that. The router will connect our `LAN` to the `WAN` and route data packets between the two networks. So that it would come to a bigger image where other PCs from other networks can also access the Internet through their own routers.
![alt text](<Screenshot from 2026-04-19 16-34-35.png>)

#### Firewall
- A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules. Firewalls can be hardware-based, software-based, or a combination of both.
- The primary purpose of a firewall is to establish a barrier between a trusted internal network and an untrusted external network, such as the Internet. Firewalls can be configured to block or allow specific types of traffic based on factors such as IP addresses, port numbers, and protocols. 
- Firewalls can also provide additional security features, such as intrusion detection and prevention, virtual private network (VPN) support, and content filtering. Overall, firewalls are an essential component of network security and are used to protect networks from unauthorized access, malware, and other security threats.
![alt text](<Screenshot from 2026-04-19 16-37-33.png>)

##### IDs (Intrusion Detection System) vs IPS (Intrusion Prevention System)
- An Intrusion Detection System (IDS) is a security device that monitors network traffic for signs of malicious activity or policy violations. 
  - IDS can be either network-based, which monitors traffic on a network, or host-based, which monitors activity on a specific device. IDS can generate alerts when suspicious activity is detected, allowing administrators to investigate and respond to potential security threats. 
  - However, IDS does not take any action to prevent the detected intrusion, and it relies on administrators to manually respond to alerts.
- IPS (Intrusion Prevention System) is a security device that not only detects but also takes action to prevent malicious activity or policy violations. IPS can be either network-based or host-based, similar to IDS. 
  - When an IPS detects suspicious activity, it can automatically block the traffic, drop the connection, or take other predefined actions to prevent the intrusion from succeeding. 
  - IPS provides a more proactive approach to network security compared to IDS, as it can actively prevent threats in real-time without requiring manual intervention from administrators.

#### Access Point
- An access point (AP) is a networking device that allows wireless devices to connect to a wired network using Wi-Fi or other wireless communication standards. Access points are typically used in wireless local area networks (WLANs) to provide wireless connectivity to devices such as laptops, smartphones, and tablets. 
- Access points can be standalone devices or integrated into other networking equipment, such as routers or switches. They work by transmitting and receiving wireless signals, allowing devices to connect to the network without the need for physical cables. 
- Access points can also provide additional features, such as support for multiple wireless standards, security protocols, and the ability to manage and monitor wireless connections. 
- Overall, access points are an essential component of modern wireless networking and are used to provide convenient and flexible connectivity for a wide range of devices.

#### POE (Power over Ethernet)
- Power over Ethernet (PoE) is a technology that allows network cables to carry electrical power in addition to data. This means that devices such as access points, IP cameras, and VoIP phones can receive both power and data through a single Ethernet cable, eliminating the need for separate power supplies and reducing the amount of wiring required for network installations. 
- PoE works by using a standardized method of delivering power over Ethernet cables, which can provide up to 15.4 watts of power per port for PoE devices, and up to 30 watts for PoE+ devices.
- PoE is commonly used in situations where it is difficult or impractical to provide separate power sources for network devices, such as in outdoor installations or in areas where power outlets are not readily available. 
- Overall, PoE is a convenient and efficient technology that simplifies network installations and provides greater flexibility for powering network devices.

#### Wi-Fi
- Wi-Fi is a wireless networking technology that allows devices to connect to a network and access the Internet without the need for physical cables. Wi-Fi uses radio waves to transmit data between devices and access points, allowing for convenient and flexible connectivity in homes, businesses, and public spaces.
- Wi-Fi operates on different frequency bands, such as 2.4 GHz and 5 GHz, and supports various wireless standards, including IEEE 802.11a/b/g/n/ac/ax. These standards define the data transfer rates, range, and other characteristics of Wi-Fi networks.
- Wi-Fi networks can be secured using various encryption methods, such as WPA2 (Wi-Fi Protected Access 2) and WPA3 (Wi-Fi Protected Access 3), to protect against unauthorized access and ensure the privacy of data transmitted over the network. 
- Overall, Wi-Fi is a widely used technology that provides convenient and flexible wireless connectivity for a wide range of devices, enabling users to access the Internet and network resources from virtually anywhere within the coverage area of a Wi-Fi network.
![alt text](<Screenshot from 2026-04-19 16-43-37.png>)

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]