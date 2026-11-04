`timescale 1ns/1ps

module tb_register_file;
    logic clk = 0;
    logic write_enable = 0;
    logic [4:0] read_address1 = 0, read_address2 = 0, write_address = 0;
    logic [31:0] write_data = 0, read_data1, read_data2;
    integer i;

    register_file dut (.clk(clk), .write_enable(write_enable),
        .read_address1(read_address1), .read_address2(read_address2),
        .write_address(write_address), .write_data(write_data),
        .read_data1(read_data1), .read_data2(read_data2));
    always #5 clk = ~clk;

    initial begin
        $dumpfile("build/register_file.vcd");
        $dumpvars(0, tb_register_file);
        for (i = 1; i < 32; i = i + 1) begin
            @(negedge clk); write_enable = 1; write_address = i[4:0];
            write_data = 32'h12340000 + i;
            @(posedge clk); #1;
        end
        @(negedge clk); write_enable = 1; write_address = 0; write_data = 32'hFFFFFFFF;
        @(posedge clk); #1;
        read_address1 = 0; read_address2 = 31; #1;
        if (read_data1 !== 0 || read_data2 !== 32'h1234001F)
            $fatal(1, "FAIL register file: zero or second read port");
        @(negedge clk); write_enable = 0; write_address = 31; write_data = 32'hFFFFFFFF;
        @(posedge clk); #1;
        if (read_data2 !== 32'h1234001F) $fatal(1, "FAIL register file: write disable");
        for (i = 1; i < 32; i = i + 1) begin
            read_address1 = i[4:0]; read_address2 = 32 - i; #1;
            if (read_data1 !== (32'h12340000 + i) ||
                read_data2 !== (32'h12340000 + 32 - i))
                $fatal(1, "FAIL register file: two read ports, i=%d", i);
        end
        $display("PASS register file: 31 writable registers, zero, both reads and write disable.");
        $finish;
    end
endmodule
