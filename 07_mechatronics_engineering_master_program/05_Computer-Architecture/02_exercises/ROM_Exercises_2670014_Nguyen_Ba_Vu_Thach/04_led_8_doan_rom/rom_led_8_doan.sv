// ROM 32 x 8: dia chi {dp_enable, hex_digit}, du lieu {dp,g,f,e,d,c,b,a}.
// LED active-high: bit 1 bat doan tuong ung. Doc bat dong bo.
module rom_led_8_doan (
    input  logic [3:0] hex_digit,
    input  logic       dp_enable,
    output logic [7:0] segments
);
    logic [7:0] rom [0:31];
    integer i;

    initial begin
        rom[ 0] = 8'h3f; // 0: abcdef
        rom[ 1] = 8'h06; // 1: bc
        rom[ 2] = 8'h5b; // 2: abdeg
        rom[ 3] = 8'h4f; // 3: abcdg
        rom[ 4] = 8'h66; // 4: bcfg
        rom[ 5] = 8'h6d; // 5: acdfg
        rom[ 6] = 8'h7d; // 6: acdefg
        rom[ 7] = 8'h07; // 7: abc
        rom[ 8] = 8'h7f; // 8: abcdefg
        rom[ 9] = 8'h6f; // 9: abcdfg
        rom[10] = 8'h77; // A: abcefg
        rom[11] = 8'h7c; // b: cdefg
        rom[12] = 8'h39; // C: adef
        rom[13] = 8'h5e; // d: bcdeg
        rom[14] = 8'h79; // E: adefg
        rom[15] = 8'h71; // F: aefg
        // Nua sau ROM la cung cac ky tu voi diem thap phan bat.
        for (i = 0; i < 16; i = i + 1)
            rom[i + 16] = rom[i] | 8'h80;
    end

    assign segments = rom[{dp_enable, hex_digit}];
endmodule
