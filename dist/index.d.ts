interface DefaultOptions {
    uuid: string | undefined;
    requestUrl: string | undefined;
    historyTracker: boolean;
    hashTracker: boolean;
    domTracker: boolean;
    sdkVersion: string | number;
    extra: Record<string, any> | undefined;
    jsError: boolean;
}
interface Options extends Partial<DefaultOptions> {
    requestUrl: string;
}

declare class Tracker {
    data: Options;
    constructor(options: Options);
    private initDef;
    setUserId<T extends DefaultOptions['uuid']>(uuid: T): void;
    setExtra<T extends DefaultOptions['extra']>(extra: T): void;
    sendTracker<T>(data: T): void;
    private targetKeyReport;
    private captureEvents;
    private installTracker;
    private installhandle;
    private jsError;
    private errorEvent;
    private promiseReject;
    private reportTracker;
}

export { Tracker as default };
