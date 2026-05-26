# Section 22: Networking (Sockets)

## Topic: The Socket APT

## Date: 24/02/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Include files**

- the following header files need to be included to work with sockets for network communication
  - include system calls for sockets and socket data

`<sys/types.h>`

- contains definitions of a number of data types used in socket calls

`<sys/socket.h>`

- the main socket header file
- includes a number of definitions of structures needed for sockets (socket creation, accept, listen, bin, send, recv, etc)

`<netinet/in.h>`

- contains constants and structures needed for internet domain addresses

`<netdb.h>`

- defines the structure hostent

`<arpa/inet.h>`

- defines in_addr structure

**2. ports**
- a computer might need to run several server programs at once
  - might be sending out web pages, posting email, and running a chat server all at the same time
- to prevent the different conversations from getting confused, each server uses a different port
- a port is just like a channel on a TV
  - different ports are used for different network services, just like different channels are used for different content
- a port will be defined as an integer number between 1024 and 65535
  - port numbers smaller than 1024 are considered well-known system ports (telnet uses port 23, http uses 80, ftp uses 21) (do not use these)
- the port assignments to network services can be found in the file /etc/services
- if you are writing your own server then care must be taken to assign a port to your server
  - you should make sure that this port should not be assigned to any other server

**3. Port and Service Functions**
- the following functions are provided to fetch service name from the /etc/services file
  - `struct servent *getservbyname(char *name, char *proto)`
    - takes a service name and a protocol name and returns the corresponding port number for that service
  - `struct servent *getservbyport(int port, char *proto)`
    - takes a port number and a protocol name and returns the corresponding service name
- the return value for each function is a pointer to a structure
```c
struct servent {
  char *s_name;
  char **s_aliases;
  int s_port;
  char *s_proto;
};
```

**4. IP Address Functions**
- the below functions are for IP Address functionality
  - `int inet_aton (const char *strptr, struct in_addr *addrptr)`
    - converts the specified string, in the Internet standard dot notation, to a network address, and stores the address in the structure provided
  - `in_addr_t inet_addr (const char *strptr)`
    - converts the specified string, in the Internet standard dot notation, to an integer value suitable for use as an Internet address
  - `char *inet_ntoa (struct in_addr inaddr)`
    - converts the specified Internet host address to a string in the Internet standard dot notation

**5. Structures used for support of the main functions**
- various structures are used in socket programming to hold information about the address and port, and other information
- socket address structures are an integral part of every network program, most socket functions require a pointer to a socket address structure as an argument
  - we allocate them, fill them in, and pass pointers to them to various socket functions
- sometimes we pass a pointer to one of these structures to a socket function and it fills in the contents
- we always pass these structures by reference (i.e., we pass a pointer to the structure, not the structure itself), and we always pass the size of the structure as another argument
- when a socket function fills in a structure, the length is also passed by reference, so that its value can be updated by the function
- always set the structure variables to NULL, otherwise it may get unexpected junk values in your structure
- sockaddr is a structure that holds the socket information
- this is a generic socket address structure, which will be passed in most of the socket function calls
```c
struct sockaddr {
  unsigned short sa_family;
  char
  sa_data[14];
};
```
- sa_family can be the following, `AF_INET`, `AF_UNIX`, `AF_NS`, `AF_IMPLINK`
  - represents an address family
  - in most of the Internet-based applications, we use `AF_INET`.
- sa_data is a protocol-specific address
  - we will use port number IP address, which is represented by `sockaddr_in` structure
- `sockaddr_in` is a structure that helps you to reference to the socket's elements
```c
struct sockaddr_in {
  short int
  sin_family;
  unsigned short int sin_port;
  struct in_addr
  sin_addr;
  unsigned char
  sin_zero[8];
};
```
- in addr is used only in the above structure as a structure field and holds the 32 bit netid/hostid
```c
struct in_addr {
  unsigned long s_addr;
};
```
- hostent is a structure is used to keep information related to host
```c
struct hostent {
  char *h_name;
  char **h_aliases;
  int h_addrtype;
  int h_length;
  char **h_addr_list
#define h_addr h_addr_list[0]
};
```

**6. Steps in using sockets to communicate**
- create a new socket for network communication (socket)
- attach a local address to a socket (bind)
- announce willingness to accept connections (listen)
- block caller until a connection request arrives (accept)
- actively attempt to establish a connection (connect)
- send some data over connection (send)
- receive some data over connection (receive)
- release the connection (close)

**7. Sockets versus File I/O**
- working with sockets is very similar to working with files
- the `socket()` and `accept()` functions both return handles (file descriptor)
  - reads and writes to the sockets requires the use of these handles (file descriptors)
- in Linux, sockets and file descriptors also share the same file descriptor table
- sockets have addresses associated with them whereas files do not
- you cannot randomly access a socket like you can a file with `lseek()`
- sockets must be in the correct state to perform input or output

**8. Socket Functions**
- the most common/important functions are the following:
  - socket()
  - connect()
  - bind()
  - listen() and accept()
  - read(), recv(), recvfrom(), or recvmsg()
  - write(), send(), sendto(), or sendmsg()
  - close()
- most of the functions are used by both the client and the server with the exception of
  - bind() is used particularly by server programs
  - connect() by client programs
- all of the above functions need to include `<sys/types.h>` and `<sys/socket.h>` except for read/write/close which are defined in `<unistd.h>`
- to perform network I/O, the first thing a process must do is call the socket function
  - specifying the type of communication protocol desired and protocol family
```c
int socket (int family, int type, int protocol);
```
- family specifies the protocol family and is usually the constant AF_INET for IPv4 protocols and `AF_INET6` for `IPv6` protocols
- type specifies the kind of socket you want, and this is usually set to `SOCK_STREAM` for a stream socket or `SOCK_DGRAM` for a datagram socket
- protocol is the third and should be set to the specific protocol type you are using
  - IPPROTO_TCP - TCP transport protocol
  - IPPROTO_UDP - UDP transport protocol
  - IPPROTO_SCTP- SCTP transport protocol
- returns a socket descriptor that you can use in later system calls or -1 on error
- the setsockopt function helps in manipulating options for the socket referred to by the file descriptor sockfd
  - completely optional, but it helps in reuse of address and port
  - prevents error such as: “address already in use”
```c
int setsockopt(int sockfd, int level, int optname, const void *optval, socklen_t optlen);
```

**9. connect function**
- the connect function is used by a TCP client to establish a connection with a TCP server
```c
int connect(int sockfd, struct sockaddr *serv_addr, int addrlen);
```
- sockfd is a socket descriptor returned by the socket function
- `serv_addr` is a pointer to struct sockaddr that contains destination IP address and port
- addrlen is set to sizeof(struct sockaddr)
- returns `0` if it successfully connects to the server, otherwise it returns `-1` on error

**10. bind function**
- when a server starts up, it needs to tell the operating system which port it is going to use
  - called binding the port
- once a server program has created a socket and named it with `bind()` giving it an IP address and port number, should any program anywhere on the network give that same name to the `connect()` function, that program will find the server program and they will link up
```c
int bind(int sockfd, struct sockaddr *my_addr,int addrlen);
```
- sockfd is a socket descriptor returned by the socket function
- `my_addr` is a pointer to struct sockaddr that contains the local IP address and port
  - a 0 value for port number means that the system will choose a random port, and INADDR_ANY value for IP address means the server's IP address will be assigned automatically
```c
server.sin_port = 0;
server.sin_addr.s_addr = INADDR_ANY;
```
- addrlen is set to sizeof(struct sockaddr)
- returns `0` if it successfully binds to the address, otherwise it returns `-1` on error

**11. listen function**
- if your server becomes popular, you will probably get lots of clients connecting to it at once
  - would you like the clients to wait in a queue for a connection?
- the `listen()` system call tells the operating system how long you want the queue to be
- calling `listen()` with a queue length of 10 means that up to 10 clients can try to connect to the server at once
  - they will not all be immediately answered, but they will be able to wait
  - the 11th client will be told the server is too busy
- the `listen()` function is called only by a server
```c
int listen(int sockfd,int backlog);
```
- sockfd is a socket descriptor returned by the socket function
- backlog is the max number of allowed connections
- returns `0` on success, otherwise it returns `-1` on error

**12. accept function**
- once you have bound a port and set up a listen queue, you then just have to...wait
- servers spend most of their lives waiting for clients to contact them
- the `accept()` system call waits until a client contacts the server, and then it returns a second socket descriptor that you can use to hold a conversation on
```c
int accept (int sockfd, struct sockaddr *cliaddr, socklen_t *addrlen);
```
- sockfd is a socket descriptor returned by the socket function
- cliaddr is a pointer to struct sockaddr that contains client IP address and port
- addrlen should be set to sizeof(struct sockaddr)
- returns a non-negative descriptor on success, otherwise it returns `-1` on error
  - all read-write operations will be done on this descriptor to communicate with the client

**13. recv function**
- the `recv()` function is used to receive data over stream sockets or connected datagram socketsto sizeof(struct sockaddr)
- returns the number of bytes sent, otherwise it returns `-1` on error
- if you want to receive data over unconnected datagram sockets you must use `recvfrom()`
```c
int recv(int sockfd, void *buf, int len, unsigned int flags);
```
- sockfd is a socket descriptor returned by the socket function
- buf is the buffer to read the information into
- len is the maximum length of the buffer
- flags is set to 0
- returns the number of bytes read into the buffer, otherwise it will return `-1` on error

**14. recvfrom function**
- the `recvfrom()` function is used to receive data from unconnected datagram sockets
```c
int recvfrom(int sockfd, void *buf, int len, unsigned int flags, struct sockaddr *from, int *fromlen);
```
- sockfd is a socket descriptor returned by the socket function
- buf is the buffer to read the information into
- len is the maximum length of the buffer
- flags is set to 0
- from is a pointer to struct sockaddr for the host where data has to be read
- fromlen should be set it to sizeof(struct sockaddr)
- returns the number of bytes read into the buffer, otherwise it returns `-1` on error

**15. write function**
- the `write()` function attempts to write nbyte bytes from the buffer pointed by buf to the file associated with the open file descriptor, fildes
```c
int write(int fildes, const void *buf, int nbyte);
```
- fildes is a socket descriptor returned by the socket function
- buf is a pointer to the data you want to send
- nbyte is the number of bytes to be written
  - If nbyte is 0, `write()` will return 0 and have no other results
  - otherwise, the results are unspecified
- returns the number of bytes actually written to the file associated with fildes if successful otherwise, `-1` is returned

**16. Send function**
- the `send()` function is used to send data over stream sockets or connected datagram sockets
  - if you want to send data over unconnected datagram sockets, you must use `sendto()` function
```c
int send(int sockfd, const void *msg, int len, int flags);
```
- sockfd is a socket descriptor returned by the socket function
- msg is a pointer to the data you want to send
- len is the length of the data you want to send (in bytes)
- flags should be set to 0
- returns the number of bytes sent out, otherwise it will return `-1` on error

**17. sendto function**
- the `sendto()` function is used to send data over unconnected datagram sockets
```c
int sendto(int sockfd, const void *msg, int len, unsigned int flags, const struct sockaddr *to, int tolen);
```
- sockfd is a socket descriptor returned by the socket function
- msg is a pointer to the data you want to send
- len is the length of the data you want to send (in bytes)
- flags should be set to 0
- to is a pointer to struct sockaddr for the host where data has to be sent
- tolen should be set it to sizeof(struct sockaddr)
- returns the number of bytes sent, otherwise it returns `-1` on error

**18. read function**
- the `read()` function attempts to read nbyte bytes from the file associated with the buffer, fildes, into the buffer pointed to by buf
```c
int read(int fildes, const void *buf, int nbyte);
```
- fildes is a socket descriptor returned by the socket function
- buf is the buffer to read the information into
- nbyte is the number of bytes to read
- returns the number of bytes actually written to the file associated with fildes, if successful
  - otherwise, `-1` is returned

**19. close function**
- the `close()` function is used to close the communication between the client and the server
```c
int close( int sockfd );
```
- they will not all be immediately answered, but they will be able to wait
- the 11th client will be told the server is too busy
- sockfd is a socket descriptor returned by the socket function
- returns 0 on success, otherwise it returns `-1` on error

**20. shutdown function**
- the `shutdown()` function is used to gracefully close the communication between the client and the server
  - gives more control in comparison to the `close()` function
```c
int shutdown(int sockfd, int how);
```
- sockfd is a socket descriptor returned by the socket function
- how
  - 0 − indicates that receiving is not allowed
  - 1 − indicates that sending is not allowed
  - 2 − indicates that both sending and receiving are not allowed
    - when how is set to 2, it's the same thing as close()
- returns 0 on success, otherwise it returns -1 on error


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]