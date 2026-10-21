module compare_2_number_8bits (
    input logic [7:0] a,
    input logic [7:0] b,
    output logic lt,
    output logic eq,
    output logic gt
);

    assign lt = (a < b);
    assign eq = (a == b);
    assign gt = (a > b);

endmodule
