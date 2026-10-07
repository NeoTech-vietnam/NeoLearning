// 2:1 combinational multiplexer.
// When sel is 0, y follows a; when sel is 1, y follows b.
module mux2 (
    input  logic a,
    input  logic b,
    input  logic sel,
    output logic y
);
    always_comb begin
        y = sel ? b : a;
    end
endmodule
