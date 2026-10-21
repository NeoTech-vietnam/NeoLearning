`timescale 1ns/1ps

module tb_ripple_carry_adder_8bits;
    logic [7:0] a, b, sum;
    logic cin, cout;
    logic [8:0] expected;
    integer vector;

    ripple_carry_adder_8bits dut (
        .a(a), .b(b), .cin(cin), .sum(sum), .cout(cout)
    );

    initial begin
        $dumpfile("build/ripple_carry_adder_8bits.vcd");
        $dumpvars(0, tb_ripple_carry_adder_8bits);

        // Hold each demonstration for 10 ns before exhaustive testing.
        a = 8'd15; b = 8'd1; cin = 1'b0;
        #10;
        if ({cout, sum} !== 9'd16) $fatal(1, "FAIL: RCA example 1");
        $display("EXAMPLE 1: %0d (%b) + %0d (%b) + cin=%b -> sum=%0d (%b), cout=%b, total=%0d",
                 a, a, b, b, cin, sum, sum, cout, {cout, sum});

        a = 8'd255; b = 8'd1; cin = 1'b0;
        #10;
        if ({cout, sum} !== 9'd256) $fatal(1, "FAIL: RCA example 2");
        $display("EXAMPLE 2: %0d (%b) + %0d (%b) + cin=%b -> sum=%0d (%b), cout=%b, total=%0d",
                 a, a, b, b, cin, sum, sum, cout, {cout, sum});

        for (vector = 0; vector < 131072; vector = vector + 1) begin
            {a, b, cin} = vector[16:0];
            expected = {1'b0, a} + {1'b0, b} + {8'b0, cin};
            #1;
            if ({cout, sum} !== expected)
                $fatal(1, "FAIL: a=%0d b=%0d cin=%b result=%0d expected=%0d",
                       a, b, cin, {cout, sum}, expected);
        end

        $display("PASS: all 131072 input combinations produced the expected output.");
        $finish;
    end
endmodule
