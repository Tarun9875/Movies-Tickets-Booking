export const logInfo = (message: string, data?: any) => {
  console.log(`ℹ️  ${message}`, data || "");
};

export const logSuccess = (message: string, data?: any) => {
  console.log(`✅ ${message}`, data || "");
};

export const logError = (message: string, error?: any) => {
  console.error(`❌ ${message}`, error?.message || error || "");
};
