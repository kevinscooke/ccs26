import { handler as run } from "../scripts_runner";

export default async () => {
  // Call the same code as the script; reuse prisma + generator
  const mod = await import("../../scripts/generate_from_series");
  await mod.default?.(); // if you export default main()
  // OR expose a named function and call it here
};
