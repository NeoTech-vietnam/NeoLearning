module exercise_01c(
    input logic a,
    input logic b,
    input logic c,
    output logic y
);
    assign y = (~a & ~c) | (a & c) | (~b & ~c);

endmodule