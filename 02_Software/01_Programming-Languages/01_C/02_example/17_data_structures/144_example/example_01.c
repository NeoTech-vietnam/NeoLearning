#include <stdio.h>
#define MAXSIZE 5

struct stack
{
    int stk[MAXSIZE];
    int top;
};

typedef struct stack STACK;

STACK s;

void push (void);
int pop (void);
void display (void);


int main (void)
{
    int choice;
    int option = 1;
    s.top = -1;
    while (option)
    {
        printf ("1. Push\n");
        printf ("2. Pop\n");
        printf ("3. Display\n");
        printf ("4. Exit\n");
        printf ("Enter your choice: ");
        scanf ("%d", &choice);
        switch (choice)
        {
            case 1:
                push ();
                break;
            case 2:
                pop ();
                break;
            case 3:
                display ();
                break;
            case 4:
                return 0;
            default:
                break;
        }
        fflush (stdin);
        printf ("Do you want to continue (Type 0 or 1)?\n");
        scanf ("%d", &option);
    }
    return 0;
}

void push (void)
{
    int num = 0;
    if (s.top == (MAXSIZE - 1))
    {
        printf ("Stack is full\n");
        return;
    }
    else
    {
        printf ("Enter the element to be pushed\n");
        scanf ("%d", &num);
        s.top = s.top + 1;
        s.stk[s.top] = num;
    }
    return;
}

int pop ()
{
    int num = 0;
    if (s.top == -1)
    {
        printf ("Stack is empty\n");
        return (s.top);
    }
    else
    {
        num = s.stk[s.top];
        printf ("Popped element is %d\n", s.stk[s.top]);
        s.top = s.top - 1;
    }
    return (num);
}

void display (void)
{
    int i = 0;
    if (s.top == -1)
    {
        printf ("Stack is empty\n");
        return;
    }
    else
    {
        printf ("\nStack elements are:\n");
        for (i = s.top; i >= 0; i--)
        {
            printf ("%d\n", s.stk[i]);
        }
    }
    printf ("\n");
}
