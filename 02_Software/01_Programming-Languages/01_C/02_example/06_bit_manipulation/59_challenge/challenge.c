/*
CHALLENGE - BIT FIELDS
- This challenge will test your understanding of bitfields

- Write a program that contains the following bit fields in a structure (onscreen box)
    - The box can opaque or transparent
    - A fill color is selected from the following palette of colors: black, red, green
    yellow, blue, magenta, cyan, or white
    - A border can be shown or hidden
    - A border color is selected from the same palette used for the fill color
    - A border can use one of three line styles - solid, dotted, or dashed
- You need only a single bit to indicate whether the box is opaque or transparent
- Use padding to place the fill-related information in one byte
- The border-related information in a second byte
- The padding brings the structure up to 16 bits
    - Without padding, the structure would be 10 bits
- You can use a value of 1 for the opaque to indicate that the box is opaque and a 0 value
to indicate transparency
- You can do the same for a "show_border" member
- For colors, you can use a simple RGB representation
    - These are the primary colors for mixing light
    - The usual order is for the left bit to represent blue intensity
    - The middle bit green intensity
    - The right bit red intensity
- Can be used as values for a "fill_color" and "border_color" struct members
- Lastly, you can choose to let 0, 1, and 2 represent the solid, dotted, and dashed styles
    - Can be used as values for a "border_style" member
- Your program should utilize the structure that contains the bitfields as described in above
- First, create a variable of the structure type and initialize the bitfields with some default values
    - Display these default values
- Second, modify the structures contents by accessing each bitfields and changing the default value to another value
    - Display these modified values
*/

#include <stdio.h>
#include <stdbool.h>

/* Line styles */
#define SOLID    0
#define DOTTED   1
#define DASHED   2

/* Primary colors */
#define BLUE     4
#define GREEN    2
#define RED      1

#define BLACK    0
#define YELLOW   (RED | GREEN)
#define MAGENTA  (RED | BLUE)
#define CYAN     (GREEN | BLUE)
#define WHITE    (RED | GREEN | BLUE)

const char* colors[8] = { "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white" };

struct box_props
{
    bool opaque : 1;
    unsigned int fill_color : 3;
    unsigned int : 4;
    bool show_border : 1;
    unsigned int border_color : 3;
    unsigned int border_style : 2;
    unsigned int : 2;
};

void show_settings (const struct box_props* pb);

int main (void)
{
    /* Create and initialize box_props structure */
    struct box_props box = { true, YELLOW, true, GREEN, DASHED };
    printf ("Original box settings:\n");
    show_settings (&box);

    box.opaque = false;
    box.fill_color = WHITE;
    box.border_color = MAGENTA;
    box.border_style = SOLID;

    printf ("\nModified box settings:\n");
    show_settings (&box);

    return 0;
}

void show_settings (const struct box_props* pb)
{
    printf ("Box is %s.\n", pb->opaque == true ? "opaque" : "transparent");
    printf ("The fill color is %s.\n", colors[pb->fill_color]);
    printf ("Border %s.\n", pb->show_border == true ? "shown" : "not shown");
    printf ("The border color is %s.\n", colors[pb->border_color]);
    printf ("The border style is ");

    switch (pb->border_style)
    {
        case SOLID:
            /* code */
            printf ("solid.\n");
            break;
        case DOTTED:
            /* code */
            printf ("dotted.\n");
            break;
        case DASHED:
            /* code */
            printf ("dashed.\n");
            break;

        default:
            printf ("unknown type.\n");
            break;
    }

}