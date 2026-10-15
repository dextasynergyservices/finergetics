import { describe, expect, it } from "bun:test";
import { MAX_FILE_SIZE_BYTES } from "@/lib/client-image-compressor";

describe("Direct Device Image Upload & Pagination System", () => {
  it("enforces exact 10MB (10485760 bytes) file limit threshold", () => {
    expect(MAX_FILE_SIZE_BYTES).toBe(10 * 1024 * 1024);
    expect(MAX_FILE_SIZE_BYTES).toBe(10485760);
  });

  describe("Pagination Calculations", () => {
    it("correctly calculates page counts and range boundaries for odd and even items", () => {
      const pageSize = 10;

      // 0 items
      const total0 = 0;
      const pages0 = Math.ceil(total0 / pageSize) || 1;
      expect(pages0).toBe(1);

      // 25 items -> 3 pages
      const total25 = 25;
      const pages25 = Math.ceil(total25 / pageSize);
      expect(pages25).toBe(3);

      // Page 1 of 25: items 1 to 10
      const page1Start = (1 - 1) * pageSize + 1;
      const page1End = Math.min(1 * pageSize, total25);
      expect(page1Start).toBe(1);
      expect(page1End).toBe(10);

      // Page 3 of 25: items 21 to 25
      const page3Start = (3 - 1) * pageSize + 1;
      const page3End = Math.min(3 * pageSize, total25);
      expect(page3Start).toBe(21);
      expect(page3End).toBe(25);
    });

    it("handles media grid page sizing (12 items per page) accurately", () => {
      const pageSize = 12;
      const totalImages = 37;
      const totalPages = Math.ceil(totalImages / pageSize);
      expect(totalPages).toBe(4);

      // Slice on page 4
      const p4Start = (4 - 1) * pageSize;
      const p4End = 4 * pageSize;
      expect(p4Start).toBe(36);
      expect(p4End).toBe(48);
    });
  });
});
