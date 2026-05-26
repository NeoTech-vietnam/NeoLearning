/* CHALLENGE #1
- This challenge will test your understanding of signals
- Specifically, your program will:
    - Raise signals
    - Catch signals
    - Use the alarm function to raise a signal
- Write a program that will test a user's multiplication skills
    - The program will ask the user to work on an answer to a simple multiplcation program
    - Keep track of how many answers are correct
- The program will keep running forever, unless
    - The user presses Ctrl-C or
    - The user takes more than 5 seconds to answer a question
- When the program ends, it will display the final score (number of correct answers)
*/
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include <time.h>
#include <string.h>
#include <errno.h>
#include <signal.h>

/* Prototype functions */
void end_game (int sig);
void error (char* msg);
int catch_signal (int sig, void (*handler)(int));
void times_up (int sig);

int score = 0;

int main (void)
{
    catch_signal (SIGINT, end_game);
    catch_signal (SIGALRM, times_up);
    srand (time (0));
    while (1)
    {
        int a = rand () % 11;
        int b = rand () % 11;
        char txt[4];
        alarm (5);
        printf ("\nWhat is %d times %d? ", a, b);
        fgets (txt, 4, stdin);
        int answer = atoi (txt);
        if (answer == a * b)
            score++;
        else
            printf ("\nWrong score: %d\n", score);

    }
    return 0;
}

void end_game (int sig)
{
    printf ("\nGame Over! Your final score is: %d\n", score);
    exit (0);
}

void error (char* msg)
{
    fprintf (stderr, "Error: %s - %s\n", msg, strerror (errno));
    exit (1);
}

int catch_signal (int sig, void (*handler)(int))
{
    struct sigaction action;
    action.sa_handler = handler;
    sigemptyset (&action.sa_mask);
    action.sa_flags = 0;
    return sigaction (sig, &action, NULL);
}

void times_up (int sig)
{
    puts ("\nTime's up!");
    raise (SIGINT);
}