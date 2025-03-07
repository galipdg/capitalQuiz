const logger = {
    info: (message) => console.log(`INFO: ${message}`),
    warn: (message) => console.warn(`WARN: ${message}`),
    error: (message, details = "") => console.error(`ERROR: ${message}`, details),
  };
  
  export default logger;