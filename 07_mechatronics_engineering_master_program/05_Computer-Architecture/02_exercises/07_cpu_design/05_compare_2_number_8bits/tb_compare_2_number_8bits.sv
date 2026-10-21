`timescale 1ns/1ps

module tb_compare_2_number_8bits;
    logic [7:0] a, b;
    logic lt, eq, gt;
    logic [2:0] expected;
    integer vector;

    compare_2_number_8bits dut (
        .a(a), .b(b), .lt(lt), .eq(eq), .gt(gt)
    );

    initial begin
        $dumpfile("build/compare_2_number_8bits.vcd");
        $dumpvars(0, tb_compare_2_number_8bits);

        // Hold each demonstration for 10 ns before exhaustive testing.
        a = 8'd12; b = 8'd20;
        #10;
        if ({lt, eq, gt} !== 3'b100) $fatal(1, "FAIL: compare example 1");
        $display("EXAMPLE 1: a=%0d (%b), b=%0d (%b) -> lt=%b eq=%b gt=%b (a < b)",
                 a, a, b, b, lt, eq, gt);

        a = 8'd20; b = 8'd20;
        #10;
        if ({lt, eq, gt} !== 3'b010) $fatal(1, "FAIL: compare example 2");
        $display("EXAMPLE 2: a=%0d (%b), b=%0d (%b) -> lt=%b eq=%b gt=%b (a == b)",
                 a, a, b, b, lt, eq, gt);

        for (vector = 0; vector < 65536; vector = vector + 1) begin
            {a, b} = vector[15:0];
            if (int'(a) - int'(b) < 0) expected = 3'b100;
            else if (int'(a) - int'(b) == 0) expected = 3'b010;
            else expected = 3'b001;
            #1;
            if ({lt, eq, gt} !== expected)
                $fatal(1, "FAIL: a=%0d b=%0d lt/eq/gt=%b expected=%b",
                       a, b, {lt, eq, gt}, expected);
        end

        $display("PASS: all 65536 input combinations produced the expected output.");
        $finish;
    end
endmodule
