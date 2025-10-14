import db from "@/lib/db";

export default async function handler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        // Query data berdasarkan id
        const data = await db.projects.findMany();
        res.status(200).json(data);
      } catch (error) {
        console.error("Error fetching data by ID:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching data" });
      }
      break;

    case "POST":
      const { name, location } = req.body;

      if (!name || !location) {
        return res.status(400).json({ error: "All fields are required" });
      }

      try {
        // Menambahkan project baru atau memperbarui project yang ada
        const newProject = await db.projects.create({
          data: {
            name,
            location,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        res.status(201).json(newProject);
      } catch (error) {
        console.error("Error creating or updating project:", error);
        res.status(500).json({
          error: "An error occurred while creating or updating project",
        });
      }
      break;

    case "PUT": {
      const { id } = req.query;
      const { name, location } = req.body;

      try {
        if (!id) {
          return res.status(400).json({ error: "User ID is required" });
        }

        // Hash password if provided
        const updatedData: any = {
          name,
          location,
        };

        const updatedUser = await db.projects.update({
          where: { id: parseInt(id) },
          data: updatedData,
        });

        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        res
          .status(500)
          .json({ error: "An error occurred while updating user" });
      }
      break;
    }

    case "DELETE": {
      const { id } = req.query;

      try {
        if (!id) {
          return res.status(400).json({ error: "User ID is required" });
        }

        await db.projects.delete({
          where: { id: parseInt(id) },
        });

        res
          .status(200)
          .json({ message: `User with ID ${id} deleted successfully` });
      } catch (error) {
        console.error("Error deleting user:", error);
        res
          .status(500)
          .json({ error: "An error occurred while deleting user" });
      }
      break;
    }

    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
