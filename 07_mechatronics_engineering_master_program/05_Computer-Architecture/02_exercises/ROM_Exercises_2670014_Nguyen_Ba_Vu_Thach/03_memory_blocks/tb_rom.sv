`timescale 1ns/1ps

module tb_rom;
    logic [1:0] address;
    logic [2:0] data;
    logic [2:0] expected [0:3];
    integer i;

    rom dut (.address(address), .data(data));

    initial begin
        $dumpfile("build/rom.vcd");
        $dumpvars(0, tb_rom);
        expected[0] = 3'b011; expected[1] = 3'b110;
        expected[2] = 3'b100; expected[3] = 3'b010;
        for (i = 0; i < 4; i = i + 1) begin
            address = i[1:0];
            #1;
            if (data !== expected[i])
                $fatal(1, "FAIL ROM: address=%b data=%b expected=%b", address, data, expected[i]);
            $display("ROM: address=%b data=%b", address, data);
            #4;
        end
        $display("PASS ROM: all 4 addresses.");
        $finish;
    end
endmodule
