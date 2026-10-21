module ripple_carry_adder_8bits (
    input logic [7:0] a,
    input logic [7:0] b,
    input logic cin,
    output logic [7:0] sum,
    output logic cout
);

    logic [8:0] carry;
    assign carry[0] = cin;
    assign cout = carry[8];

    genvar bit_index;
    generate
        for (bit_index = 0; bit_index < 8; bit_index = bit_index + 1) begin : stages
            full_adder stage (
                .a(a[bit_index]), .b(b[bit_index]), .cin(carry[bit_index]),
                .sum(sum[bit_index]), .cout(carry[bit_index + 1])
            );
        end
    endgenerate

endmodule
