public class Challenge {
    static int minimum(int[] values) {
        if (values.length == 0) {
            throw new IllegalArgumentException("values must not be empty");
        }

        int minimum = values[0];
        for (int value : values) {
            minimum = Math.min(minimum, value);
        }
        return minimum;
    }

    static String reverse(String text) {
        return new StringBuilder(text).reverse().toString();
    }

    public static void main(String[] args) {
        assert minimum(new int[] {8, -2, 4}) == -2;
        assert reverse("Java").equals("avaJ");
        System.out.println("Checks passed");
    }
}
