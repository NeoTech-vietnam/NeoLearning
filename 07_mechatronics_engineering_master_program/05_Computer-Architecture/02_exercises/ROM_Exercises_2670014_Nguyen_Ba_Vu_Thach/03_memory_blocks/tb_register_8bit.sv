`timescale 1ns/1ps

module tb_register_8bit;
    logic clk = 0;
    logic reset = 0;
    logic enable = 0;
    logic [7:0] d = 0;
    logic [7:0] q;

    register_8bit dut (.clk(clk), .reset(reset), .enable(enable), .d(d), .q(q));
    always #5 clk = ~clk;

    initial begin
        $dumpfile("build/register_8bit.vcd");
        $dumpvars(0, tb_register_8bit);
        @(negedge clk); reset = 1; enable = 1; d = 8'hFF;
        @(posedge clk); #1;
        if (q !== 8'h00) $fatal(1, "FAIL register reset: q=%h", q);
        @(negedge clk); reset = 0; d = 8'h5A;
        @(posedge clk); #1;
        if (q !== 8'h5A) $fatal(1, "FAIL register load: q=%h", q);
        @(negedge clk); enable = 0; d = 8'hA5;
        @(posedge clk); #1;
        if (q !== 8'h5A) $fatal(1, "FAIL register hold: q=%h", q);
        @(negedge clk); enable = 1;
        #1;
        if (q !== 8'h5A) $fatal(1, "FAIL register changed before clock: q=%h", q);
        @(posedge clk); #1;
        if (q !== 8'hA5) $fatal(1, "FAIL register reload: q=%h", q);
        $display("PASS register: reset priority, load, hold and clock edge.");
        $finish;
    end
endmodule
