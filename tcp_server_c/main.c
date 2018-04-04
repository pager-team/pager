#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h> //socket
#include <arpa/inet.h>  //inet_addr
#include <fcntl.h>      // for open
#include <unistd.h>     // for closed

#define PORT_TIME 13            /* "time" (not available on RedHat) */
#define PORT_FTP 8005           /* FTP connection port */
#define SERVER_ADDR "127.0.0.1" /* localhost */
#define MAXBUF 1024

void get_id(char id_str[80])
{
    int c;
    int i = 0;
    FILE *file;
    file = fopen("pager_id.txt", "r");
    if (file)
    {
        while ((c = getc(file)) != EOF)
        {
            id_str[i] = c;
            i += 1;
        }

        id_str[i] = 0;

        fclose(file);
    }
}

int startTcpServer(int id)
{
    /*
    C ECHO client example using sockets
*/

    int sock;
    struct sockaddr_in server;
    char message[1000], server_reply[2000];

    //Create socket
    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == -1)
    {
        printf("Could not create socket");
    }
    puts("Socket created");

    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_family = AF_INET;
    server.sin_port = htons(8005);

    //Connect to remote server
    if (connect(sock, (struct sockaddr *)&server, sizeof(server)) < 0)
    {
        perror("connect failed. Error");
        return 1;
    }

    puts("Connected\n");

    //keep communicating with server

    snprintf(buf, sizeof buf, stringToSend, id);

    puts("sdfsd\n");
    //Send some data
    if (send(sock, buf, strlen(buf), 0) < 0)
    {
        puts("Send failed");
        return 1;
    }

    printf("Did I make it past here?");

    while (1)
    {
        printf("I am waiting for a message");
        //Receive a reply from the server
        if (recv(sock, server_reply, 2000, 0) < 0)
        {
            puts("recv failed");
            break;
        }
        printf("I just got a message");
        printf("%s", server_reply);

        if (strcmp(server_reply, "ring") == 0)
        {
            printf("I am ringing!");
        }
        else if (strcmp(server_reply, "deactivate") == 0)
        {
            printf("I have deactivated");
        }
    }

    close(sock);
    return 0;
}

int main(void)
{
    char buffer[80];
    get_id(buffer);
    int id = atoi(buffer);

    // Wait for input
    scanf("\n");

    startTcpServer(id);

    return EXIT_SUCCESS;
}