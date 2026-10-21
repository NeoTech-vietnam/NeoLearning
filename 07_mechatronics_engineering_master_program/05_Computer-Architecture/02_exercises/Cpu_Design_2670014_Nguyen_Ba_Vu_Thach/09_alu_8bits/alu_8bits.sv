module alu_8bits (
    input logic [7:0] a,
    input logic [7:0] b,
    input logic cin,
    input logic [3:0] shift_amount,
    input logic [2:0] opcode,
    output logic [15:0] result,
    output logic carry,
    output logic borrow,
    output logic lt,
    output logic eq,
    output logic gt,
    output logic [7:0] remainder,
    output logic divide_by_zero
);

    logic [7:0] add_sum, difference, shifted, quotient, div_remainder;
    logic add_carry, sub_borrow, compare_lt, compare_eq, compare_gt, div_zero;
    logic [15:0] product;

    ripple_carry_adder_8bits adder (
        .a(a), .b(b), .cin(cin), .sum(add_sum), .cout(add_carry)
    );
    subtract_number_8bits subtractor (
        .a(a), .b(b), .difference(difference), .borrow(sub_borrow)
    );
    compare_2_number_8bits comparator (
        .a(a), .b(b), .lt(compare_lt), .eq(compare_eq), .gt(compare_gt)
    );
    shift_number_8bits shifter (
        .value(a), .amount(shift_amount), .direction(opcode == 3'd4), .result(shifted)
    );
    multiply_number_8bit multiplier (
        .a(a), .b(b), .product(product)
    );
    divide_number_8bits divider (
        .dividend(a), .divisor(b), .quotient(quotient),
        .remainder(div_remainder), .divide_by_zero(div_zero)
    );

    // Inactive outputs are cleared for every operation.
    always_comb begin
        result = 16'd0;
        carry = 1'b0;
        borrow = 1'b0;
        lt = 1'b0;
        eq = 1'b0;
        gt = 1'b0;
        remainder = 8'd0;
        divide_by_zero = 1'b0;

        case (opcode)
            3'd0: begin // ADD
                result = {8'd0, add_sum};
                carry = add_carry;
            end
            3'd1: begin // SUB
                result = {8'd0, difference};
                borrow = sub_borrow;
            end
            3'd2: begin // CMP
                lt = compare_lt;
                eq = compare_eq;
                gt = compare_gt;
            end
            3'd3, 3'd4: result = {8'd0, shifted}; // SHL, SHR
            3'd5: result = product; // MUL
            3'd6: begin // DIV
                result = {8'd0, quotient};
                remainder = div_remainder;
                divide_by_zero = div_zero;
            end
            default: begin end // Reserved opcode: all outputs zero.
        endcase
    end

endmodule
