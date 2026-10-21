`timescale 1ns/1ps

module tb_full_adder;
    logic a;
    logic b;
    logic cin;
    logic sum;
    logic cout;
    logic [1:0] expected;
    integer vector;

    full_adder dut (
        .a(a),
        .b(b),
        .cin(cin),
        .sum(sum),
        .cout(cout)
    );

    initial begin
        $dumpfile("build/full_adder.vcd");
        $dumpvars(0, tb_full_adder);

        for (vector = 0; vector < 8; vector = vector + 1) begin
            {a, b, cin} = vector[2:0];
            expected = {1'b0, a} + {1'b0, b} + {1'b0, cin};
            #1;

            if ({cout, sum} !== expected) begin
                $fatal(1, "FAIL: a=%b b=%b cin=%b cout=%b sum=%b expected=%b",
                       a, b, cin, cout, sum, expected);
            end

            $display("a=%b b=%b cin=%b -> cout=%b sum=%b", a, b, cin, cout, sum);
            #4;
        end

        $display("PASS: all 8 input combinations produced the expected output.");
        $finish;
    end
endmodule
