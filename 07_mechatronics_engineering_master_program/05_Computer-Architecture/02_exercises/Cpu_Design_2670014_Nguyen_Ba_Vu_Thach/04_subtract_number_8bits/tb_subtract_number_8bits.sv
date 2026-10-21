`timescale 1ns/1ps

module tb_subtract_number_8bits;
    logic [7:0] a, b, difference;
    logic borrow;
    logic [7:0] expected;
    logic expected_borrow;
    integer vector;

    subtract_number_8bits dut (
        .a(a), .b(b), .difference(difference), .borrow(borrow)
    );

    initial begin
        $dumpfile("build/subtract_number_8bits.vcd");
        $dumpvars(0, tb_subtract_number_8bits);

        // Hold each demonstration for 10 ns before exhaustive testing.
        a = 8'd20; b = 8'd7;
        #10;
        if ({borrow, difference} !== {1'b0, 8'd13}) $fatal(1, "FAIL: subtract example 1");
        $display("EXAMPLE 1: %0d (%b) - %0d (%b) -> difference=%0d (%b), borrow=%b",
                 a, a, b, b, difference, difference, borrow);

        a = 8'd0; b = 8'd1;
        #10;
        if ({borrow, difference} !== {1'b1, 8'd255}) $fatal(1, "FAIL: subtract example 2");
        $display("EXAMPLE 2: %0d (%b) - %0d (%b) -> difference=%0d (%b), borrow=%b (8-bit wraparound)",
                 a, a, b, b, difference, difference, borrow);

        for (vector = 0; vector < 65536; vector = vector + 1) begin
            {a, b} = vector[15:0];
            expected = (256 + int'(a) - int'(b)) % 256;
            expected_borrow = int'(a) < int'(b);
            #1;
            if ({borrow, difference} !== {expected_borrow, expected})
                $fatal(1, "FAIL: a=%0d b=%0d difference=%0d borrow=%b",
                       a, b, difference, borrow);
        end

        $display("PASS: all 65536 input combinations produced the expected output.");
        $finish;
    end
endmodule
