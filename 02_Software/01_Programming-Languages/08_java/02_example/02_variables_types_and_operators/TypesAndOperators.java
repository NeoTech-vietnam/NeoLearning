import java.util.Objects;

public class TypesAndOperators {
    public static void main(String[] args) {
        int whole = 7 / 2;
        double precise = 7 / 2.0;
        double measured = 12.9;
        int truncated = (int) measured;

        String first = new String("Java");
        String second = new String("Java");

        assert whole == 3;
        assert precise == 3.5;
        assert truncated == 12;
        assert first != second;
        assert Objects.equals(first, second);

        System.out.printf("whole=%d precise=%.1f truncated=%d%n", whole, precise, truncated);
        System.out.println("same identity: " + (first == second));
        System.out.println("same value: " + first.equals(second));
    }
}
