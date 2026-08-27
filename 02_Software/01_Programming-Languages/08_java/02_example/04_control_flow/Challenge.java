public class Challenge {
    static String fizzBuzz(int value) {
        if (value % 15 == 0) {
            return "FizzBuzz";
        }
        if (value % 3 == 0) {
            return "Fizz";
        }
        if (value % 5 == 0) {
            return "Buzz";
        }
        return Integer.toString(value);
    }

    public static void main(String[] args) {
        assert fizzBuzz(3).equals("Fizz");
        assert fizzBuzz(5).equals("Buzz");
        assert fizzBuzz(15).equals("FizzBuzz");
        assert fizzBuzz(7).equals("7");

        for (int value = 1; value <= 20; value++) {
            System.out.println(fizzBuzz(value));
        }
    }
}
