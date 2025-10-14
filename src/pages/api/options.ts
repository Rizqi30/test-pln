import db from "@/lib/db";

export default async function handler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // Query data berdasarkan id
        const dataProjects = await db.projects.findMany();
        const dataProjectOptions = dataProjects.map((project: any) => ({
          value: project.id,
          label: project.name,
        }));
        const dataUsers = await db.users.findMany();
        const dataUserOptions = dataUsers.map((user: any) => ({
          value: user.id,
          label: user.name,
        }));
        const data = { project: dataProjectOptions, users: dataUserOptions };

        res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching data by ID:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching data" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
