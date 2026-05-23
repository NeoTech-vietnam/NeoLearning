#include <stdio.h>
#include <stdlib.h>


typedef struct Node
{
    char data;
    struct Node* nextPtr;
} Node_t;

typedef Node_t* ListNodePtr;

/* Function prototypes */
void insertAtBegining (ListNodePtr* head, char value);
void insertAtEnd (ListNodePtr* head, char value);
void insert (ListNodePtr* head, char value);
char delete(ListNodePtr* head, char value);
void deleteAtBegining (ListNodePtr* head);
int isEmpty (ListNodePtr head);
void printList (ListNodePtr head);



int main (void)
{

    ListNodePtr head = NULL; /*Initially there are no node*/
    int choice = 0; /* User's choice */
    char item = '\0'; /* Char entered by user */

    /* Display the menu */
    printf ("\n1. Insert an element into the list in alphabetical order\n");
    printf ("2. Insert an element at end of the list.\n");
    printf ("3. Insert an element at the beginning of the list.\n");
    printf ("4. Delete an element from the list.\n");
    printf ("5. Delete an element at the beginning of the list.\n");
    printf ("6. End.\n");

    printf (":: ");

    scanf ("%d", &choice);

    /* Loop while user does not choose 3 */
    while (choice != 6)
    {
        switch (choice)
        {
            case 1:
                printf ("Enter a character: ");
                scanf ("\n%c", &item);
                insert (&head, item); /* Insert item in list */
                printList (head); /* Print the list */
                break;
            case 2:
                printf ("Enter a character: ");
                scanf ("\n%c", &item);
                insertAtEnd (&head, item); /* Insert item at end of list */
                printList (head); /* Print the list */
                break;
            case 3:
                printf ("Enter a character: ");
                scanf ("\n%c", &item);
                insertAtBegining (&head, item); /* Insert item at beginning of list */
                printList (head); /* Print the list */
                break;
            case 4: /* Delete an element from the list */
                if (!isEmpty (head))
                {
                    printf ("Enter a character to be deleted: ");
                    scanf ("\n%c", &item);
                    /* If character is found, remove it */
                    if (delete(&head, item))
                    {
                        printf ("Character deleted successfully.\n");
                        printList (head); /* Print the list */
                    }
                    else
                    {
                        printf ("Character %c not found in the list.\n", item);
                    }
                }
                else
                {
                    printf ("List is empty.\n");
                }
                break;
            case 5: /* Delete an element at the beginning of the list */
                if (!isEmpty (head))
                {
                    deleteAtBegining (&head); /* Delete item at beginning of list */
                    printf ("Character %c deleted.\n", item);
                    printList (head); /* Print the list */
                }
                else
                {
                    printf ("List is empty.\n");
                }
                break;
            default:
                printf ("Invalid choice.\n");
                /* Display the menu */
                printf ("Enter your choice:\n");
                printf ("1. Insert an element from the list.\n");
                printf ("2. Delete an element from the list.\n");
                printf ("3. End.\n");
                break;
        }
        printf ("? ");
        scanf ("%d", &choice);
    }
    printf ("End of run.\n");

    return 0;
}

void insertAtBegining (ListNodePtr* head, char value)
{
    ListNodePtr new_node = malloc (sizeof (Node_t));
    new_node->data = value;
    new_node->nextPtr = *head;
    *head = new_node;
}

void insertAtEnd (ListNodePtr* head, char value)
{
    ListNodePtr current = malloc (sizeof (Node_t));
    if (current != NULL)
    {
        while (current->nextPtr != NULL)
        {
            current = current->nextPtr;
        }
        /* Now add a new variable */
        current->nextPtr = malloc (sizeof (Node_t));
        current->nextPtr->data = value;
        current->nextPtr->nextPtr = NULL;
    }
    else
    {
        current = malloc (sizeof (Node_t));
        current->data = value;
        current->nextPtr = NULL;
        *head = current;
    }
}

void insert (ListNodePtr* head, char value)
{
    ListNodePtr newPtr;
    ListNodePtr previousPtr;
    ListNodePtr currentPtr;
    newPtr = malloc (sizeof (Node_t));
    if (newPtr != NULL) /* Check if space is available*/
    {
        newPtr->data = value; /* Place value in node */
        newPtr->nextPtr = NULL; /* Node does not link to another node*/
        previousPtr = NULL;
        currentPtr = *head;

        /* Loop to find the correct location in the list */
        while (currentPtr != NULL && value > currentPtr->data)
        {
            previousPtr = currentPtr;
            currentPtr = currentPtr->nextPtr;
        }
        /* Insert new node at beginning of list */
        if (previousPtr == NULL)
        {
            newPtr->nextPtr = *head;
            *head = newPtr;
        }
        else /* Insert new node between previousPtr and currentPtr*/
        {
            previousPtr->nextPtr = newPtr;
            newPtr->nextPtr = currentPtr;
        }
    }
    else
    {
        printf ("%c not inserted. No memory available.\n", value);
    }
}

void deleteAtBegining (ListNodePtr* head)
{
    ListNodePtr tempPtr = NULL;
    if (head == NULL)
    {
        return;
    }
    else
    {
        tempPtr = *head; /* Hold onto node being removed */
        *head = (*head)->nextPtr; /* Update head to next node */
        free (tempPtr); /* Free memory of removed node */
    }
}

char delete(ListNodePtr* head, char value)
{
    ListNodePtr previousPtr = NULL;
    ListNodePtr currentPtr = NULL;
    ListNodePtr tempPtr = NULL;
    /* Delete first node */
    if (value == (*head)->data)
    {
        tempPtr = *head; /* Hold onto node being removed */
        *head = (*head)->nextPtr; /* Update head to next node */
        free (tempPtr); /* Free memory of removed node */
        return value;
    }
    else
    {
        previousPtr = *head;
        currentPtr = (*head)->nextPtr;
        /* Loop to find the correct location in the list */
        while (currentPtr != NULL && currentPtr->data != value)
        {
            previousPtr = currentPtr;
            currentPtr = currentPtr->nextPtr;
        }

        /* Delete node at currentPtr */
        if (currentPtr != NULL)
        {
            tempPtr = currentPtr;
            previousPtr->nextPtr = currentPtr->nextPtr;
            free (tempPtr);
            return value;
        }
        return '\0';
    }
}

void printList (ListNodePtr currentPtr)
{
    /* If list is empty */
    if (currentPtr == NULL)
    {
        printf ("List is empty.\n");
    }
    else
    {
        printf ("The list is: \n");
        while (currentPtr != NULL)
        {
            printf ("%c -> ", currentPtr->data);
            currentPtr = currentPtr->nextPtr;
        }
        printf ("NULL\n");
    }
}

int isEmpty (ListNodePtr head)
{
    return head == NULL;
}