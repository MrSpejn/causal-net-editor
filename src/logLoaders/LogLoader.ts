import ProcessLog from "./ProcessLog";

export interface LogLoader {
    loadLog(text: string): Promise<ProcessLog>
}