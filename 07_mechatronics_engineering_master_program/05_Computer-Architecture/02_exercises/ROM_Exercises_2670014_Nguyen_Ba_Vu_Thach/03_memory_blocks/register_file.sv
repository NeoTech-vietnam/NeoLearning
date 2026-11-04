// Register file 32 x 32: 2 cong doc, 1 cong ghi theo Lecture 7.
// Thanh ghi 0 luon doc duoc 0; cac thanh ghi khac chua duoc khoi tao.
module register_file (
    input  logic        clk,
    input  logic        write_enable,
    input  logic [4:0]  read_address1,
    input  logic [4:0]  read_address2,
    input  logic [4:0]  write_address,
    input  logic [31:0] write_data,
    output logic [31:0] read_data1,
    output logic [31:0] read_data2
);
    logic [31:0] registers [0:31];

    always_ff @(posedge clk) begin
        if (write_enable && write_address != 5'd0)
            registers[write_address] <= write_data;
    end

    assign read_data1 = (read_address1 == 5'd0) ? 32'd0 : registers[read_address1];
    assign read_data2 = (read_address2 == 5'd0) ? 32'd0 : registers[read_address2];
endmodule
