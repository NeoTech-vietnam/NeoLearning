public class Challenge {
    static int safeAdd(int left, int right) {
        return Math.addExact(left, right);
    }

    public static void main(String[] args) {
        assert safeAdd(20, 22) == 42;

        try {
            safeAdd(Integer.MAX_VALUE, 1);
            throw new AssertionError("Overflow should fail");
        } catch (ArithmeticException expected) {
            System.out.println("Overflow detected: " + expected.getMessage());
        }
    }
}
