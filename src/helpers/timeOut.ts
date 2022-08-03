export function timeOut(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
