import java.util.Arrays;

public class ArraysStringsInput {
    public static void main(String[] args) {
        int[] original = {90, 85, 100};
        int[] copy = Arrays.copyOf(original, original.length);
        copy[0] = 70;

        String language = "Java";
        StringBuilder joined = new StringBuilder();
        for (int score : original) {
            joined.append(score).append(' ');
        }

        assert original[0] == 90;
        assert language.equals("Java");
        assert joined.toString().equals("90 85 100 ");

        System.out.println("Original: " + Arrays.toString(original));
        System.out.println("Copy: " + Arrays.toString(copy));
        System.out.println(language.toUpperCase());
        System.out.println(joined.toString().strip());
    }
}
