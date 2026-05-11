# Cornell Notes

## Topic: TCP/IP and OSI model

## Date: 23/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Protocols
- A network protocol is a set of rules that define how data is formatted and processes, allowing computers with different hardware and software to communicate effectively.
- It acts as a common language, ensuring seamless data exchange across a network.

- In networking, we have standard interfaces such as the RJ45 connector, also known as the Ethernet port, and the RJ11 connector, also known as the telephone port. This cable can connect to a Cisco switch and a unify switch, same way with Netgear switch or TP-Link router.

#### TCP IP (Transmission Control Protocol/Internet Protocol) Model
- In the old days, we used to have proprietary protocols, proprietary vendor implementations. That means you can not use the same system between vendors, means you have to use different networks.
- Fortunately, today we don't have that problem because we have the TCP/IP model, which is a standard protocol suite that allows different devices and networks to communicate with each other
- Protocols such as TCP (Transmission Control Protocol) or UDP (User Datagram Protocol) or OSDF (Open Science Data Federation) are standardized across vendors

##### RFC (Request for Comments)
- RFC is a type of publication from the technology community that describes methods, behaviors, research, or innovations applicable to the working of the Internet and Internet-connected systems. It is a formal document that serves as a standard for protocols and technologies used in networking. 
- RFCs are published by the Internet Engineering Task Force (IETF) and are used to define and standardize protocols, procedures, and technologies related to the Internet. They cover a wide range of topics, including network protocols, communication standards, and best practices for network design and implementation.
- You can find more detail about RFCs at [IETF RFCs](https://www.ietf.org/process/rfcs/)
- However, this is still not standardized, because we have different versions of RFCs, for example, we have version one of RFC, version two of RFC, and so on. So, it is important to check the version of RFC when you are implementing a protocol or technology in your network.

##### OSFP (Open Shortest Path First)
- OSFP is a routing protocol used in IP networks to determine the best path for data to travel from source to destination. It is a link-state routing protocol that uses the Dijkstra algorithm to calculate the shortest path to each destination in the network. OSFP is widely used in large enterprise networks and service provider networks due to its efficiency and scalability.
- This is the version two of RFC, which is the standard for OSFP. You can find more detail about OSFP at [RFC 2328](https://www.rfc-editor.org/rfc/rfc2328.html)

#### Standards based model
- International Organization for Standardization (ISO) is an independent, non-governmental international organization that develops and publishes standards for a wide range of industries, including technology and networking. 
- The OSI model is one of the standards developed by ISO to provide a framework for understanding and designing network protocols and communication systems.

#### OSI (Open Systems Interconnection) Model
- The OSI model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven distinct layers. Each layer serves a specific purpose and interacts with the layers directly above and below it. The seven layers of the OSI model are:
  1. **Physical Layer**: This layer is responsible for the physical connection between devices, including the transmission of raw bits over a physical medium (e.g., cables, wireless signals).
  2. **Data Link Layer**: This layer provides error detection and correction, as well as framing of data for transmission. It is responsible for the reliable transfer of data between two directly connected nodes.
  3. **Network Layer**: This layer is responsible for routing and forwarding data packets across different networks. It handles logical addressing (e.g., IP addresses) and determines the best path for data to reach its destination.
  4. **Transport Layer**: This layer ensures the reliable delivery of data between end systems. It provides error recovery, flow control, and segmentation of data into smaller units for transmission.
  5. **Session Layer**: This layer manages sessions or connections between applications. It establishes, maintains, and terminates communication sessions between applications on different devices.
  6. **Presentation Layer**: This layer is responsible for data translation, encryption, and compression. It ensures that data is presented in a format that the receiving application can understand.
  7. **Application Layer**: This layer provides services directly to end-user applications. It includes protocols for email, file transfer, web browsing, and other network services.

#### TCP/IP Model
- Comparing with OSI model, TCP/IP model is a more simplified version that has four layers: Link, Internet, Transport, and Application. The TCP/IP model is widely used in real-world networking and is the basis for the Internet protocol suite.
- In CCNA, we use more **hybrid model**, which is a combination of OSI and TCP/IP models. We use the OSI model for understanding the functions of each layer and the TCP/IP model for practical implementation in real-world networking. Which means: 
- Link layer will be the combination of physical and data link layers, Internet layer will be the same as network layer, transport layer will be the same as transport layer, and application layer will be the application layers.

#### Devices and Protocols
- The equivalent between the real world devices and the OSI model layers are:
  - **Physical layer**: Ethernet / Wifi
  - **Data Link layer**: Ethernet II / PPP (Point-to-Point Protocol) / HDLC (High-Level Data Link Control)
  - **Network layer**: IPv4 / IPv6
  - **Transport layer**: TCP / UDP
  - **Application layer**: HTTP / HTTPS / Telnet / FTP / DNS / DHCP 

- Also, we can put the devices in the OSI model layers, for example:
  - **Physical layer**: Hubs / Repeaters
  - **Data Link layer**: Switches / Bridges
  - **Network layer**: Routers
  - **Application layer**: HTTP / HTTPS / Telnet / FTP / DNS / DHCP 

#### OSI vs TCP/IP Model
- The OSI model is a theoretical framework that provides a comprehensive understanding of network communication, while the TCP/IP model is a practical implementation that is widely used in real-world networking. The OSI model is more detailed and has seven layers, while the TCP/IP model is more simplified with four layers. However, both models serve as important tools for understanding and designing network protocols and communication systems.
  
| TCP / IP Stack | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| **Physical** (Layer 1)       | Transmit raw bitstreams as electrical, optical, or radio signals over physical media like cables or wireless |
| **Data Link** (Layer 2)      | Manages physical addressing (MAC), framing, and error correction between directly connected devices          |
| **Internet** (Layer 3)       | Provides logical addressing and determines the best path for data to travel across networks                  |
| **Transport** (Layer 4)      | Supports communication between end devices across a diverse network                                          |
| **Application** (Layer 5-7)    | Represents data users, encodes and controls the dialog                                                       |

---

### Summary Section (Summary of Notes)

- The OSI model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven distinct layers.
- Each layer serves a specific purpose and interacts with the layers directly above and below it.
- The seven layers of the OSI model are: Physical, Data Link, Network, Transport, Session, Presentation, and Application.
- Understanding the OSI model helps in designing and troubleshooting network protocols and communication systems.