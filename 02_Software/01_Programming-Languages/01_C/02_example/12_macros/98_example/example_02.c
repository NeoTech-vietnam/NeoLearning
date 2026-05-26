#include <stdio.h>

#define Warning(format, ...) fprintf(format, stderr, __VA_ARGS__)
#define FOO BAR
#define BAR (12)

#define MISC(x) (puts("incrementing", (x)++))
#define Max(a,b) ((a) > (b) ? (a) : (b))

int main (void)
{
    Warning ("%s: this program is here\n", "Thach");
    return 0;
}