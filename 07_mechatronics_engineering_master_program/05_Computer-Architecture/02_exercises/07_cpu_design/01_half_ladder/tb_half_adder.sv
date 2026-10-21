`timescale 1ns/1ps

module tb_half_adder;
    logic a;
    logic b;
    logic sum;
    logic carry;
    logic [1:0] expected;
    integer vector;

    half_adder dut (
        .a(a),
        .b(b),
        .sum(sum),
        .carry(carry)
    );

    initial begin
        $dumpfile("build/half_adder.vcd");
        $dumpvars(0, tb_half_adder);

        for (vector = 0; vector < 4; vector = vector + 1) begin
            {a, b} = vector[1:0];
            expected = {1'b0, a} + {1'b0, b};
            #1;

            if ({carry, sum} !== expected) begin
                $fatal(1, "FAIL: a=%b b=%b carry=%b sum=%b expected=%b",
                       a, b, carry, sum, expected);
            end

            $display("a=%b b=%b -> carry=%b sum=%b", a, b, carry, sum);
            #4;
        end

        $display("PASS: all 4 input combinations produced the expected output.");
        $finish;
    end
endmodule
