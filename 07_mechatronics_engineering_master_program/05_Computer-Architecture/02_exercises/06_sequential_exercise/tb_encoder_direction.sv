module tb_encoder_direction;
    logic A, B, reset, Q;
    logic expected;
    integer sample;

    encoder_direction dut (.A(A), .B(B), .reset(reset), .Q(Q));

    initial begin
        $dumpfile("build/encoder_direction.vcd");
        $dumpvars(0, tb_encoder_direction);
        A = 0;
        B = 0;
        reset = 1;
        expected = 0;
        #2 reset = 0;

        // Exercise 2 sequence: sample B=1,1,0,0,1 at each rising edge of A.
        for (sample = 0; sample < 5; sample = sample + 1) begin
            B = (sample < 2 || sample == 4);
            #2 A = 1;
            #1;
            expected = B;
            if (Q !== expected)
                $fatal(1, "FAIL: sample=%0d B=%b Q=%b", sample + 1, B, Q);
            $display("sample=%0d B=%b -> Q=%b (%s)", sample + 1, B, Q, Q ? "CCW" : "CW");
            #2 A = 0;
            #1;
            if (Q !== expected)
                $fatal(1, "FAIL: Q did not hold between A rising edges");
        end

        $display("PASS: captured 1,1,0,0,1 and held Q between rising edges.");
        $finish;
    end
endmodule
