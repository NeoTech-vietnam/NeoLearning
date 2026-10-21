module shift_number_8bits (
    input logic [7:0] value,
    input logic [3:0] amount,
    input logic direction,
    output logic [7:0] result
);

    // direction: 0 = logical left, 1 = logical right.
    assign result = direction ? (value >> amount) : (value << amount);

endmodule
