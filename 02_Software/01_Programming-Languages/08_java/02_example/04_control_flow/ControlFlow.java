public class ControlFlow {
    static String classify(int value) {
        if (value < 0) {
            return "negative";
        }
        return value == 0 ? "zero" : "positive";
    }

    static String dayKind(String day) {
        return switch (day) {
            case "SATURDAY", "SUNDAY" -> "weekend";
            default -> "weekday";
        };
    }

    public static void main(String[] args) {
        int sum = 0;
        for (int value = 1; value <= 5; value++) {
            sum += value;
        }

        assert classify(-1).equals("negative");
        assert classify(0).equals("zero");
        assert dayKind("SUNDAY").equals("weekend");
        assert sum == 15;

        System.out.println("sum=" + sum);
        System.out.println(dayKind("MONDAY"));
    }
}
