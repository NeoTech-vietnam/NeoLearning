// RAM 2^N x M theo Lecture 7: ghi canh len, doc khong dong bo.
// RAM chua duoc khoi tao: can ghi truoc khi doc du lieu co y nghia.
module ram #(
    parameter N = 6,
    parameter M = 32
) (
    input  logic         clk,
    input  logic         write_enable,
    input  logic [N-1:0] address,
    input  logic [M-1:0] write_data,
    output logic [M-1:0] read_data
);
    logic [M-1:0] memory [0:(2**N)-1];

    always_ff @(posedge clk) begin
        if (write_enable)
            memory[address] <= write_data;
    end

    assign read_data = memory[address];
endmodule
