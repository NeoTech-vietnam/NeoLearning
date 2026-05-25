#include <stdio.h>
#include <stdlib.h>

#define MAX 50

void enQueue ();
void deQueue ();
void display ();

int queue_array[MAX];
int rear = -1;
int front = -1;

int main (void)
{
    int choice;
    while (1)
    {
        printf ("1. Insert element to queue\n");
        printf ("2. Delete element from queue\n");
        printf ("3. Display all elements of queue\n");
        printf ("4. Quit\n");
        printf ("Enter your choice: ");
        scanf ("%d", &choice);

        switch (choice)
        {
            case 1:
                enQueue ();
                break;
            case 2:
                deQueue ();
                break;
            case 3:
                display ();
                break;
            case 4:
                exit (1);
            default:
                printf ("Wrong choice\n");
        } /* End of swtich */
    } /* End of while loop */

    return 0;
} /* End of main */

void enQueue ()
{
    int add_item;
    if (rear == MAX - 1)
        printf ("Queue Overflow \n");
    else
    {
        if (front == -1)
            front = 0;
        printf ("Insert the element in queue: ");
        scanf ("%d", &add_item);
        rear = rear + 1;
        queue_array[rear] = add_item;
    }
}

void deQueue ()
{
    if (front == -1 || front > rear)
    {
        printf ("Queue Underflow \n");
        return;
    }
    else
    {
        printf ("Element deleted from queue: %d\n", queue_array[front]);
        front = front + 1;
    }
}

void display ()
{
    int i;
    if (front == -1)
        printf ("Queue is empty \n");
    else
    {
        printf ("Queue elements are:\n");
        for (i = front; i <= rear; i++)
            printf ("%d ", queue_array[i]);
        printf ("\n");
    }
}