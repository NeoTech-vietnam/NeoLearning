# Cornell Notes

## Topic: Network Basics: What is a network?

## Date: 10/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### What is a Network?
- A computer network is a set of computers sharing resources located on or provided by network nodes.
- Computers use common **communication protocols** over digital interconnection to communicate with each other.
- These interconnections are made up of telecommunication network technologies based on physically wired, optical, and wireless radio-frequency methods that may be arranged in a variety of network topologies.
- The nodes of a computer network can include personal computers, servers, networking hardware, or other specialized or general-purpose hosts.
- They are identified by network addresses and may have hostnames. Hostnames serve as memorable labels for the nodes and are rarely changed after initial assignment.
- Network addresses serve for locating and identifying the nodes by communication protocols such as the Internet Protocol.

#### What is a Host?
- A network host is a computer or other device connected to a computer network. A host may work as a server offering information resources, services, and applications to users or other hosts on the network. Hosts are assigned at least one network address.
- A computer participating in networks that use the Internet protocol suite may also be called an `IP host`. Specifically, computers participating in the Internet are called `Internet hosts`. Internet hosts and other IP hosts have one or more IP addresses assigned to their network interfaces. The addresses are configured either manually by an administrator, automatically at startup by means of the `Dynamic Host Configuration Protocol` (DHCP), or by stateless address autoconfiguration methods.
- The nodes of a computer network can include personal computers, servers, networking hardware, or other specialized or general-purpose hosts.

#### Network Today
- The Internet is the most well-known computer network, and it is a global system of interconnected computer networks that use the Internet protocol suite (TCP/IP) to link devices worldwide.
- We use either TCP/IP version 4 (IPv4) or version 6 (IPv6) to communicate over the Internet. IPv4 uses 32-bit addresses, while IPv6 uses 128-bit addresses, allowing for a much larger number of unique IP addresses. 
- IP addresses are allocated through DHCP or stateless address autoconfiguration methods, and they are used to identify and locate devices on the network.
- Computer devices use IPv4 and IPv6 and other protocols such as `FTP` (File Transfer Protocol), `HTTP` (Hypertext Transfer Protocol), and `HTTPS` (Hypertext Transfer Protocol Secure) or `DNS` (Domain NetWork System) to communicate over the Internet. These protocols define how data is formatted and transmitted between devices, allowing for seamless communication across the network.

#### DNS (Domain Name System)
- The `Domain Name System` (DNS) is a hierarchical and decentralized naming system for computers, services, or other resources connected to the Internet or a private network. It translates more readily memorized domain names to the numerical IP addresses needed for locating and identifying computer services and devices with the underlying network protocols.
- For example, the domain name `www.example.com` might translate to the IP address `192.168.0.1`. This allows users to access websites and services using easy-to-remember names instead of complex numerical addresses.
- **Note:** Devices on a network do not use names, they use IP addresses and MAC (Media Access Control) address. The DNS system is what allows us to use human-friendly names instead of having to remember IP addresses.

#### Port Numbers
- Port numbers are used to identify specific processes or services on a networked device. They allow multiple services to run on a single device without conflict. For example, web servers typically use port 80 for `HTTP` (Hypertext Transfer Protocol) and port 443 for HTTPS (Hypertext Transfer Protocol Secure). When a client wants to connect to a service, **it specifies the port number along with the IP address to ensure it reaches the correct service**.
```http http://www.example.com:80 ```
- In this example, the client is connecting to `www.example.com` on port `80`.
- `HTTPS` (Hypertext Transfer Protocol Secure) is a secure version of HTTP that uses encryption to protect data transmitted between the client and server. It typically uses port `443`. Also known as SSL (Secure Sockets Layer) or TLS (Transport Layer Security), HTTPS ensures that sensitive information such as passwords, credit card numbers, and personal data is transmitted securely over the Internet.
- `SSL`: is an older technology that contains some security flaws. Transport Layer Security (TLS) is the modern, more secure version of SSL. When we refer to HTTPS, we are typically referring to the use of TLS for secure communication.

#### NIC (Network Interface Card)
- So called Network Interface Controller, Network Adapter, LAN adapter or physical network interface is a computer hardware component that connects a computer to a computer network. It can be used for both wired and wireless connections. The NIC provides the physical interface for the computer to communicate with the network, allowing it to send and receive data packets. It typically includes a unique `MAC` (Media Access Control) address that identifies the device on the network. 
- Typically `MAC` address is a **48-bit** address that is assigned to the NIC by the manufacturer and is used for communication on the local network segment. The MAC address is unique to each NIC and is used to identify the device on the network. It is important to note that while the MAC address is unique, it can be spoofed or changed in some cases, which can lead to security vulnerabilities if not properly managed.
- There would be some standards for `NICs`, such as `RJ45 UTP` (Unshielded Twisted Pair) for wired connections and `IEEE 802.11` for wireless connections. The NIC is responsible for converting data from the computer into a format that can be transmitted over the network and vice versa, enabling communication between devices on the network.
- It also used old version called `10base2` (10 Mbps, baseband, 2-wire) that used coaxial cables and `10base5` (10 Mbps, baseband, 5-wire) that also used coaxial cables. However, these older standards have largely been replaced by newer technologies such as `Ethernet` and `Wi-Fi`.
- There also are `SFP` (Small Form-factor Pluggable) and `SFP+` (Small Form-factor Pluggable Plus) which we can connect to an SFP that are used for high-speed network connections, such as those found in data centers and enterprise networks. These modules can support speeds of up to 10 Gbps or higher, making them suitable for high-bandwidth applications.

#### DHCP (Dynamic Host Configuration Protocol)
- The `Dynamic Host Configuration Protocol` (`DHCP`) is a network protocol used to automatically assign IP addresses and other network configuration parameters to devices on a network. 
- `DHCP` allows devices to join a network without the need for manual configuration, making it easier to manage and maintain a network. 
- When a device connects to a network, it sends a `DHCP` request to the `DHCP` server, which then assigns an available IP address and other network settings such as subnet mask, default gateway, and DNS server information. 
  - This process is known as **DHCP leasing**, and the assigned IP address is typically valid for a specific period of time, after which it may be renewed or reassigned to another device.
- If you do not set as `DHCP`, you would have to manually configure the IP address and other network settings (Subnet mask, Gateway...) for each device on the network, which can be time-consuming and prone to errors.
- `DHCP` is widely used in both home and enterprise networks to simplify network management and ensure efficient use of IP addresses.

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]