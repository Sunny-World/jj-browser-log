export interface logOptions{
    realTimeLoggingOn?:boolean, // log in real time (forwards to console.log)
	useTimestamps?:boolean, // insert a timestamp in front of each log
	useLocalStorage ?:boolean, // store the output using window.localStorage() and continuously add to the same log each session
	recordLogs ?:boolean, // set to false after you're done debugging to avoid the log eating up memory
	autoTrim ?:boolean, // to avoid the log eating up potentially endless memory
	maxLines ?:number, // if autoTrim is true, this many most recent lines are saved
	tailNumLines ?:number, // how many lines tail() will retrieve
	logFilename?:string, // filename of log downloaded with downloadLog()
	maxDepth ?:number, // max recursion depth for logged objects
}