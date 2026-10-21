module divide_number_8bits (
    input logic [7:0] dividend,
    input logic [7:0] divisor,
    output logic [7:0] quotient,
    output logic [7:0] remainder,
    output logic divide_by_zero
);

    always_comb begin
        divide_by_zero = (divisor == 8'd0);
        quotient = 8'd0;
        remainder = dividend;
        if (divisor != 8'd0) begin
            quotient = dividend / divisor;
            remainder = dividend % divisor;
        end
    end

endmodule
