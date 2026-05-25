#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>

/* Wrapping the socket API */
short socketCreate (void)
{
    short hSocket = 0;
    printf ("Create the socket\n");
    hSocket = socket (AF_INET, SOCK_STREAM, 0);
    return hSocket;
}

int bindCreateSocket (int hSocket)
{
    int iRetval = -1;
    int clientPort = 12345;

    struct sockaddr_in remote = { 0 };
    remote.sin_family = AF_INET;
    remote.sin_addr.s_addr = htonl (INADDR_ANY);
    remote.sin_port = htons (clientPort); /* Local host */
    iRetval = bind (hSocket, (struct sockaddr*)&remote, sizeof (remote));
    return iRetval;

}

int main (int argc, char* argv[])
{
    int socket_desc = 0, sock = 0, clientLen = 0;
    struct sockaddr_in client;
    char client_message[200] = { 0 };
    char message[100] = { 0 };
    const char* pMessage = "hello";

    /* Create socket */
    socket_desc = socketCreate ();
    if (socket_desc == -1)
    {
        printf ("Could not create socket\n");
        return 1;
    }
    printf ("Socket created\n");
    /* Bind */
    if (bindCreateSocket (socket_desc) < 0)
    {
        printf ("Bind failed\n");
        return 1;
    }
    printf ("Bind done\n");
    /* Listen */
    listen (socket_desc, 3);
    while (1)
    {
        printf ("Waiting for incoming connections...\n");
        clientLen = sizeof (struct sockaddr_in);
        /* Accept and incoming connection */
        sock = accept (socket_desc, (struct sockaddr*)&client, (socklen_t*)&clientLen);
        if (sock < 0)
        {
            perror ("Accept failed");
            return 1;
        }
        printf ("Connection accepted\n");
        memset (client_message, 0, sizeof (client_message));
        memset (message, '\0', sizeof (message));
        /* Receive a message from client */
        if (recv (sock, client_message, 200, 0) < 0)
        {
            printf ("Receive failed\n");
            break;

        }
        printf ("Client reply: %s\n", client_message);
        if (strcmp (pMessage, client_message) == 0)
        {
            strcpy (message, "Hi there !");
        }
        else
        {
            strcpy (message, "Wrong message");
        }

        /* Send a message to the client */
        if (send (sock, message, strlen (message), 0) < 0)
        {
            printf ("Send failed\n");
            return 1;
        }
        close (sock);
        sleep (1);
    }
    return 0;
}