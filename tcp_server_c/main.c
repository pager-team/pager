#include <stdio.h>
#include <stdlib.h>

void get_id(char id_str[80])
{
    int c;
    int i = 0;
    FILE *file;
    file = fopen("pager_id.json", "r");
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

int main(void)
{
    char buffer[80];
    get_id(buffer);
    printf("%s", buffer);
    return EXIT_SUCCESS;
}