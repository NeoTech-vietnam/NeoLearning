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

#### OSI (Open Systems Interconnection) Model
- The OSI model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven distinct layers. Each layer serves a specific purpose and interacts with the layers directly above and below it. The seven layers of the OSI model are:
  1. **Physical Layer**: This layer is responsible for the physical connection between devices, including the transmission of raw bits over a physical medium (e.g., cables, wireless signals).
  2. **Data Link Layer**: This layer provides error detection and correction, as well as framing of data for transmission. It is responsible for the reliable transfer of data between two directly connected nodes.
  3. **Network Layer**: This layer is responsible for routing and forwarding data packets across different networks. It handles logical addressing (e.g., IP addresses) and determines the best path for data to reach its destination.
  4. **Transport Layer**: This layer ensures the reliable delivery of data between end systems. It provides error recovery, flow control, and segmentation of data into smaller units for transmission.
  5. **Session Layer**: This layer manages sessions or connections between applications. It establishes, maintains, and terminates communication sessions between applications on different devices.
  6. **Presentation Layer**: This layer is responsible for data translation, encryption, and compression. It ensures that data is presented in a format that the receiving application can understand.
  7. **Application Layer**: This layer provides services directly to end-user applications. It includes protocols for email, file transfer, web browsing, and other network services.

- In networking, we have standard interfaces such as the RJ45 connector, also known as the Ethernet port, and the RJ11 connector, also known as the telephone port. This cable can connect to a Cisco switch and a unify switch, same way with Netgear switch or TP-Link router.

#### TCP IP (Transmission Control Protocol/Internet Protocol) Model
- In the old days, we used to have proprietary protocols, proprietary vendor implementations. That means you can not use the same system between vendors, means you have to use different networks.
- Fortunately, today we don't have that problem because we have the TCP/IP model, which is a standard protocol suite that allows different devices and networks to communicate with each other
- Protocols such as TCP (Transmission Control Protocol) or UDP (User Datagram Protocol) or OSDF (Open Science Data Federation) are standardized across vendors

##### RFC (Request for Comments)
- RFC is a type of publication from the technology community that describes methods, behaviors, research, or innovations applicable to the working of the Internet and Internet-connected systems. It is a formal document that serves as a standard for protocols and technologies used in networking. 
- RFCs are published by the Internet Engineering Task Force (IETF) and are used to define and standardize protocols, procedures, and technologies related to the Internet. They cover a wide range of topics, including network protocols, communication standards, and best practices for network design and implementation.
- You can find more detail about RFCs at [IETF RFCs](https://www.ietf.org/process/rfcs/)

##### OSFP (Open Shortest Path First)
- OSFP is a routing protocol used in IP networks to determine the best path for data to travel from source to destination. It is a link-state routing protocol that uses the Dijkstra algorithm to calculate the shortest path to each destination in the network. OSFP is widely used in large enterprise networks and service provider networks due to its efficiency and scalability.
- This is the version two of RFC, which is the standard for OSFP. You can find more detail about OSFP at [RFC 2328](https://www.rfc-editor.org/rfc/rfc2328.html)

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]