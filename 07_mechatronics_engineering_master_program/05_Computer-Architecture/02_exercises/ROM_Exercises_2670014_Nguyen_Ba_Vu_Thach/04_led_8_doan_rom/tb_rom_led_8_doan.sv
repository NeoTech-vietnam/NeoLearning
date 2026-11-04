`timescale 1ns/1ps

module tb_rom_led_8_doan;
    logic [3:0] hex_digit;
    logic dp_enable;
    logic [7:0] segments;
    logic [6:0] expected [0:15];
    integer digit, point;

    rom_led_8_doan dut (
        .hex_digit(hex_digit), .dp_enable(dp_enable), .segments(segments)
    );

    initial begin
        // Moi dong la bit gfedcba theo hinh cac doan sang cua ky tu.
        expected[ 0] = 7'b0111111;
        expected[ 1] = 7'b0000110;
        expected[ 2] = 7'b1011011;
        expected[ 3] = 7'b1001111;
        expected[ 4] = 7'b1100110;
        expected[ 5] = 7'b1101101;
        expected[ 6] = 7'b1111101;
        expected[ 7] = 7'b0000111;
        expected[ 8] = 7'b1111111;
        expected[ 9] = 7'b1101111;
        expected[10] = 7'b1110111;
        expected[11] = 7'b1111100;
        expected[12] = 7'b0111001;
        expected[13] = 7'b1011110;
        expected[14] = 7'b1111001;
        expected[15] = 7'b1110001;

        $dumpfile("build/rom_led_8_doan.vcd");
        $dumpvars(0, tb_rom_led_8_doan);
        for (point = 0; point < 2; point = point + 1) begin
            for (digit = 0; digit < 16; digit = digit + 1) begin
                dp_enable = point[0];
                hex_digit = digit[3:0];
                #10;
                if (segments !== {dp_enable, expected[digit]})
                    $fatal(1, "FAIL: digit=%h dp=%b got=%h expected=%h",
                           hex_digit, dp_enable, segments, {dp_enable, expected[digit]});
                $display("digit=%h dp=%b -> segments=%08b (%02h)",
                         hex_digit, dp_enable, segments, segments);
            end
        end
        $display("PASS: tat ca 32 dia chi ROM.");
        $finish;
    end
endmodule
