/* CHALLENGE
- This challenge will test your understanding of sockets and the client/server model
- You are going to write three programs for this challenge
- Two of the programs will be client programs
- One of the programs will be a server program

- the functionality of the programs should be as follows
    - Client1 will send an integer to the server process
    - the server will decrement the number and send the result to client2
    - the server should print both the value it receives and the value that it sends
    - Client2 prints the number it receives and then all the processes should terminate
- the server should be listening for numbers on a port known to the clients
    - should handle the client connections sequentially and accept connections from multiple clients
- after servicing one client to completion (Client 1), it should proceed to the next
*/

// Client 2
#define _GNU_SOURCE
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<sys/socket.h>
#include<arpa/inet.h>
#include<unistd.h>

//Create a Socket for server communication
short socketCreate (void)
{
    short hSocket;
    printf ("Create the socket\n");
    hSocket = socket (AF_INET, SOCK_STREAM, 0);
    return hSocket;
}

//try to connect with server
int socketConnect (int hSocket)
{
    int iRetval = -1;
    int ServerPort = 12345;
    struct sockaddr_in remote = { 0 };
    remote.sin_addr.s_addr = inet_addr ("127.0.0.1"); //Local Host
    remote.sin_family = AF_INET;
    remote.sin_port = htons (ServerPort);
    iRetval = connect (hSocket, (struct sockaddr*)&remote, sizeof (struct sockaddr_in));
    return iRetval;
}

//receive the data from the server
int socketReceive (int hSocket, char* Rsp, short RvcSize)
{
    int shortRetval = -1;
    struct timeval tv;
    tv.tv_sec = 20;  /* 20 Secs Timeout */
    tv.tv_usec = 0;

    if (setsockopt (hSocket, SOL_SOCKET, SO_RCVTIMEO, (char*)&tv, sizeof (tv)) < 0)
    {
        printf ("Time Out\n");
        return -1;
    }
    shortRetval = recv (hSocket, Rsp, RvcSize, 0);
    printf ("Response %s\n", Rsp);
    return shortRetval;
}

//main driver program
int main (int argc, char* argv[])
{
    int hSocket = 0, read_size = 0;

    char server_reply[200] = { 0 };

    //Create socket
    hSocket = socketCreate ();

    if (hSocket == -1)
    {
        printf ("Could not create socket\n");
        return 1;
    }

    printf ("Socket is created\n");

    //Connect to remote server
    if (socketConnect (hSocket) < 0)
    {
        perror ("connect failed.\n");
        return 1;
    }

    printf ("Sucessfully conected with server\n");
    //Received the data from the server
    read_size = socketReceive (hSocket, server_reply, 200);
    printf ("Server Response : %s: read_size %d\n\n", server_reply, read_size);
    close (hSocket);
    return 0;
}


