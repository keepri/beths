export class Millis {
    public static sec(multiplier: number = 1): number {
        return multiplier * 1000;
    }

    public static min(multiplier: number = 1): number {
        return multiplier * this.sec() * 60;
    }

    public static hour(multiplier: number = 1): number {
        return multiplier * this.min() * 60;
    }

    public static day(multiplier: number = 1): number {
        return multiplier * this.hour() * 24;
    }

    public static week(multiplier: number = 1): number {
        return multiplier * this.day() * 7;
    }

    public static month(daysMonth: number = 30): number {
        return this.day() * daysMonth;
    }

    public static year(options?: { leap?: true }): number {
        if (options?.leap) {
            return this.day() * 366;
        }

        return this.day() * 365;
    }
}
