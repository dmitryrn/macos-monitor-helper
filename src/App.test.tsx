import { getDisplayTotalMem, parseMem } from "./App";

describe("getDisplayTotalMem", () => {
  test("with 0 Kb", () => {
    expect(getDisplayTotalMem(0)).toBe("0.00 KB");
  });

  test("with 10 KB", () => {
    expect(getDisplayTotalMem(10)).toBe("10.00 KB");
  });

  test("with 1023 KB", () => {
    expect(getDisplayTotalMem(1023)).toBe("1023.00 KB");
  });

  test("with 1024 KB", () => {
    expect(getDisplayTotalMem(1024)).toBe("1.00 MB");
  });

  test("with 1024+512 KB", () => {
    expect(getDisplayTotalMem(1024 + 512)).toBe("1.50 MB");
  });

  test("with 1024*1024 KB", () => {
    expect(getDisplayTotalMem(1024 * 1024)).toBe("1.00 GB");
  });
});

describe("parseMem", () => {
  test("with 10 KB", () => {
    expect(parseMem("10 KB")).toBe(10);
  });

  test("with 2 MB", () => {
    expect(parseMem("2 MB")).toBe(1024 * 2);
  });

  test("with 2 GB", () => {
    expect(parseMem("2 GB")).toBe(1024 * 1024 * 2);
  });

  test("with 3,48 GB", () => {
    expect(parseMem("3,48 GB")).toBe(3649044.48);
  });
});
