module tb_and_gate;
    logic a;
    logic b;
    logic y;
    integer vector;

    and_gate dut (
        .a(a),
        .b(b),
        .y(y)
    );

    initial begin
        $dumpfile("build/and_gate.vcd");
        $dumpvars(0, tb_and_gate);

        for (vector = 0; vector < 4; vector = vector + 1) begin
            {a, b} = vector[1:0];
            #1;

            if (y !== (a & b)) begin
                $fatal(1, "FAIL: a=%b b=%b y=%b", a, b, y);
            end

            $display("a=%b b=%b -> y=%b", a, b, y);
            #4;
        end

        $display("PASS: all 4 input combinations produced the expected output.");
        $finish;
    end
endmodule
