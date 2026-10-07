module exercise_01b(
    input logic a,
    input logic b,
    input logic c,
    output logic y
);
    assign y = (~a & ~b & ~c) | (a & b & c);

endmodule