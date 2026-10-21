`timescale 1ns/1ps

module tb_shift_number_8bits;
    logic [7:0] value, result;
    logic [3:0] amount;
    logic direction;
    logic [7:0] expected;
    integer vector;

    shift_number_8bits dut (
        .value(value), .amount(amount), .direction(direction), .result(result)
    );

    initial begin
        $dumpfile("build/shift_number_8bits.vcd");
        $dumpvars(0, tb_shift_number_8bits);

        // Hold each demonstration for 10 ns before exhaustive testing.
        value = 8'd12; amount = 4'd1; direction = 1'b0;
        #10;
        if (result !== 8'd24) $fatal(1, "FAIL: shift example 1");
        $display("EXAMPLE 1: %0d (%b) << %0d -> %0d (%b), direction=%b (left)",
                 value, value, amount, result, result, direction);

        value = 8'd12; amount = 4'd1; direction = 1'b1;
        #10;
        if (result !== 8'd6) $fatal(1, "FAIL: shift example 2");
        $display("EXAMPLE 2: %0d (%b) >> %0d -> %0d (%b), direction=%b (right)",
                 value, value, amount, result, result, direction);

        for (vector = 0; vector < 8192; vector = vector + 1) begin
            {value, amount, direction} = vector[12:0];
            if (direction)
                expected = int'(value) / (2 ** int'(amount));
            else
                expected = (int'(value) * (2 ** int'(amount))) % 256;
            #1;
            if (result !== expected)
                $fatal(1, "FAIL: value=%0d amount=%0d direction=%b result=%0d expected=%0d",
                       value, amount, direction, result, expected);
        end

        $display("PASS: all 8192 input combinations produced the expected output.");
        $finish;
    end
endmodule
