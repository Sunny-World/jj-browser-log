export interface logOptions {
    realTimeLoggingOn?: boolean;
    useTimestamps?: boolean;
    useLocalStorage?: boolean;
    recordLogs?: boolean;
    autoTrim?: boolean;
    maxLines?: number;
    tailNumLines?: number;
    logFilename?: string;
    maxDepth?: number;
}
