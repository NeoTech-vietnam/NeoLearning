// ROM 4 x 3: bang noi dung theo Lecture 7, trang 24-25.
module rom (
    input  logic [1:0] address,
    output logic [2:0] data
);
    always_comb begin
        case (address)
            2'b00: data = 3'b011;
            2'b01: data = 3'b110;
            2'b10: data = 3'b100;
            2'b11: data = 3'b010;
            default: data = 3'bxxx;
        endcase
    end
endmodule
