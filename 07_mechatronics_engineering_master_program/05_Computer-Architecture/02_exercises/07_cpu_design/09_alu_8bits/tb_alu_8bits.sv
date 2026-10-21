`timescale 1ns/1ps

module tb_alu_8bits;
    logic [7:0] a, b, remainder;
    logic cin, carry, borrow, lt, eq, gt, divide_by_zero;
    logic [3:0] shift_amount;
    logic [2:0] opcode;
    logic [15:0] result;
    integer vector, operation, checks;

    alu_8bits dut (
        .a(a), .b(b), .cin(cin), .shift_amount(shift_amount), .opcode(opcode),
        .result(result), .carry(carry), .borrow(borrow), .lt(lt), .eq(eq), .gt(gt),
        .remainder(remainder), .divide_by_zero(divide_by_zero)
    );

    task automatic check_case (
        input logic [2:0] op,
        input logic [7:0] operand_a,
        input logic [7:0] operand_b,
        input logic carry_in,
        input logic [3:0] amount
    );
        logic [15:0] expected_result;
        logic expected_carry, expected_borrow, expected_lt, expected_eq, expected_gt;
        logic expected_zero;
        logic [7:0] expected_remainder;
        integer total;
        begin
            opcode = op;
            a = operand_a;
            b = operand_b;
            cin = carry_in;
            shift_amount = amount;
            expected_result = 0;
            expected_carry = 0;
            expected_borrow = 0;
            expected_lt = 0;
            expected_eq = 0;
            expected_gt = 0;
            expected_zero = 0;
            expected_remainder = 0;
            case (op)
                0: begin
                    total = int'(operand_a) + int'(operand_b) + int'(carry_in);
                    expected_result = total % 256;
                    expected_carry = (total >= 256);
                end
                1: begin
                    total = int'(operand_a) - int'(operand_b);
                    expected_result = (256 + total) % 256;
                    expected_borrow = (total < 0);
                end
                2: begin
                    total = int'(operand_a) - int'(operand_b);
                    expected_lt = (total < 0);
                    expected_eq = (total == 0);
                    expected_gt = (total > 0);
                end
                3: expected_result = (int'(operand_a) * (2 ** int'(amount))) % 256;
                4: expected_result = int'(operand_a) / (2 ** int'(amount));
                5: expected_result = int'(operand_a) * int'(operand_b);
                6: begin
                    expected_zero = (operand_b == 0);
                    if (expected_zero) expected_remainder = operand_a;
                    else begin
                        expected_result = int'(operand_a) / int'(operand_b);
                        expected_remainder = int'(operand_a) % int'(operand_b);
                    end
                end
                default: begin end
            endcase
            #1;
            if ({result, carry, borrow, lt, eq, gt, remainder, divide_by_zero} !==
                {expected_result, expected_carry, expected_borrow, expected_lt,
                 expected_eq, expected_gt, expected_remainder, expected_zero})
                $fatal(1, "FAIL: opcode=%0d a=%0d b=%0d cin=%b amount=%0d result=%0d expected=%0d flags=%b remainder=%0d",
                       opcode, a, b, cin, shift_amount, result, expected_result,
                       {carry, borrow, lt, eq, gt, divide_by_zero}, remainder);
            checks = checks + 1;
        end
    endtask

    task automatic demo (
        input string label,
        input logic [2:0] op,
        input logic [7:0] operand_a,
        input logic [7:0] operand_b,
        input logic carry_in,
        input logic [3:0] amount
    );
        begin
            check_case(op, operand_a, operand_b, carry_in, amount);
            $display("DEMO %s: a=%0d (%08b) b=%0d (%08b) cin=%b shift=%0d -> result=%0d (%016b) carry=%b borrow=%b lt/eq/gt=%b remainder=%0d zero=%b",
                     label, a, a, b, b, cin, shift_amount, result, result,
                     carry, borrow, {lt, eq, gt}, remainder, divide_by_zero);
            #9;
        end
    endtask

    initial begin
        $dumpfile("build/alu_8bits.vcd");
        $dumpvars(0, tb_alu_8bits);
        checks = 0;

        demo("ADD overflow", 0, 255, 1, 1, 0);
        demo("SUB borrow", 1, 0, 1, 1, 0);
        demo("CMP less than", 2, 12, 34, 1, 0);
        demo("SHL", 3, 129, 255, 1, 1);
        demo("SHR", 4, 129, 255, 1, 1);
        demo("MUL", 5, 255, 255, 1, 0);
        demo("DIV", 6, 29, 5, 1, 0);
        demo("DIV by zero", 6, 29, 0, 1, 0);
        demo("reserved", 7, 255, 255, 1, 15);

        // Keep the waveform focused on the nine examples; still check every case.
        $dumpoff;

        for (vector = 0; vector < 131072; vector = vector + 1)
            check_case(0, vector[16:9], vector[8:1], vector[0], vector[4:1]);

        // All operand pairs for SUB, CMP, MUL, DIV, and reserved opcode.
        // Vary ignored cin and shift_amount too; every check verifies inactive flags.
        for (operation = 1; operation < 8; operation = operation + 1) begin
            if (operation != 3 && operation != 4) begin
                for (vector = 0; vector < 65536; vector = vector + 1)
                    check_case(operation[2:0], vector[15:8], vector[7:0],
                               vector[0], vector[3:0]);
            end
        end

        for (operation = 3; operation <= 4; operation = operation + 1) begin
            for (vector = 0; vector < 4096; vector = vector + 1)
                check_case(operation[2:0], vector[11:4], vector[7:0],
                           vector[0], vector[3:0]);
        end

        $display("PASS: %0d checks (9 demos + 466944 exhaustive cases).", checks);
        $finish;
    end
endmodule
