module encoder_direction (
    input  logic A,
    input  logic B,
    input  logic reset,
    output logic Q
);
    always_ff @(posedge A or posedge reset) begin
        if (reset)
            Q <= 1'b0;
        else
            Q <= B;
    end
endmodule
