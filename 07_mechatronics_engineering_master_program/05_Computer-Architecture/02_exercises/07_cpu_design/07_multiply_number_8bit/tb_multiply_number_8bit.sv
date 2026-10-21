`timescale 1ns/1ps

module tb_multiply_number_8bit;
    logic [7:0] a, b;
    logic [15:0] product, expected;
    integer term;
    integer vector;

    multiply_number_8bit dut (
        .a(a), .b(b), .product(product)
    );

    initial begin
        $dumpfile("build/multiply_number_8bit.vcd");
        $dumpvars(0, tb_multiply_number_8bit);

        // Hold each demonstration for 10 ns before exhaustive testing.
        a = 8'd13; b = 8'd7;
        #10;
        if (product !== 16'd91) $fatal(1, "FAIL: multiply example 1");
        $display("EXAMPLE 1: %0d (%b) * %0d (%b) -> product=%0d (%b)",
                 a, a, b, b, product, product);

        a = 8'd255; b = 8'd255;
        #10;
        if (product !== 16'd65025) $fatal(1, "FAIL: multiply example 2");
        $display("EXAMPLE 2: %0d (%b) * %0d (%b) -> product=%0d (%b)",
                 a, a, b, b, product, product);

        for (vector = 0; vector < 65536; vector = vector + 1) begin
            {a, b} = vector[15:0];
            expected = 0;
            for (term = 0; term < int'(b); term = term + 1)
                expected = expected + {8'b0, a};
            #1;
            if (product !== expected)
                $fatal(1, "FAIL: a=%0d b=%0d product=%0d expected=%0d",
                       a, b, product, expected);
        end

        $display("PASS: all 65536 input combinations produced the expected output.");
        $finish;
    end
endmodule
