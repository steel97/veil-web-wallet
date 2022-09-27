export enum LogLevel {
    DEBUG = 1,
    WARNING = 2,
    INFO = 3,
    ERROR = 4,
}

export class Logging {
    private static currentLogLevel = LogLevel.INFO;

    public static setLogLevel(level: LogLevel) {
        Logging.currentLogLevel = level;
    }

    private static getMessage(prefix: string, message: string) {
        return `[veil] :: ${prefix}\t::\t${message}`;
    }

    public static trace(message: any, level: LogLevel = LogLevel.INFO) {
        if (level < this.currentLogLevel) return;

        switch (level) {
            case LogLevel.DEBUG:
                // eslint-disable-next-line
                console.debug(Logging.getMessage("debug", message));
                break;
            case LogLevel.WARNING:
                // eslint-disable-next-line
                console.warn(Logging.getMessage("warning", message));
                break;
            case LogLevel.INFO:
                // eslint-disable-next-line
                console.log(Logging.getMessage("info", message));
                break;
            case LogLevel.ERROR:
                {
                    const data = Logging.getMessage("error", message);
                    // eslint-disable-next-line
                    console.error(data);

                    try {
                        const event = new CustomEvent("traceCallback", { "detail": data });
                        window.dispatchEvent(event);
                    } catch {
                    }
                    break;
                }
        }
    }
}