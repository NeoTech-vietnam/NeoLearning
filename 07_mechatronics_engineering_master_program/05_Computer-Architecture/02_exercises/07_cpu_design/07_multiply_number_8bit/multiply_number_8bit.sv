module multiply_number_8bit (
    input logic [7:0] a,
    input logic [7:0] b,
    output logic [15:0] product
);

    assign product = {8'b0, a} * {8'b0, b};

endmodule
