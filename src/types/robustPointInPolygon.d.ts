declare module "robust-point-in-polygon" {
  type VectorArray = number[];

  /*
    -1 if point is contained inside loop
    0 if point is on the boundary of loop
    1 if point is outside loop
  */
  type Result = -1 | 0 | 1;

  export default function robustPointInPolygon(
    loop: VectorArray[],
    point: VectorArray
  ): Result;
}
