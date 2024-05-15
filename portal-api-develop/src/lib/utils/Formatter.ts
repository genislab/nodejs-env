export class Formatter {
    public static format(str: string, args: Array<string>) {
        for (let k in args) {
            str = str.replace("{" + k + "}", args[k]);
        }
        return str;
    }
};