interface HealthStatus {
  status: "ok";
  uptime: string;
}

export const getHealthStatus = (): HealthStatus => {
  return {
    status: "ok",
    uptime: `${Math.floor(process.uptime())}s`,
  };
};
