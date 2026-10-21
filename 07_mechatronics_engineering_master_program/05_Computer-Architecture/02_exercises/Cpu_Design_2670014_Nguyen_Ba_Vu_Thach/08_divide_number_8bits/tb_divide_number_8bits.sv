`timescale 1ns/1ps

module tb_divide_number_8bits;
    logic [7:0] dividend, divisor, quotient, remainder;
    logic divide_by_zero;
    logic [7:0] expected_quotient, expected_remainder;
    logic expected_zero;
    integer remaining, count;
    integer vector;

    divide_number_8bits dut (
        .dividend(dividend), .divisor(divisor), .quotient(quotient), .remainder(remainder), .divide_by_zero(divide_by_zero)
    );

    initial begin
        $dumpfile("build/divide_number_8bits.vcd");
        $dumpvars(0, tb_divide_number_8bits);

        // Hold each demonstration for 10 ns before exhaustive testing.
        dividend = 8'd23; divisor = 8'd5;
        #10;
        if ({divide_by_zero, quotient, remainder} !== {1'b0, 8'd4, 8'd3})
            $fatal(1, "FAIL: divide example 1");
        $display("EXAMPLE 1: %0d (%b) / %0d (%b) -> quotient=%0d (%b), remainder=%0d (%b), divide_by_zero=%b",
                 dividend, dividend, divisor, divisor, quotient, quotient, remainder, remainder, divide_by_zero);

        dividend = 8'd23; divisor = 8'd0;
        #10;
        if ({divide_by_zero, quotient, remainder} !== {1'b1, 8'd0, 8'd23})
            $fatal(1, "FAIL: divide example 2");
        $display("EXAMPLE 2: %0d (%b) / %0d (%b) -> quotient=%0d (%b), remainder=%0d (%b), divide_by_zero=%b (invalid division)",
                 dividend, dividend, divisor, divisor, quotient, quotient, remainder, remainder, divide_by_zero);

        for (vector = 0; vector < 65536; vector = vector + 1) begin
            {dividend, divisor} = vector[15:0];
            remaining = int'(dividend);
            count = 0;
            expected_zero = (divisor == 0);
            if (!expected_zero) begin
                while (remaining >= int'(divisor)) begin
                    remaining = remaining - int'(divisor);
                    count = count + 1;
                end
            end
            expected_quotient = count;
            expected_remainder = remaining;
            #1;
            if ({divide_by_zero, quotient, remainder} !==
                {expected_zero, expected_quotient, expected_remainder})
                $fatal(1, "FAIL: dividend=%0d divisor=%0d quotient=%0d remainder=%0d zero=%b",
                       dividend, divisor, quotient, remainder, divide_by_zero);
        end

        $display("PASS: all 65536 input combinations produced the expected output.");
        $finish;
    end
endmodule
