/* CHALLENGE 2
- This challenge will test your understanding of forking a process
- Write a program to create one parent with three children processes (four processes)
- Each process will print out its PID and PPID- Must use the fork() function
- Your program should contain output that identifies each parent and each child
    - Will need to write if statements to check process id's returned from fork() call, so that the output information is correct
    - "parent", "first child", "second child", "third child"
    - Utilize the getpid() and getppid() functions to get the process id and parent process id
- At some instance of time, it is not necessary that child process will execute first or parent process will be first allotted CPU
    - Any process may get CPU assigned, at some quantum time
    - Also, the process id may differ during different executions.
*/
#include <unistd.h> 
#include <stdio.h> 

int main (void)
{
    // Creating first child 
    int n1 = fork ();

    // Creating second child. First child also executes this line and creates grandchild. 
    int n2 = fork ();

    if (n1 > 0 && n2 > 0)
    {
        printf ("parent\n");
        printf ("%d %d \n", n1, n2);
        printf ("   my id is %d \n", getpid ());
        printf ("   my parentid is %d \n", getppid ());
    }
    else if (n1 == 0 && n2 > 0)
    {
        printf ("\nFirst child\n");
        printf ("%d %d \n", n1, n2);
        printf ("   my id is %d  \n", getpid ());
        printf ("   my parentid is %d \n", getppid ());
    }
    else if (n1 > 0 && n2 == 0)
    {
        printf ("\nsecond child\n");
        printf ("%d %d \n", n1, n2);
        printf ("   my id is %d  \n", getpid ());
        printf ("   my parentid is %d \n", getppid ());
    }
    else
    {
        printf ("\nthird child\n");
        printf ("%d %d \n", n1, n2);
        printf ("   my id is %d \n", getpid ());
        printf ("   my parentid is %d \n", getppid ());
    }

    return 0;
}




