public class Challenge {
    static String greeting(String name) {
        return "Hello, " + name + "!";
    }

    public static void main(String[] args) {
        String name = args.length == 0 ? "learner" : args[0];
        String result = greeting(name);
        assert result.equals("Hello, " + name + "!");
        System.out.println(result);
    }
}
