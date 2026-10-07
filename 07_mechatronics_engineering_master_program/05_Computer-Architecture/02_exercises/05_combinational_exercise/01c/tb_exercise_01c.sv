module tb_exercise_01c;
    logic a;
    logic b;
    logic c;
    logic y;
    integer vector;

    exercise_01c dut (
        .a(a),
        .b(b),
        .c(c),
        .y(y)
    );

    initial begin
        $dumpfile("build/exercise_01c.vcd");
        $dumpvars(0, tb_exercise_01c);

        for (vector = 0; vector < 8; vector = vector + 1) begin
            {a, b, c} = vector[2:0];
            #1;

            if (y !== ((~a & ~c) | (a & c) | (~b & ~c))) begin
                $fatal(1, "FAIL: a=%b b=%b c=%b y=%b", a, b, c, y);
            end

            $display("a=%b b=%b c=%b -> y=%b", a, b, c, y);
            #4;
        end

        $display("PASS: all 8 input combinations produced the expected output.");
        $finish;
    end
endmodule
