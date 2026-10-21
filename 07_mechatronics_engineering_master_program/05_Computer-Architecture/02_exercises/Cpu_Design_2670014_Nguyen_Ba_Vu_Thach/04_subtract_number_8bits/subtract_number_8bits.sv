module subtract_number_8bits (
    input logic [7:0] a,
    input logic [7:0] b,
    output logic [7:0] difference,
    output logic borrow
);

    assign difference = a - b;
    assign borrow = (a < b);

endmodule
