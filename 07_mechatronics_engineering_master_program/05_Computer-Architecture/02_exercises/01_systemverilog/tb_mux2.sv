// Exhaustively checks all input combinations and records a GTKWave trace.
module tb_mux2;
    logic a;
    logic b;
    logic sel;
    logic y;
    integer vector;

    mux2 dut (
        .a(a),
        .b(b),
        .sel(sel),
        .y(y)
    );

    initial begin
        $dumpfile("build/mux2.vcd");
        $dumpvars(0, tb_mux2);

        for (vector = 0; vector < 8; vector = vector + 1) begin
            {sel, b, a} = vector[2:0];
            #1;

            if (y !== (sel ? b : a)) begin
                $fatal(1, "FAIL: sel=%b b=%b a=%b y=%b", sel, b, a, y);
            end

            $display("sel=%b b=%b a=%b -> y=%b", sel, b, a, y);
            #4;
        end

        $display("PASS: all 8 input combinations produced the expected output.");
        $finish;
    end
endmodule
