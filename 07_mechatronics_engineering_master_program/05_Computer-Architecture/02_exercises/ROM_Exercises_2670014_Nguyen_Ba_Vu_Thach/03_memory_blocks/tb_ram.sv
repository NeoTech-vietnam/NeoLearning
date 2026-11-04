`timescale 1ns/1ps

module tb_ram;
    logic clk = 0;
    logic write_enable = 0;
    logic [5:0] address = 0;
    logic [31:0] write_data = 0;
    logic [31:0] read_data;
    logic [1:0] small_address = 0;
    logic [7:0] small_write_data = 0, small_read_data;
    logic small_write_enable = 0;
    integer i;

    ram dut (.clk(clk), .write_enable(write_enable), .address(address),
             .write_data(write_data), .read_data(read_data));
    ram #(.N(2), .M(8)) small_ram (.clk(clk), .write_enable(small_write_enable),
        .address(small_address), .write_data(small_write_data), .read_data(small_read_data));
    always #5 clk = ~clk;

    initial begin
        $dumpfile("build/ram.vcd");
        $dumpvars(0, tb_ram);
        // Ghi tat ca 64 o tai canh len; thay input tai canh xuong.
        for (i = 0; i < 64; i = i + 1) begin
            @(negedge clk);
            address = i[5:0]; write_data = 32'hA0B00000 + i; write_enable = 1;
            @(posedge clk); #1;
            if (read_data !== (32'hA0B00000 + i))
                $fatal(1, "FAIL RAM write: address=%d read=%h", address, read_data);
        end
        @(negedge clk);
        write_enable = 0;
        write_data = 32'hFFFFFFFF;
        // Doc khong can doi canh len: du lieu thay doi khi address thay doi.
        for (i = 0; i < 64; i = i + 1) begin
            address = i[5:0]; #1;
            if (read_data !== (32'hA0B00000 + i))
                $fatal(1, "FAIL RAM read: address=%d read=%h", address, read_data);
        end
        // WE=0 qua canh len: gia tri tai dia chi 63 phai duoc giu.
        @(posedge clk); #1;
        if (read_data !== 32'hA0B0003F) $fatal(1, "FAIL RAM hold: read=%h", read_data);
        // Cau hinh thu hai xac nhan do rong dia chi va du lieu thay doi duoc.
        for (i = 0; i < 4; i = i + 1) begin
            @(negedge clk);
            small_address = i[1:0]; small_write_data = 8'h50 + i; small_write_enable = 1;
            @(posedge clk); #1;
        end
        @(negedge clk); small_write_enable = 0;
        for (i = 0; i < 4; i = i + 1) begin
            small_address = i[1:0]; #1;
            if (small_read_data !== (8'h50 + i))
                $fatal(1, "FAIL RAM 4x8: address=%d read=%h", small_address, small_read_data);
        end
        $display("PASS RAM: default 64x32 and parameterized 4x8.");
        $finish;
    end
endmodule
