#include <stdio.h>
#include <stdlib.h>
#include <time.h>


/* Self-referential structure */
struct treeNode
{
    int data;
    struct treeNode* leftPtr; /* Pointer to left subtree */
    struct treeNode* rightPtr; /* Pointer to right subtree */
};

typedef struct treeNode TreeNode;
typedef TreeNode* TreeNodePtr;

/* Prototypes */
void insertNode (TreeNodePtr* treePtr, int value);
void inOrder (TreeNodePtr treePtr);
void preOrder (TreeNodePtr treePtr);
void postOrder (TreeNodePtr treePtr);

int main (void)
{
    int i = 0; /* Counter to loop from 1-10 */
    int item = 0; /* Variable to hold random values */
    TreeNodePtr rootPtr = NULL; /* tree initially empty */

    srand (time (NULL));
    printf ("The numbers being placed in the tree are:\n");
    /* Insert random values between 0 and 14 in the tree */
    for (i = 1; i <= 10; i++)
    {
        item = rand () % 15;
        printf ("%3d", item);
        insertNode (&rootPtr, item);
    }

    /* Tranverse the tree preOrder */
    printf ("\n\nThe preOrder traversal is:\n");
    preOrder (rootPtr);

    /* Tranverse the tree inOrder */
    printf ("\n\nThe inOrder traversal is:\n");
    inOrder (rootPtr);

    /* Tranverse the tree postOrder */
    printf ("\n\nThe postOrder traversal is:\n");
    postOrder (rootPtr);

    return 0;
}

void insertNode (TreeNodePtr* treePtr, int value)
{
    if (*treePtr == NULL)
    {
        *treePtr = malloc (sizeof (TreeNode));
        /* If memory was allocated the assign data */
        if (*treePtr != NULL)
        {
            (*treePtr)->data = value;
            (*treePtr)->leftPtr = NULL;
            (*treePtr)->rightPtr = NULL;
        } /* End if */
        else
        {
            printf ("%d not inserted. No memory available.\n", value);
        } /* End else */
    } /* End if */
    else /* Tree is not empty */
    {
        /* Data to insert is less than data in current node */
        if (value < (*treePtr)->data)
        {
            insertNode (&((*treePtr)->leftPtr), value);
        }
        /* Data to insert is greater than data in current node */
        else if (value > (*treePtr)->data)
        {
            insertNode (&((*treePtr)->rightPtr), value);
        }
        else /* Duplicate data value ignored */
        {
            printf ("%d dup\n", value);
        } /* End else */
    } /* End if else */
} /* End function insertNode */

void inOrder (TreeNodePtr treePtr)
{
    if (treePtr != NULL)
    {
        inOrder (treePtr->leftPtr);
        printf ("%3d ", treePtr->data);
        inOrder (treePtr->rightPtr);
    }
}

void preOrder (TreeNodePtr treePtr)
{
    if (treePtr != NULL)
    {
        printf ("%3d ", treePtr->data);
        preOrder (treePtr->leftPtr);
        preOrder (treePtr->rightPtr);
    }
}


void postOrder (TreeNodePtr treePtr)
{
    if (treePtr != NULL)
    {
        postOrder (treePtr->leftPtr);
        postOrder (treePtr->rightPtr);
        printf ("%3d ", treePtr->data);
    }
}