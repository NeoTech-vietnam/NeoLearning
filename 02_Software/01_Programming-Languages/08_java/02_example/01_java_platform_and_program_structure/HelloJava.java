public class HelloJava {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        System.out.println("Arguments: " + args.length);

        for (String argument : args) {
            System.out.println(argument);
        }
    }
}
