# Section 22: Networking (Sockets)

## Topic: Creating a Server Socket

## Date: 25/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Steps in using sockets to communicate**
- create a new socket for network communication
- attach a local address to a socket (bind)
- announce willingness to accept connections (listen)
- block caller until a connection request arrives (accept)
- actively attempt to establish a connection (connect)
- send some data over connection (send)
- receive some data over connection (receive)
- release the connection (close)

**2. Steps specifically for a server socket**
- the steps involved in establishing a socket on the server side are as follows
- create a socket with the socket() system call
- bind the socket to an address using the bind() system call
  - for a server socket on the Internet, an address consists of a port number on the host machine
- listen for connections with the listen() system call
- accept a connection with the accept() system call
  - typically blocks the connection until a client connects with the server
- send and receive data using the read()/recv and write()/send system calls

**3. Illustration**

![alt text](image-1.png)

![alt text](image-2.png)

**4. simple server steps (pseudocode)**
```
my_sd = socket( )
bind( my_sd, <local address, mainly a port number> )
listen( my_sd )
start loop
his_sd = accept( my_sd, <empty adlearning/section-22_networking_sockets/168_creating_a_server_socket.mdress to be filled in with his incoming info> )
recv( his_sd, <where to put what you receive> )
send( his_sd, <the stuff you want sent> )
close( my_sd )
end loop
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]