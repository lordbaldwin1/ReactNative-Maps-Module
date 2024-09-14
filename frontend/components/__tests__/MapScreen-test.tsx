import { getMarkerColor } from "../map/MapScreen";
import { pinColors } from "@/styles/Colors";
describe("getMarkerColor", () => {
  it("should return correct color for private reserved status", () => {
    const color = getMarkerColor(true, true);
    expect(color).toBe(pinColors.privateReserved);
  });

  it("should return correct color for private available status", () => {
    const color = getMarkerColor(true, false);
    expect(color).toBe(pinColors.privateAvailable);
  });

  it("should return correct color for public reserved status", () => {
    const color = getMarkerColor(false, true);
    expect(color).toBe(pinColors.publicReserved);
  });

  it("should return correct color for public available status", () => {
    const color = getMarkerColor(false, false);
    expect(color).toBe(pinColors.publicAvailable);
  });
});
