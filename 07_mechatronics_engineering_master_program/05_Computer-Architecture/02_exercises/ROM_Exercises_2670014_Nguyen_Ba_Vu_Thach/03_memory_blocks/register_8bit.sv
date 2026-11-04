// Thanh ghi 8 bit: reset dong bo, enable ghi tai canh len cua clock.
module register_8bit (
    input  logic       clk,
    input  logic       reset,
    input  logic       enable,
    input  logic [7:0] d,
    output logic [7:0] q
);
    always_ff @(posedge clk) begin
        if (reset)
            q <= 8'h00;
        else if (enable)
            q <= d;
    end
endmodule
