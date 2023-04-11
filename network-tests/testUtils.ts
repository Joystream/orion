export function waitMilliSec(milliseconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds); // 5000 milliseconds = 5 seconds
  });
}
